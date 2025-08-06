import { MergedClip } from "./utils/merge/merge-clips";
import { formatBytes } from "./utils/format/format-bytes";
import { getDurationFormatted } from "./utils/methods";
import { FormatBytesTypes } from "./utils/format/format-bytes";
import { DurationType } from "./utils/format/format-duration";
export type ClipType = Omit<MergedClip, "size" | "duration" | "proxy">;

/**
 * Creates a new Clip instance asynchronously.
 * This factory function allows for potential async processing in the future.
 */
export async function createClip(data: MergedClip) {
  const {
    size: _rawSize,
    duration: _rawDuration,
    proxy: _rawProxy,
    ...rest
  } = data;

  return {
    ...rest,
    /**
     * Gets the size formatted as a readable string.
     * @param options Optional settings for formatting the size
     * @returns The formatted size string
     */
    size(options?: { type: FormatBytesTypes }): string {
      return formatBytes(_rawSize ?? 0, {
        output: "string",
        type: options?.type,
      });
    },

    /**
     * Gets the size as a number in the specified unit.
     * @param options Optional settings for formatting the size
     * @returns The size as a number
     */
    sizeAsNumber(options?: { type: FormatBytesTypes }): number {
      return formatBytes(_rawSize ?? 0, {
        output: "number",
        type: options?.type,
      });
    },

    /**
     * Gets the size as a tuple containing the number and unit.
     * @param options Optional settings for formatting the size
     * @returns A tuple containing [size, unit]
     */
    sizeAsTuple(options?: { type: FormatBytesTypes }): [number, string] {
      return formatBytes(_rawSize ?? 0, {
        output: "tuple",
        type: options?.type,
      });
    },

    duration(): string {
      return getDurationFormatted(_rawDuration, "hms-string");
    },

    durationTC(): string {
      return getDurationFormatted(_rawDuration, "tc");
    },

    durationObject(): DurationType {
      return getDurationFormatted(_rawDuration, "hms");
    },

    durationAsSeconds(): number {
      return getDurationFormatted(_rawDuration, "seconds");
    },

    durationAsFrames(): number {
      // Ensure fps is a number or undefined
      const fps = typeof rest.fps === "number" ? rest.fps : undefined;
      return getDurationFormatted(_rawDuration, "frames", fps);
    },

    get proxy() {
      // If _rawProxy is missing or its size isn't a number, default to 0
      const { size: _rawSize, ..._restProxy } = _rawProxy ?? {};
      const rawSize =
        _rawProxy && typeof _rawProxy.size === "number" ? _rawProxy.size : 0;

      return {
        size(options?: { type: FormatBytesTypes }): string {
          return formatBytes(rawSize ?? 0, {
            output: "string",
            type: options?.type,
          });
        },
        sizeAsNumber(options?: { type: FormatBytesTypes }): number {
          return formatBytes(rawSize ?? 0, {
            output: "number",
            type: options?.type,
          });
        },
        sizeAsTuple(options?: { type: FormatBytesTypes }): [number, string] {
          return formatBytes(rawSize ?? 0, {
            output: "tuple",
            type: options?.type,
          });
        },
        ..._restProxy,
      };
    },
  };
}
