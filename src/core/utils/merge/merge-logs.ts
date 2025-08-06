import { LogType, LogTypeMerged } from "../../../schemas/log";
import { LogOptions } from "../../../schemas/project";
import { createLog } from "../../log";
import { getTotalFiles, getTotalSize, getTotalDuration } from "../methods";
export const getFirstAndLastlogs = (
  logs: LogType[]
): { first: LogType; last: LogType } => {
  if (!logs.length) throw new Error("No logs provided");

  const sorted = [...logs].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.day !== b.day) return a.day - b.day;
    const unitA = a.unit || "";
    const unitB = b.unit || "";
    return unitA.localeCompare(unitB);
  });

  return { first: sorted[0], last: sorted[sorted.length - 1] };
};

export const mergeLogs = async (
  logs: LogType[],
  options: LogOptions
): Promise<LogTypeMerged> => {
  const wrapped = await Promise.all(logs.map((d) => createLog(d, options)));

  const propertyIsSetOnAny = (
    items: LogType[],
    getter: (d: LogType) => unknown
  ): boolean => items.some((d) => getter(d) != null);

  const { first, last } = getFirstAndLastlogs(logs);

  const unit = (() => {
    const u = [
      ...new Set(logs.map((i) => i.unit).filter((u): u is string => u != null)),
    ];
    switch (u.length) {
      case 0:
        return ""; // no units
      case 1:
        return u[0]; // single unit
      default:
        return u.join(", "); // multiple units
    }
  })();

  // Start with a basic merged object
  const merged: LogTypeMerged = {
    id: `${first.id} - ${last.id}`,
    day: `${first.day}${first.day !== last.day ? ` - ${last.day}` : ""}`,
    date: `${first.date}${first.date !== last.date ? ` - ${last.date}` : ""}`,
    unit: unit,
    ocf: {},
    proxy: {},
    sound: {},
    custom: [],
    version: 1,
  } as LogTypeMerged;

  // --- OCF ---
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.files)) {
    merged.ocf && (merged.ocf.files = getTotalFiles(wrapped, "ocf"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.size)) {
    merged.ocf && (merged.ocf.size = getTotalSize(wrapped, "ocf"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.duration)) {
    merged.ocf && (merged.ocf.duration = getTotalDuration(wrapped, "tc"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.reels)) {
    const reelsSet = new Set<string>();
    wrapped.forEach((w) => w.ocf?.reels().forEach((r) => reelsSet.add(r)));
    merged.ocf && (merged.ocf.reels = Array.from(reelsSet));
  }
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.copies)) {
    const copiesSet = new Set<string>();
    wrapped.forEach((w) => {
      w.ocf?.copies().forEach((c) => {
        c.volumes.forEach((d: string) => copiesSet.add(d));
      });
    });
    merged.ocf && (merged.ocf.copies = Array.from(copiesSet));
  }
  if (propertyIsSetOnAny(logs, (d) => d.ocf?.clips)) {
    merged.ocf &&
      (merged.ocf.clips = logs.flatMap((log) => log.ocf?.clips ?? []));
  }

  // --- PROXY ---
  if (propertyIsSetOnAny(logs, (d) => d.proxy?.files)) {
    merged.proxy && (merged.proxy.files = getTotalFiles(wrapped, "proxy"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.proxy?.size)) {
    merged.proxy && (merged.proxy.size = getTotalSize(wrapped, "proxy"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.proxy?.clips)) {
    merged.proxy &&
      (merged.proxy.clips = logs.flatMap((log) => log.proxy?.clips ?? []));
  }

  // --- SOUND ---
  if (propertyIsSetOnAny(logs, (d) => d.sound?.files)) {
    merged.sound && (merged.sound.files = getTotalFiles(wrapped, "sound"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.sound?.size)) {
    merged.sound && (merged.sound.size = getTotalSize(wrapped, "sound"));
  }
  if (propertyIsSetOnAny(logs, (d) => d.sound?.copies)) {
    const copiesSet = new Set<string>();
    wrapped.forEach((w) => {
      w.ocf?.copies().forEach((c) => {
        c.volumes.forEach((d: string) => copiesSet.add(d));
      });
    });
    merged.sound && (merged.sound.copies = Array.from(copiesSet));
  }
  if (propertyIsSetOnAny(logs, (d) => d.sound?.clips)) {
    merged.sound &&
      (merged.sound.clips = logs.flatMap((log) => log.sound?.clips ?? []));
  }

  if (propertyIsSetOnAny(logs, (d) => d.custom)) {
    // flatten all custom entries
    const customEntries = logs.flatMap((log) => log.custom ?? []);
    // group entries by schema name, initializing objects for logs and arrays for clips
    const customMap = new Map<
      string,
      {
        logs: any;
        clips: Array<any>;
      }
    >();
    customEntries.forEach((entry) => {
      const { schema, log: logEntry, clips } = entry;
      if (!customMap.has(schema)) {
        customMap.set(schema, { logs: {}, clips: [] });
      }
      const group = customMap.get(schema)!;
      if (logEntry) {
        // merge fields, overwriting existing with later entries
        Object.assign(group.logs, logEntry);
      }
      if (clips) {
        group.clips.push(...clips);
      }
    });
    // build merged.custom array
    merged.custom = Array.from(
      customMap,
      ([schema, { logs: logGroup, clips }]) => ({
        schema,
        log: Object.keys(logGroup).length > 0 ? logGroup : undefined,
        clips: clips.length > 0 ? clips : undefined,
      })
    );
  }

  return merged;
};
