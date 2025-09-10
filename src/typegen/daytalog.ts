import { DateFormatOptions } from "../core/utils/format/format-date";
import {
  OcfClipType,
  ProxyClipType,
  SoundClipType,
  ClipType,
} from "../schemas/log";
interface Proxy {
  codec?: string;
  format?: string;
  resolution?: string;
  /**
   * Retrieves the size as a numerical value.
   *
   * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
   * You can specify the unit of measurement by providing an options object. The default unit is `bytes`.
   *
   * @param {Object} [options] - Optional settings for formatting the size.
   * @param {FormatBytesTypes} [options.type] - The unit for the size. Choose from:
   *   - `'auto'`: Automatically selects the most appropriate unit (e.g., KB, MB, GB).
   *   - `'tb'`: Terabytes
   *   - `'gb'`: Gigabytes
   *   - `'mb'`: Megabytes
   *   - `'bytes'`: Bytes
   *
   * @returns {number} The size as a number.
   *
   * @example
   * ```
   * // Get size in the default unit (bytes)
   * const sizeNumberDefault = clip.proxy.sizeAsNumber();
   * console.log(sizeNumberDefault); // Output: 117000000
   *``` ```
   * // Get size in Gigabytes
   * const sizeNumberGB = clip.proxy.sizeAsNumber({ type: 'gb' });
   * console.log(sizeNumberGB); // Output: 0.117
   *``` ```
   * // Get size in Megabytes
   * const sizeNumberMB = clip.proxy.sizeAsNumber({ type: 'mb' });
   * console.log(sizeNumberMB); // Output: 117
   * ```
   */
  size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
  /**
   * Retrieves the size as a numerical value.
   *
   * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
   * You can specify the unit of measurement by providing an options object. The default unit is `bytes`.
   *
   * @param {Object} [options] - Optional settings for formatting the size.
   * @param {FormatBytesTypes} [options.type] - The unit for the size. Choose from:
   *   - `'auto'`: Automatically selects the most appropriate unit (e.g., KB, MB, GB).
   *   - `'tb'`: Terabytes
   *   - `'gb'`: Gigabytes
   *   - `'mb'`: Megabytes
   *   - `'bytes'`: Bytes
   *
   * @returns {number} The size as a number.
   *
   * @example
   * ```
   * // Get size in the default unit (bytes)
   * const sizeNumberDefault = clip.proxy.sizeAsNumber();
   * console.log(sizeNumberDefault); // Output: 117000000
   *``` ```
   * // Get size in Gigabytes
   * const sizeNumberGB = clip.proxy.sizeAsNumber({ type: 'gb' });
   * console.log(sizeNumberGB); // Output: 0.117
   *``` ```
   * // Get size in Megabytes
   * const sizeNumberMB = clip.proxy.sizeAsNumber({ type: 'mb' });
   * console.log(sizeNumberMB); // Output: 117
   * ```
   */
  sizeAsNumber(options?: {
    type: "auto" | "tb" | "gb" | "mb" | "bytes";
  }): number;
  /**
   * Obtains the size as a pair containing both the numerical value and its unit.
   *
   * This method returns an array where the first element is the size number and the second element is the unit.
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
   *
   * @example
   * // Get size as a tuple with automatic unit
   * const sizeTupleAuto = clip.proxy.sizeAsTuple();
   * console.log(sizeTupleAuto); // Output: [117, 'MB']
   *
   * // Get size as a tuple in Gigabytes
   * const sizeTupleGB = clip.proxy.sizeAsTuple({ type: 'gb' });
   * console.log(sizeTupleGB); // Output: [0.117, 'GB']
   */
  sizeAsTuple(options?: {
    type: "auto" | "tb" | "gb" | "mb" | "bytes";
  }): [number, string];
}
interface Clip extends Omit<ClipType, "size" | "duration" | "proxy"> {}
interface Clip {
  /**
   * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
   *
   * You can specify the unit of measurement you prefer by providing an options object.
   * The default unit is 'auto', which automatically selects the most appropriate unit.
   *
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
   *
   * @example
   * ```
   * // Automatically choose the best unit
   * const sizeAuto = clipsize();
   * console.log(sizeAuto); // Output: "117 MB"
   *
   * // Specify the unit as Gigabytes
   * const sizeGB = clip.size({ type: 'gb' });
   * console.log(sizeGB); // Output: "0.117 GB"
   *```
   */
  size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
  /**
   * Retrieves the size as a numerical value.
   *
   * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
   *
   * @example
   * ```
   * // Get size in the default unit (bytes)
   * const sizeNumberDefault = clip.sizeAsNumber();
   * console.log(sizeNumberDefault); // Output: 117000000
   *``` ```
   * // Get size in Gigabytes
   * const sizeNumberGB = clip.sizeAsNumber({ type: 'gb' });
   * console.log(sizeNumberGB); // Output: 0.117
   *``` ```
   * // Get size in Megabytes
   * const sizeNumberMB = clip.sizeAsNumber({ type: 'mb' });
   * console.log(sizeNumberMB); // Output: 117
   * ```
   */
  sizeAsNumber(options?: {
    type: "auto" | "tb" | "gb" | "mb" | "bytes";
  }): number;
  /**
   * Obtains the size as a pair containing both the numerical value and its unit.
   *
   * This method returns an array where the first element is the size number and the second element is the unit.
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
   *
   * @example
   * // Get size as a tuple with automatic unit
   * const sizeTupleAuto = clip.sizeAsTuple();
   * console.log(sizeTupleAuto); // Output: [117, 'MB']
   *
   * // Get size as a tuple in Gigabytes
   * const sizeTupleGB = clip.sizeAsTuple({ type: 'gb' });
   * console.log(sizeTupleGB); // Output: [0.117, 'GB']
   */
  sizeAsTuple(options?: {
    type: "auto" | "tb" | "gb" | "mb" | "bytes";
  }): [number, string];
  /**
   * Retrieves the duration in a human-readable string format. (e.g., "1h, 30m, 45s")
   *
   *
   * @returns {string} The duration as a readable string.
   *
   * @example
   * ```
   * const duration = clip.duration();
   * console.log(duration); // Output: "1h, 30m, 45s"
   * ```
   */
  duration(): string;
  /**
   * Retrieves the duration in timecode format. `[HH:MM:SS:FF]`
   *
   *
   * @returns {string} The duration in timecode format (e.g., "01:30:45:00").
   *
   * @example
   * ```
   * const durationTC = clip.duration();
   * console.log(durationTC); // Output: "01:30:45:00"
   * ```
   */
  durationTC(): string;
  /**
   * Retrieves the duration as an object with time components, hours, minutes, seconds.
   *
   * @returns {durationType} An object containing `hours`, `minutes`, and `seconds`.
   *
   * @example
   * ```
   * const durationObj = clip.durationObject();
   * console.log(durationObj); // Output: { hours: 1, minutes: 30, seconds: 45 }
   * ```
   */
  durationObject(): {
    hours: number;
    minutes: number;
    seconds: number;
  };
  /**
   * Retrieves the duration in total seconds.
   *
   * @returns {number} The total duration in seconds.
   *
   * @example
   * ```
   * const durationSeconds = clip.durationAsSeconds();
   * console.log(durationSeconds); // Output: 5445
   * ```
   */
  durationAsSeconds(): number;
  /**
   * Retrieves the duration in frames. Suitable if you want to do your own calculations.
   *
   * @returns {number} The total duration in frames.
   *
   * @example
   * ```
   * const durationSeconds = clip.durationAsFrames();
   * console.log(durationSeconds); // Output: 5445
   * ```
   */
  durationAsFrames(): number;
  /** A collection of proxy related properties and methods */
  proxy: Proxy;
}

