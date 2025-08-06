import { LogType, ClipType } from "../../../schemas/log";
import { LogOptions } from "../../../schemas/project";
import { rangesOverlap, timecodeToSeconds } from "../format/format-timecode";

export interface MergedClip extends ClipType {
  // Additional fields from custom, appended at the top level
  [key: string]: unknown;
}

/**
 * Main function: orchestrates merging of OCF, Proxy, Custom, and Sound clips
 * from a given DatalogType into an array of `MergedClip`.
 */
export async function mergeClips(
  log: Pick<LogType, "ocf" | "sound" | "proxy" | "custom">,
  options: LogOptions
): Promise<MergedClip[]> {
  const clipMap = new Map<string, MergedClip>();

  // Process each merge operation asynchronously in parallel
  await Promise.all([
    // 1) Merge OCF
    Promise.resolve().then(() => mergeOcfClips(clipMap, log)),
    // 2) Merge Proxy
    Promise.resolve().then(() => mergeProxyClips(clipMap, log)),
    // 3) Merge Custom
    Promise.resolve().then(() => mergeCustomEntries(clipMap, log, options)),
    // 4) Merge Sound (by timecode overlap)
    Promise.resolve().then(() =>
      mergeSoundClips(clipMap, log, options.match_sound)
    ),
  ]);

  return Array.from(clipMap.values());
}

/* -----------------------------------------------------------
   1) Merge OCF
   - OCF clips define a "base" set of fields.
   - We can simply assign all OCF fields to the merged object.
----------------------------------------------------------- */
function mergeOcfClips(
  clipMap: Map<string, MergedClip>,
  log: Pick<LogType, "ocf">
): void {
  const ocfClips = log.ocf?.clips || [];

  mergeIntoMap(clipMap, ocfClips, (merged, ocfClip) => {
    // Copy all fields from ocfClip to merged in one go:
    Object.assign(merged, ocfClip);
  });
}

/* -----------------------------------------------------------
   2) Merge Proxy
   - For each Proxy clip, embed its relevant fields 
     under mergedClip.proxy = { ... }.
----------------------------------------------------------- */
function mergeProxyClips(
  clipMap: Map<string, MergedClip>,
  log: Pick<LogType, "proxy">
): void {
  const proxyClips = log.proxy?.clips || [];

  mergeIntoMap(clipMap, proxyClips, (merged, proxyClip) => {
    merged.proxy = {
      size: proxyClip.size,
      format: proxyClip.format,
      codec: proxyClip.codec,
      resolution: proxyClip.resolution,
    };
  });
}

/* -----------------------------------------------------------
   3) Merge Custom
   - Each "custom" item also has a `clip` field. We attach all 
     other fields on top-level of the merged clip object.
----------------------------------------------------------- */
function mergeCustomEntries(
  clipMap: Map<string, MergedClip>,
  log: Pick<LogType, "custom">,
  options: LogOptions
): void {
  if (!options.match_schemas || !options.schemas || !options.schemas.length)
    return;
  // Sort schemas by their order field without mutating the original array
  const sortedSchemas = options.schemas
    .slice()
    .sort((a, b) => a.order - b.order);
  for (const schema of sortedSchemas) {
    const clips = log.custom?.find((c) => c.schema === schema.id)?.clips || [];
    if (!clips.length) continue;
    if (schema.sync === "clip") {
      const filteredClips = clips.filter(
        (c): c is { clip: string } & typeof c => typeof c.clip === "string"
      );
      mergeIntoMap(clipMap, filteredClips, (merged, customObj) => {
        // Exclude the 'clip' property, then add everything else
        const { clip, ...rest } = customObj;
        Object.assign(merged, rest);
      });
    }
    if (schema.sync === "tc") {
      const filteredClips = clips.filter(
        (c): c is { tc_start: string; tc_end: string } & typeof c =>
          typeof c.tc_start === "string" && typeof c.tc_end === "string"
      );
      // Build and sort merged clips by timecode
      const mergedList = Array.from(clipMap.values())
        .filter(
          (mc): mc is { tc_start: string; tc_end: string } & typeof mc =>
            typeof mc.tc_start === "string" && typeof mc.tc_end === "string"
        )
        .map((mc) => ({
          mergedClip: mc,
          start: timecodeToSeconds(mc.tc_start),
          end: timecodeToSeconds(mc.tc_end),
        }))
        .sort((a, b) => a.start - b.start);
      // Build and sort custom clips by timecode
      const customList = filteredClips
        .map((c) => ({
          customClip: c,
          start: timecodeToSeconds(c.tc_start),
          end: timecodeToSeconds(c.tc_end),
        }))
        .sort((a, b) => a.start - b.start);

      // Two-pointer merge for overlaps
      let i = 0;
      let j = 0;
      while (i < mergedList.length && j < customList.length) {
        const m = mergedList[i];
        const c = customList[j];
        if (m.end < c.start) {
          i++;
        } else if (c.end < m.start) {
          j++;
        } else {
          // Overlap: merge custom fields excluding timecodes
          const { tc_start, tc_end, ...rest } = c.customClip;
          Object.assign(m.mergedClip, rest);
          // Advance the one that ends first
          if (m.end < c.end) {
            i++;
          } else {
            j++;
          }
        }
      }
    }
  }
}

