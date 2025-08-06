import {
  OcfClipType,
  OcfType,
  ProxyType,
  ProxyClipType,
  SoundClipType,
  SoundType,
  CopyType,
} from "../../schemas/log";
import {
  timecodeToFrames,
  framesToTimecode,
  timecodeToSeconds,
  secondsToLargeTimecode,
} from "./format/format-timecode";
import { formatReels, ReelsOptions } from "./format/format-reel";
import {
  formatBytes,
  FormatBytesOptions,
  FormatOutput,
} from "./format/format-bytes";
import { formatDuration, DurationType } from "./format/format-duration";
import {
  formatCopiesFromString,
  formatCopiesFromClips,
} from "./format/format-copies";
import { padDay } from "./format/format-day";
import { formatDate, DateFormatOptions } from "./format/format-date";
import { Log } from "../../typegen/daytalog";

export function getDay(
  day: string | number,
  options?: { pad?: 1 | 2 | 3 }
): string {
  // If merged (range), handle both sides
  if (typeof day === "string" && day.includes("-")) {
    const [start, end] = day.split("-").map((d) => d.trim());
    return `${padDay(start, options?.pad)}${start !== end ? ` - ${padDay(end, options?.pad)}` : ""}`;
  }
  return padDay(day, options?.pad);
}

export function getDate(
  date: string,
  options?: { format?: DateFormatOptions }
): string {
  if (typeof date === "string" && date.includes(" - ")) {
    const [start, end] = date.split(" - ").map((d) => d.trim());
    return `${formatDate(start, options?.format)}${start !== end ? ` - ${formatDate(end, options?.format)}` : ""}`;
  }
  return formatDate(date, options?.format);
}

/**
 * Utility to count how many "files" from an array of clips
 * (Sometimes you might interpret "files" simply as the count of those clips.)
 */
export function countClipFiles(
  clips: OcfClipType[] | ProxyClipType[] | SoundClipType[] | undefined
): number {
  return clips?.length ?? 0;
}

/**
 * Utility to sum the numeric `size` of an array of clips
 */
export function sumClipSizes(
  clips: OcfClipType[] | ProxyClipType[] | SoundClipType[] | undefined
): number {
  if (!clips) return 0;
  return clips.reduce((acc, clip) => acc + (clip.size ?? 0), 0);
}

/**
 * Utility to sum timecode durations from an array of OCF clips.
 * converts each clip's `duration` to frames, sums up, then converts back.
 */
function sumClipDurations(
  clips: OcfClipType[] | undefined,
  fallbackFps = 24
): string {
  if (!clips || clips.length === 0) {
    return "00:00:00:00";
  }
  const totalFrames = clips.reduce((acc, clip) => {
    // If clip.fps is missing, fall back to some default
    const fps = clip.fps ?? fallbackFps;
    return acc + (clip.duration ? timecodeToFrames(clip.duration, fps) : 0);
  }, 0);

  // For simplicity, assume we just use the first clip's fps
  const fps = clips[0]?.fps ?? fallbackFps;
  return framesToTimecode(totalFrames, fps);
}

export const getFiles = (
  data: Pick<OcfType | ProxyType | SoundType, "files" | "clips"> | undefined
): number => {
  if (!data) return 0;
  return data?.files != null ? data.files : countClipFiles(data.clips);
};

export function getSize(
  data: Pick<OcfType | ProxyType | SoundType, "size" | "clips"> | undefined
): number;
export function getSize<T extends FormatOutput>(
  data: Pick<OcfType | ProxyType | SoundType, "size" | "clips"> | undefined,
  options: FormatBytesOptions<T>
): T extends "tuple" ? [number, string] : T extends "number" ? number : string;
export function getSize<T extends FormatOutput>(
  data: Pick<OcfType | ProxyType | SoundType, "size" | "clips"> | undefined,
  options?: FormatBytesOptions<T>
): number | string | [number, string] {
  const size = data?.size != null ? data.size : sumClipSizes(data?.clips);
  return options ? formatBytes(size, options) : size;
}

export function getDurationFormatted(
  duration: string | undefined | null,
  format: "tc"
): string;
export function getDurationFormatted(
  duration: string | undefined | null,
  format: "seconds"
): number;
export function getDurationFormatted(
  duration: string | undefined | null,
  format: "frames",
  fps: number | undefined
): number;
export function getDurationFormatted(
  duration: string | undefined | null,
  format: "hms"
): DurationType;
export function getDurationFormatted(
  duration: string | undefined | null,
  format: "hms-string"
): string;
export function getDurationFormatted(
  duration: string | undefined | null,
  format: "tc" | "seconds" | "frames" | "hms" | "hms-string",
  fps?: number
): string | number | DurationType {
  if (!duration) duration = "00:00:00:00";
  switch (format) {
    case "seconds":
      return timecodeToSeconds(duration);
    case "frames":
      if (!fps) return 0;
      return timecodeToFrames(duration, fps);
    case "hms":
      return formatDuration(duration);
    case "hms-string": {
      return formatDuration(duration, { asString: true });
    }
    case "tc":
    default:
      return duration;
  }
}