interface Custom {
  [key: string]: unknown;
}

export type Log = {
  /** The unique identifier for this log. */
  id: string;
  /** The day associated with this log.
   *
   * @param {1|2|3} [minDigits] - The minimum number of digits for the day string.
   *   - 1: No leading zeros (e.g., '1')
   *   - 2: Two digits with leading zero if needed (e.g., '01')
   *   - 3: Three digits with leading zeros if needed (e.g., '001')
   * @returns {string} The day as a string, formatted according to minDigits.
   *
   * @example
   * log.day(); // '1'
   * log.day(2); // '01'
   * log.day(3); // '001'
   */
  day(minDigits?: 1 | 2 | 3): string;
  /** The date of this log.
   *
   * @param {DateFormatOptions} [format] - Options for formatting the date. Allowed values:
   *   - 'yyyymmdd'
   *   - 'yymmdd'
   *   - 'ddmmyyyy'
   *   - 'ddmmyy'
   *   - 'mmddyyyy'
   *   - 'mmddyy'
   *   - 'yyyy-mm-dd'
   *   - 'yy-mm-dd'
   *   - 'dd-mm-yyyy'
   *   - 'dd-mm-yy'
   *   - 'mm-dd-yyyy'
   *   - 'mm-dd-yy'
   *   - 'yyyy/mm/dd'
   *   - 'yy/mm/dd'
   *   - 'dd/mm/yyyy'
   *   - 'dd/mm/yy'
   *   - 'mm/dd/yyyy'
   *   - 'mm/dd/yy'
   * @returns {string} The date as a string, formatted according to the provided options or as ISO by default.
   *
   * @example
   * log.date(); // '2024-06-01'
   * log.date('mm/dd/yyyy'); // '06/01/2024'
   *
   * @tip For more advanced formatting or localization, you can use the built-in JavaScript Date object:
   *   const jsDate = new Date(log.date());
   *   // Use jsDate with Intl.DateTimeFormat for more control.
   */
  date(format?: DateFormatOptions): string;
  /**The unit/team associated with this log. Example: Main-unit, Second-unit */
  unit?: string;
  /** The clips associated with this log. Clips are OCF clips merged with matching Proxy, Sound and Custom clip data.*/
  clips: Clip[];
  /** A collection of properties and methods for Original Camera Files (OCF)*/
  ocf: {
    /** OCF Clips (Original Camera Files) */
    clips: OcfClipType[];
    /**
     * Retrieves the total number of files.
     *
     * @returns {number} The total number of files.
     *
     * @example
     * ```
     * const totalFiles = log.ocf.files();
     * console.log(totalFiles); // Output: 5
     * ```
     */
    files(): number;
    /**
     * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
     *
     * You can specify the unit of measurement you prefer by providing an options object.
     * The default unit is 'auto', which automatically selects the most appropriate unit.
     *
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
     *
     * @example
     * ```
     * // Automatically choose the best unit
     * const sizeAuto = log.ocf.size();
     * console.log(sizeAuto); // Output: "117 MB"
     *
     * // Specify the unit as Gigabytes
     * const sizeGB = log.ocf.size({ type: 'gb' });
     * console.log(sizeGB); // Output: "0.117 GB"
     *```
     */
    size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
    /**
     * Retrieves the size as a numerical value.
     *
     * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
     *
     * @example
     * ```
     * // Get size in the default unit (bytes)
     * const sizeNumberDefault = log.ocf.sizeAsNumber();
     * console.log(sizeNumberDefault); // Output: 117000000
     *``` ```
     * // Get size in Gigabytes
     * const sizeNumberGB = log.ocf.sizeAsNumber({ type: 'gb' });
     * console.log(sizeNumberGB); // Output: 0.117
     *``` ```
     * // Get size in Megabytes
     * const sizeNumberMB = log.ocf.sizeAsNumber({ type: 'mb' });
     * console.log(sizeNumberMB); // Output: 117
     * ```
     */
    sizeAsNumber(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): number;
    /**
     * Obtains the size as a pair containing both the numerical value and its unit.
     *
     * This method returns an array where the first element is the size number and the second element is the unit.
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
     *
     * @example
     * // Get size as a tuple with automatic unit
     * const sizeTupleAuto = log.ocf.sizeAsTuple();
     * console.log(sizeTupleAuto); // Output: [117, 'MB']
     *
     * // Get size as a tuple in Gigabytes
     * const sizeTupleGB = log.ocf.sizeAsTuple({ type: 'gb' });
     * console.log(sizeTupleGB); // Output: [0.117, 'GB']
     */
    sizeAsTuple(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): [number, string];
    /**
     * Retrieves the copies as an array of objects.
     *
     *   - `volumes`: contain the volumes for the copy. : string[]
     *   - `clips`: contain the clip names in the copy. : string[]
     *   - `count`: contain the number of clips in this copy + total number of clips among all copies. If the first number is not equal to the second, it indicates that the copy is not complete. : [number, number]
     *
     * @returns {{volumes: string[], clips: string[], count: [number, number]}[]} An array of copy objects.
     *
     * @example
     * ```
     * const copies = log.ocf.copies();
     * console.log(copies); // Output: [{ volumes: ['Volume1'], clips: ['A001C001'], count: [10, 10] }, ...]
     * ```
     */
    copies(): { volumes: string[]; clips: string[]; count: [number, number] }[];
    /**
     * Gets the reels as an array of strings.
     *
     * You can optionally group reels by passing `{mergeRanges=true}`
     *
     * @param {ReelsOptions} [options] - Optional settings for formatting reels.
     * @param {boolean} [options.mergeRanges=false] - Whether to group consecutive reels.
     *
     * @returns {string[]} An array of reel names.
     *
     * @example
     * ```// Retrieve reels without grouping (default)
     * const reels = log.ocf.reels();
     * console.log(reels); // Output: ['Reel1', 'Reel2', 'Reel3']
     *
     * // Retrieve merged reels
     * const mergedReels = log.ocf.reels({ mergeRanges: true });
     * console.log(mergedReels); // Output: ['Reel1 - Reel3', '+ 2 other clips']
     * ```
     */
    reels(options?: { mergeRanges: boolean }): string[];
    /**
     * Retrieves the duration in a human-readable string format. (e.g., "1h, 30m, 45s")
     *
     *
     * @returns {string} The duration as a readable string.
     *
     * @example
     * ```
     * const duration = log.ocf.duration();
     * console.log(duration); // Output: "1h, 30m, 45s"
     * ```
     */
    duration(): string;
    /**
     * Retrieves the duration in timecode format. `[HH:MM:SS:FF]`
     *
     *
     * @returns {string} The duration in timecode format (e.g., "01:30:45:00").
     *
     * @example
     * ```
     * const durationTC = log.ocf.duration();
     * console.log(durationTC); // Output: "01:30:45:00"
     * ```
     */
    durationTC(): string;
    /**
     * Retrieves the duration as an object with time components, hours, minutes, seconds.
     *
     * @returns {durationType} An object containing `hours`, `minutes`, and `seconds`.
     *
     * @example
     * ```
     * const durationObj = log.ocf.durationObject();
     * console.log(durationObj); // Output: { hours: 1, minutes: 30, seconds: 45 }
     * ```
     */
    durationObject(): {
      hours: number;
      minutes: number;
      seconds: number;
    };
    /**
     * Retrieves the duration in total seconds. Suitable if you want to do your own calculations.
     *
     * @returns {number} The total duration in seconds.
     *
     * @example
     * ```
     * const durationSeconds = log.ocf.durationAsSeconds();
     * console.log(durationSeconds); // Output: 5445
     * ```
     */
    durationAsSeconds(): number;
  };
  /** A collection of proxy related properties and methods */
  proxy: {
    /** Proxy Clips */
    clips: ProxyClipType[];
    /**
     * Retrieves the total number of files.
     *
     * @returns {number} The total number of files.
     *
     * @example
     * ```
     * const totalFiles = log.proxy.files();
     * console.log(totalFiles); // Output: 5
     * ```
     */
    files(): number;
    /**
     * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
     *
     * You can specify the unit of measurement you prefer by providing an options object.
     * The default unit is 'auto', which automatically selects the most appropriate unit.
     *
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
     *
     * @example
     * ```
     * // Automatically choose the best unit
     * const sizeAuto = log.ocf.size();
     * console.log(sizeAuto); // Output: "117 MB"
     *
     * // Specify the unit as Gigabytes
     * const sizeGB = log.ocf.size({ type: 'gb' });
     * console.log(sizeGB); // Output: "0.117 GB"
     *```
     */
    size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
    /**
     * Retrieves the size as a numerical value.
     *
     * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
     *
     * @example
     * ```
     * // Get size in the default unit (bytes)
     * const sizeNumberDefault = log.ocf.sizeAsNumber();
     * console.log(sizeNumberDefault); // Output: 117000000
     *``` ```
     * // Get size in Gigabytes
     * const sizeNumberGB = log.proxy.sizeAsNumber({ type: 'gb' });
     * console.log(sizeNumberGB); // Output: 0.117
     *``` ```
     * // Get size in Megabytes
     * const sizeNumberMB = log.proxy.sizeAsNumber({ type: 'mb' });
     * console.log(sizeNumberMB); // Output: 117
     * ```
     */
    sizeAsNumber(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): number;
    /**
     * Obtains the size as a pair containing both the numerical value and its unit.
     *
     * This method returns an array where the first element is the size number and the second element is the unit.
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
     *
     * @example
     * // Get size as a tuple with automatic unit
     * const sizeTupleAuto = log.proxy.sizeAsTuple();
     * console.log(sizeTupleAuto); // Output: [117, 'MB']
     *
     * // Get size as a tuple in Gigabytes
     * const sizeTupleGB = log.proxy.sizeAsTuple({ type: 'gb' });
     * console.log(sizeTupleGB); // Output: [0.117, 'GB']
     */
    sizeAsTuple(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): [number, string];
  };
  /** A collection of sound related properties and methods */
  sound: {
    /** Sound Clips */
    clips: SoundClipType[];
    /**
     * Retrieves the total number of files.
     *
     * @returns {number} The total number of files.
     *
     * @example
     * ```
     * const totalFiles = log.sound.files();
     * console.log(totalFiles); // Output: 5
     * ```
     */
    files(): number;
    /**
     * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
     *
     * You can specify the unit of measurement you prefer by providing an options object.
     * The default unit is 'auto', which automatically selects the most appropriate unit.
     *
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
     *
     * @example
     * ```
     * // Automatically choose the best unit
     * const sizeAuto = log.sound.size();
     * console.log(sizeAuto); // Output: "117 MB"
     *
     * // Specify the unit as Gigabytes
     * const sizeGB = log.sound.size({ type: 'gb' });
     * console.log(sizeGB); // Output: "0.117 GB"
     *```
     */
    size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
    /**
     * Retrieves the size as a numerical value.
     *
     * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
     *
     * @example
     * ```
     * // Get size in the default unit (bytes)
     * const sizeNumberDefault = log.ocf.sizeAsNumber();
     * console.log(sizeNumberDefault); // Output: 117000000
     *``` ```
     * // Get size in Gigabytes
     * const sizeNumberGB = log.sound.sizeAsNumber({ type: 'gb' });
     * console.log(sizeNumberGB); // Output: 0.117
     *``` ```
     * // Get size in Megabytes
     * const sizeNumberMB = log.sound.sizeAsNumber({ type: 'mb' });
     * console.log(sizeNumberMB); // Output: 117
     * ```
     */
    sizeAsNumber(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): number;
    /**
     * Obtains the size as a pair containing both the numerical value and its unit.
     *
     * This method returns an array where the first element is the size number and the second element is the unit.
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
     *
     * @example
     * // Get size as a tuple with automatic unit
     * const sizeTupleAuto = log.sound.sizeAsTuple();
     * console.log(sizeTupleAuto); // Output: [117, 'MB']
     *
     * // Get size as a tuple in Gigabytes
     * const sizeTupleGB = log.sound.sizeAsTuple({ type: 'gb' });
     * console.log(sizeTupleGB); // Output: [0.117, 'GB']
     */
    sizeAsTuple(options?: {
      type: "auto" | "tb" | "gb" | "mb" | "bytes";
    }): [number, string];
    /**
     * Retrieves the copies associated with this log.
     *
     * If the sound has a fixed `copies` value, it will return that array.
     * Otherwise, it derives the copies from clips.
     *
     * @return {CopyType[]} An array of copy objects.
     *
     * @example
     * const copies = log.sound.copies();
     * console.log(copies); // Output: [{ volumes: ['Volume1'], clips: ['clip1.wav'], count: [1, 10] }, ...]
     */
    copies(): {
      volumes: string[];
      clips: string[];
      count: [number, number];
    }[];
  };
  custom: Custom | undefined;
};

