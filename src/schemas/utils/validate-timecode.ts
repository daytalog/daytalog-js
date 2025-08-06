import * as z from "zod";

/**
 * Checks if the given string is a valid timecode in the format "HH:MM:SS:FF".
 * Also checks if frames < fps, minutes < 60, seconds < 60.
 *
 * @param timecode - The timecode string to validate (e.g., "01:23:45:10")
 * @param fps      - Frames per second (used to validate that FF < fps)
 * @returns        - true if valid timecode format; otherwise false
 */
export function isValidTimecodeFormat(timecode: string, fps?: number): boolean {
  // Basic regex to match "HH:MM:SS:FF" pattern (H, M, S, F can be 1-2 digits)
  // This will capture hours, minutes, seconds, frames in capturing groups.
  const regex = /^(\d{1,2}):(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  const match = timecode.match(regex);

  if (!match) {
    return false;
  }

  // Extract each component as numbers
  const [_, hh, mm, ss, ff] = match;
  const hours = Number(hh);
  const minutes = Number(mm);
  const seconds = Number(ss);
  const frames = Number(ff);

  // Validate ranges:
  // - minutes < 60
  // - seconds < 60
  // - frames < fps (e.g. 24, 25, 30, etc.)
  // (hours can typically be any non-negative integer, so we won't set an upper bound here.)
  if (
    minutes < 60 &&
    seconds < 60 &&
    frames < (fps ?? 99) &&
    minutes >= 0 &&
    seconds >= 0 &&
    frames >= 0 &&
    hours >= 0
  ) {
    return true;
  }

  return false;
}

/**
 * Adds timecode validation to a Zod schema.
 *
 * @param schema - The Zod object schema to enhance.
 * @param timecodeFields - An array of field names that represent timecodes.
 * @returns A new Zod schema with the timecode validations applied.
 */
export function timecodeValidation<T extends z.ZodObject<any>>(
  schema: T,
  timecodeFields: string[]
) {
  return schema.check((ctx) => {
    const data = ctx.value;
    const fps = data.fps;

    if (data.duration && fps == null) {
      ctx.issues.push({
        code: "custom",
        message: "fps is required when duration timecode is provided.",
        //path: ["fps"],
        input: fps,
      });
      // Early return to prevent further validation if fps is missing
      return;
    }

    if (fps != null) {
      if (typeof fps !== "number" || isNaN(fps) || fps <= 0) {
        ctx.issues.push({
          code: "custom",
          message: "fps must be a valid positive number.",
          //path: ["fps"],
          input: fps,
        });
        // Early return to prevent further validation if fps is invalid
        return;
      }

      // Validate each provided timecode field
      timecodeFields.forEach((field) => {
        const timecodeValue = data[field];
        if (
          timecodeValue &&
          !isValidTimecodeFormat(timecodeValue as string, fps)
        ) {
          ctx.issues.push({
            code: "custom",
            message: `${field} in ${data["clip"]}: "${timecodeValue}" is not a valid timecode format.`,
            //path: [field],
            input: field,
          });
        }
      });
    }
  });
}