/* -----------------------------------------------------------
   4) Merge Sound
   - We do not merge by clip name, but by timecode overlap. 
   - Convert OCF start/end to frames, compare with Sound start/end frames,
     if they overlap, add sound clip name to `merged.sound`.
----------------------------------------------------------- */
function mergeSoundClips(
  clipMap: Map<string, MergedClip>,
  log: Pick<LogType, "sound">,
  match_sound: boolean
): void {
  const soundClips = log.sound?.clips || [];
  if (!match_sound || !soundClips.length) return;

  for (const [, mergedClip] of clipMap) {
    // If there's no OCF timecode or fps, skip
    if (!mergedClip.tc_start || !mergedClip.tc_end) {
      continue;
    }

    const ocfStartFrames = timecodeToSeconds(mergedClip.tc_start);
    const ocfEndFrames = timecodeToSeconds(mergedClip.tc_end);

    // Find any soundClips that overlap
    for (const sClip of soundClips) {
      if (!sClip.tc_start || !sClip.tc_end) {
        continue;
      }
      const soundStart = timecodeToSeconds(sClip.tc_start);
      const soundEnd = timecodeToSeconds(sClip.tc_end);

      if (rangesOverlap(ocfStartFrames, ocfEndFrames, soundStart, soundEnd)) {
        if (!mergedClip.sound) {
          mergedClip.sound = [];
        }
        // Optionally avoid duplicates:
        if (!mergedClip.sound.includes(sClip.clip)) {
          mergedClip.sound.push(sClip.clip);
        }
      }
    }
  }
}

/* -----------------------------------
   Generic merge function:
   - Takes a list of items (which must have at least `clip`),
   - Finds or creates a MergedClip in `clipMap`,
   - Invokes the callback to do the actual field-by-field merge.
----------------------------------- */
function mergeIntoMap<T extends { clip: string }>(
  clipMap: Map<string, MergedClip>,
  items: T[],
  mergeCallback: (merged: MergedClip, item: T) => void
): void {
  for (const item of items) {
    const merged = getOrCreateClip(clipMap, item.clip);
    mergeCallback(merged, item);
  }
}

/* -----------------------------------
   Helper to retrieve or create a new
   MergedClip in the Map.
----------------------------------- */
function getOrCreateClip(
  clipMap: Map<string, MergedClip>,
  clipName: string
): MergedClip {
  if (!clipMap.has(clipName)) {
    // @ts-ignore
    clipMap.set(clipName, { clip: clipName });
  }
  // Non-null assertion is safe because we just set it above
  return clipMap.get(clipName)!;
}