export function getDuration(
  data: Pick<OcfType, "duration" | "clips"> | undefined,
  format: "tc"
): string;
export function getDuration(
  data: Pick<OcfType, "duration" | "clips"> | undefined,
  format: "seconds"
): number;
export function getDuration(
  data: Pick<OcfType, "duration" | "clips"> | undefined,
  format: "hms"
): DurationType;
export function getDuration(
  data: Pick<OcfType, "duration" | "clips"> | undefined,
  format: "hms-string"
): string;
export function getDuration(
  data: Pick<OcfType, "duration" | "clips"> | undefined,
  format: "tc" | "seconds" | "hms" | "hms-string"
): string | number | DurationType {
  const duration = data?.duration ?? sumClipDurations(data?.clips);
  switch (format) {
    case "seconds":
      return timecodeToSeconds(duration);
    case "hms":
      return formatDuration(duration);
    case "hms-string": {
      return formatDuration(duration, { asString: true });
    }
    case "tc":
    default:
      return duration;
  }
}

export const getReels = (
  data: Pick<OcfType, "reels" | "clips"> | undefined,
  options?: ReelsOptions
): string[] => {
  if (!data) return [];
  const reels = data.reels ?? data.clips;
  return formatReels(reels, options);
};

export function getCopies(
  data: Pick<OcfType | SoundType, "copies" | "clips"> | undefined
): CopyType[] {
  if (!data) return [];
  return data.copies
    ? formatCopiesFromString(data.copies)
    : formatCopiesFromClips(data.clips);
}

type Context = "ocf" | "proxy" | "sound";

export function getTotalFiles(data: Log[], context: Context): number {
  const contextMap: Record<Context, keyof Log> = {
    ocf: "ocf",
    proxy: "proxy",
    sound: "sound",
  };

  const files = data.reduce((sum, log) => {
    const ctx = log[contextMap[context]];
    if (typeof ctx === "object" && ctx !== null && "files" in ctx) {
      return sum + ctx.files();
    }
    return sum;
  }, 0);

  return files;
}

export function getTotalSize(data: Log[], context: Context): number;
export function getTotalSize<T extends FormatOutput>(
  data: Log[],
  context: Context,
  options: FormatBytesOptions<T>
): T extends "tuple" ? [number, string] : T extends "number" ? number : string;
export function getTotalSize<T extends FormatOutput>(
  data: Log[],
  context: Context,
  options?: FormatBytesOptions<T>
): number | string | [number, string] {
  const contextMap: Record<Context, keyof Log> = {
    ocf: "ocf",
    proxy: "proxy",
    sound: "sound",
  };
  const size = data.reduce((sum, log) => {
    const ctx = log[contextMap[context]];
    if (typeof ctx === "object" && ctx !== null && "sizeAsNumber" in ctx) {
      return sum + ctx.sizeAsNumber();
    }
    return sum;
  }, 0);

  return options ? formatBytes(size, options) : size;
}

export function getTotalDuration(data: Log[], format: "tc"): string;
export function getTotalDuration(data: Log[], format: "hms-string"): string;
export function getTotalDuration(data: Log[], format: "hms"): DurationType;
export function getTotalDuration(
  data: Log[],
  format: "tc" | "hms" | "hms-string"
): string | DurationType {
  const duration = data.reduce(
    (sum, log) => sum + (log.ocf?.durationAsSeconds() ?? 0),
    0
  );
  const durationTC = secondsToLargeTimecode(duration);
  if (format === "hms") return formatDuration(durationTC);
  if (format === "hms-string")
    return formatDuration(durationTC, { asString: true });
  return durationTC;
}

export function getTotalDayRange(
  data: Log[],
  options?: { pad?: 1 | 2 | 3 }
): [string, string] {
  if (data.length === 0) return ["", ""];
  const sorted = data.slice().sort((a, b) => a.day().localeCompare(b.day()));
  const first = padDay(sorted[0].day(), options?.pad);
  const last = padDay(sorted[sorted.length - 1].day(), options?.pad);
  return [first, last];
}

export function getTotalDateRange(
  data: Log[],
  options?: { format?: DateFormatOptions }
): [string, string] {
  if (data.length === 0) return ["", ""];
  const sorted = data.slice().sort((a, b) => a.date().localeCompare(b.date()));
  const first = formatDate(sorted[0].date(), options?.format);
  const last = formatDate(sorted[sorted.length - 1].date(), options?.format);
  return [first, last];
}