export type Daytalog = {
  /**The name of the Project */
  projectName: string;
  /** Custom info from the project */
  customInfo: Record<string, string>[] | undefined;
  /** The selected log.
   *
   * If multiple logs are selected, their values will be merged.
   */
  log: Log;
  /** The log selection as an array.*/
  logs: Log[];
  /** All logs in the project */
  logAll: Log[];
  /** The message to be included with the Daytalog instance */
  message: string;
  /** A collection of methods for retrieving aggregated totals of all logs */
  total: {
    /**
     * Retrieves the total number of days.
     *
     * @returns {string} The total number of days.
     *
     * @example
     * ```
     * const totalFiles = total.days();
     * console.log(totalFiles); // Output: "52"
     * ```
     */
    days(minDigits?: 1 | 2 | 3): string;
    dayRange(minDigits?: 1 | 2 | 3): [string, string];
    /**
     * Retrieves the first and last date of the project as ISO dates.
     *
     * @returns {[string, string]} [startDate, endDate]
     *
     * @example
     * ```
     * const dates = `${total.dateRange[0]} - ${total.dateRange[1]}`
     * console.log(dates); // Output: 2025-01-01 - 2025-12-31
     * ```
     */
    dateRange(format?: DateFormatOptions): [string, string];
    /** A collection of OCF methods for retrieving totals */
    ocf: {
      /**
       * Retrieves the total number of files.
       *
       * @returns {number} The total number of files.
       *
       * @example
       * ```
       * const totalFiles = total.ocf.files();
       * console.log(totalFiles); // Output: 13214
       * ```
       */
      files: () => number;
      /**
       * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
       *
       * You can specify the unit of measurement you prefer by providing an options object.
       * The default unit is 'auto', which automatically selects the most appropriate unit.
       *
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
       *
       * @example
       * ```
       * // Automatically choose the best unit
       * const sizeAuto = total.ocf.size();
       * console.log(sizeAuto); // Output: "117 MB"
       *
       * // Specify the unit as Gigabytes
       * const sizeGB = total.ocf.size({ type: 'gb' });
       * console.log(sizeGB); // Output: "0.117 GB"
       *```
       */
      size: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => string;
      /**
       * Retrieves the size as a numerical value.
       *
       * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
       *
       * @example
       * ```
       * // Get size in the default unit (bytes)
       * const sizeNumberDefault = total.ocf.sizeAsNumber();
       * console.log(sizeNumberDefault); // Output: 117000000
       *``` ```
       * // Get size in Gigabytes
       * const sizeNumberGB = total.ocf.sizeAsNumber({ type: 'gb' });
       * console.log(sizeNumberGB); // Output: 0.117
       *``` ```
       * // Get size in Megabytes
       * const sizeNumberMB = total.ocf.sizeAsNumber({ type: 'mb' });
       * console.log(sizeNumberMB); // Output: 117
       * ```
       */
      sizeAsNumber: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => number;
      /**
       * Obtains the size as a pair containing both the numerical value and its unit.
       *
       * This method returns an array where the first element is the size number and the second element is the unit.
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
       *
       * @example
       * // Get size as a tuple with automatic unit
       * const sizeTupleAuto = total.ocf.sizeAsTuple();
       * console.log(sizeTupleAuto); // Output: [117, 'MB']
       *
       * // Get size as a tuple in Gigabytes
       * const sizeTupleGB = total.ocf.sizeAsTuple({ type: 'gb' });
       * console.log(sizeTupleGB); // Output: [0.117, 'GB']
       */
      sizeAsTuple: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => [number, string];
      duration: () => string;
      durationTC: () => string;
      durationObject: () => { hours: number; minutes: number; seconds: number };
    };
    /** A collection of proxy methods for retrieving totals */
    proxy: {
      /**
       * Retrieves the total number of files.
       *
       * @returns {number} The total number of files.
       *
       * @example
       * ```
       * const totalFiles = total.proxy.files();
       * console.log(totalFiles); // Output: 13214
       * ```
       */
      files: () => number;
      /**
       * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
       *
       * You can specify the unit of measurement you prefer by providing an options object.
       * The default unit is 'auto', which automatically selects the most appropriate unit.
       *
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
       *
       * @example
       * ```
       * // Automatically choose the best unit
       * const sizeAuto = total.proxy.size();
       * console.log(sizeAuto); // Output: "117 MB"
       *
       * // Specify the unit as Gigabytes
       * const sizeGB = total.proxysize({ type: 'gb' });
       * console.log(sizeGB); // Output: "0.117 GB"
       *```
       */
      size: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => string;
      /**
       * Retrieves the size as a numerical value.
       *
       * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
       *
       * @example
       * ```
       * // Get size in the default unit (bytes)
       * const sizeNumberDefault = total.proxy.sizeAsNumber();
       * console.log(sizeNumberDefault); // Output: 117000000
       *``` ```
       * // Get size in Gigabytes
       * const sizeNumberGB = total.proxy.sizeAsNumber({ type: 'gb' });
       * console.log(sizeNumberGB); // Output: 0.117
       *``` ```
       * // Get size in Megabytes
       * const sizeNumberMB = total.proxy.sizeAsNumber({ type: 'mb' });
       * console.log(sizeNumberMB); // Output: 117
       * ```
       */
      sizeAsNumber: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => number;
      /**
       * Obtains the size as a pair containing both the numerical value and its unit.
       *
       * This method returns an array where the first element is the size number and the second element is the unit.
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
       *
       * @example
       * // Get size as a tuple with automatic unit
       * const sizeTupleAuto = total.proxy.sizeAsTuple();
       * console.log(sizeTupleAuto); // Output: [117, 'MB']
       *
       * // Get size as a tuple in Gigabytes
       * const sizeTupleGB = total.proxy.sizeAsTuple({ type: 'gb' });
       * console.log(sizeTupleGB); // Output: [0.117, 'GB']
       */
      sizeAsTuple: (options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }) => [number, string];
    };
    /** A collection of sound methods for retrieving totals */
    sound: {
      /**
       * Retrieves the total number of files.
       *
       * @returns {number} The total number of files.
       *
       * @example
       * ```
       * const totalFiles = total.proxy.files();
       * console.log(totalFiles); // Output: 13214
       * ```
       */
      files(): number;
      /**
       * Gets the size in a user-friendly format, such as "1.17 GB" or "117 MB".
       *
       * You can specify the unit of measurement you prefer by providing an options object.
       * The default unit is 'auto', which automatically selects the most appropriate unit.
       *
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
       *
       * @example
       * ```
       * // Automatically choose the best unit
       * const sizeAuto = total.sound.size();
       * console.log(sizeAuto); // Output: "117 MB"
       *
       * // Specify the unit as Gigabytes
       * const sizeGB = total.sound.size({ type: 'gb' });
       * console.log(sizeGB); // Output: "0.117 GB"
       *```
       */
      size(options?: { type: "auto" | "tb" | "gb" | "mb" | "bytes" }): string;
      /**
       * Retrieves the size as a numerical value.
       *
       * This method returns the size in a numerical format, which can be useful for calculations or comparisons.
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
       *
       * @example
       * ```
       * // Get size in the default unit (bytes)
       * const sizeNumberDefault = total.sound.sizeAsNumber();
       * console.log(sizeNumberDefault); // Output: 117000000
       *``` ```
       * // Get size in Gigabytes
       * const sizeNumberGB = total.sound.sizeAsNumber({ type: 'gb' });
       * console.log(sizeNumberGB); // Output: 0.117
       *``` ```
       * // Get size in Megabytes
       * const sizeNumberMB = total.sound.sizeAsNumber({ type: 'mb' });
       * console.log(sizeNumberMB); // Output: 117
       * ```
       */
      sizeAsNumber(options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }): number;
      /**
       * Obtains the size as a pair containing both the numerical value and its unit.
       *
       * This method returns an array where the first element is the size number and the second element is the unit.
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
       *
       * @example
       * // Get size as a tuple with automatic unit
       * const sizeTupleAuto = total.sound.sizeAsTuple();
       * console.log(sizeTupleAuto); // Output: [117, 'MB']
       *
       * // Get size as a tuple in Gigabytes
       * const sizeTupleGB = total.sound.sizeAsTuple({ type: 'gb' });
       * console.log(sizeTupleGB); // Output: [0.117, 'GB']
       */
      sizeAsTuple(options?: {
        type: "auto" | "tb" | "gb" | "mb" | "bytes";
      }): [number, string];
    };
  };
};
