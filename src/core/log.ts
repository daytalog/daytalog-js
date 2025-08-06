import {
  LogType,
  LogTypeMerged,
  OcfType,
  SoundType,
  ProxyType,
  CopyType,
  OcfClipType,
  ProxyClipType,
  SoundClipType,
} from "../schemas/log";
import { LogOptions } from "../schemas/project";
import { createClip } from "./clip";
import { mergeClips } from "./utils/merge/merge-clips";
import {
  getDay,
  getDate,
  getReels,
  getFiles,
  getSize,
  getDuration,
  getCopies,
} from "./utils/methods";
import { FormatBytesTypes } from "./utils/format/format-bytes";
import { DurationType } from "./utils/format/format-duration";
import { DateFormatOptions } from "./utils/format/format-date";

/**
 * Creates common methods for handling files, sizes and other shared functionality
 */
function createCommonMethods(
  data: OcfType | SoundType | ProxyType | undefined
) {
  return {
    files(): number {
      return getFiles(data);
    },
    /**
     * Gets the size formatted as a readable string.
     *
     * This method returns the size of the data in a user-friendly format, such as "1.17 GB" or "117 MB".
     * If there's a fixed `size` value, it uses that; otherwise, it calculates the size from the clips.
     * The default unit is 'auto', which automatically selects the most appropriate unit.
     * You can specify the unit of measurement you prefer by providing an options object.
     *
     * @param {Object} [options] - Optional settings for formatting the size.
     * @param {FormatBytesTypes} [options.type] - The unit for the size. Choose from:
     *   - `'auto'`: Automatically selects the most appropriate unit (e.g., MB, GB, TB). (default)
     *   - `'tb'`: Terabytes
     *   - `'gb'`: Gigabytes
     *   - `'mb'`: Megabytes
     *   - `'bytes'`: Bytes
     *
     * @returns {string} The formatted size as a string.
     */
    size(options?: { type: FormatBytesTypes }): string {
      return getSize(data, { output: "string", type: options?.type });
    },
    /**
     * Retrieves the size as a numerical value.
     *
     * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
     * If there's a fixed `size` value, it uses that; otherwise, it calculates the size from the clips.
     * You can specify the unit of measurement by providing an options object. The default unit is `bytes`.
     *
     * @param {Object} [options] - Optional settings for formatting the size.
     * @param {FormatBytesTypes} [options.type] - The unit for the size. Choose from:
     *   - `'auto'`: Automatically selects the most appropriate unit (e.g., KB, MB, GB).
     *   - `'tb'`: Terabytes
     *   - `'gb'`: Gigabytes
     *   - `'mb'`: Megabytes
     *   - `'bytes'`: Bytes (default)
     *
     * @returns {number} The size as a number.
     */
    sizeAsNumber: (options?: { type: FormatBytesTypes }): number =>
      options
        ? getSize(data, { output: "number", type: options.type })
        : getSize(data),

    /**
     * Obtains the size as a pair containing both the numerical value and its unit.
     *
     * This method returns an array where the first element is the size number and the second element is the unit.
     * If there's a fixed `size` value, it uses that; otherwise, it calculates the size from the clips.
     * You can specify the unit of measurement by providing an options object.
     *
     * @param {Object} [options] - Optional settings for formatting the size.
     * @param {FormatBytesTypes} [options.type] - The unit for the size. Choose from:
     *   - `'auto'`: Automatically selects the most appropriate unit (e.g., MB, GB, TB). (default)
     *   - `'tb'`: Terabytes
     *   - `'gb'`: Gigabytes
     *   - `'mb'`: Megabytes
     *   - `'bytes'`: Bytes
     *
     * @returns {[number, string]} An array with the size number and its corresponding unit.
     */
    sizeAsTuple: (options?: { type: FormatBytesTypes }): [number, string] =>
      getSize(data, { output: "tuple", type: options?.type }),
  };
}

/**
 * Creates a new Log instance asynchronously.
 * This factory function handles the heavy processing of merging clips.
 */
export async function createLog(
  data: LogType | LogTypeMerged,
  options: LogOptions
) {
  const mergedClips = await mergeClips(data, options);
  const clips = await Promise.all(
    mergedClips?.map((clip) => createClip(clip)) ?? []
  );

  return {
    clips,

    /** The unique identifier for this log. */
    id: data.id,

    /**
     * Returns the day, optionally formatted with zero padding.
     * @param minDigits Formatting options for day
     */
    day(minDigits?: 1 | 2 | 3): string {
      return getDay(data.day, { pad: minDigits });
    },

    /**
     * Returns the date, optionally formatted.
     * @param options Formatting options for date
     */
    date(format?: DateFormatOptions): string {
      return getDate(data.date, { format });
    },

    /** The unit for this log. */
    unit: data.unit,

    /** The custom data for this log (merged fields from all entries). */
    get custom() {
      const entries = data.custom
        ?.map(({ log }) => log)
        .filter((l): l is NonNullable<typeof l> => l != null);
      if (!entries || entries.length === 0) return undefined;
      // Merge fields, with later entries overwriting earlier ones
      return Object.assign({}, ...entries);
    },

    /** The OCF data for this log. */
    get ocf() {
      const ocfData = data.ocf;
      return {
        clips: ocfData?.clips ?? ([] as OcfClipType[]),
        ...createCommonMethods(ocfData),
        duration: (): string => getDuration(ocfData, "hms-string") as string,
        durationTC: (): string => getDuration(ocfData, "tc") as string,
        durationObject: (): DurationType =>
          getDuration(ocfData, "hms") as DurationType,
        durationAsSeconds: (): number =>
          getDuration(ocfData, "seconds") as number,
        reels: (options?: { mergeRanges?: boolean }): string[] =>
          getReels(ocfData, options),
        copies: (): CopyType[] => getCopies(ocfData),
      };
    },

    /** The proxy data for this log. */
    get proxy() {
      const proxyData = data.proxy;
      return {
        clips: proxyData?.clips ?? ([] as ProxyClipType[]),
        ...createCommonMethods(proxyData),
      };
    },

    /** The sound data for this log. */
    get sound() {
      const soundData = data.sound;
      return {
        clips: soundData?.clips ?? ([] as SoundClipType[]),
        ...createCommonMethods(soundData),
        copies: (): CopyType[] => getCopies(soundData),
      };
    },
    raw: data,
  };
}

//export type LogInstance = Awaited<ReturnType<typeof createLog>>;
