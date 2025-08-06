/**
 * Helper: zero-pad a number to at least two digits (e.g. 3 => "03").
 */
function zeroPad(num: number, length: number = 2): string {
  return String(num).padStart(length, "0");
}

/**
 *    Convert a timecode (HH:MM:SS:FF) into total frames (integer),
 *    given an FPS (frames per second).
 *
 *    @param timecode - The timecode as "HH:MM:SS:FF"
 *    @param fps      - Frames per second
 *    @returns        - Total frames (number) for the given timecode
 */
export function timecodeToFrames(timecode: string, fps: number): number {
  const [hh, mm, ss, ff] = timecode.split(":").map(Number);

  // Total frames = (HH * 3600 + MM * 60 + SS) * fps + FF
  return hh * 3600 * fps + mm * 60 * fps + ss * fps + ff;
}

/**
 *    Convert a timecode (HH:MM:SS:FF) into total seconds (integer),
 *    ignoring the frames (FF).
 *
 *    @param timecode - The timecode as "HH:MM:SS:FF"
 *    @returns        - Total seconds (number) for the given timecode
 */
export function timecodeToSeconds(timecode: string): number {
  const [hh, mm, ss] = timecode.split(":").slice(0, 3).map(Number);

  // Total seconds = HH * 3600 + MM * 60 + SS
  return hh * 3600 + mm * 60 + ss;
}

/**
 * Helper: convert total frames back to timecode (HH:MM:SS:FF) given FPS.
 */
export function framesToTimecode(totalFrames: number, fps: number): string {
  // Compute hours, minutes, seconds, frames
  const hours = Math.floor(totalFrames / (3600 * fps));
  let remainder = totalFrames % (3600 * fps);

  const minutes = Math.floor(remainder / (60 * fps));
  remainder = remainder % (60 * fps);

  const seconds = Math.floor(remainder / fps);
  const frames = remainder % fps;

  return (
    zeroPad(hours, 2) +
    ":" +
    zeroPad(minutes, 2) +
    ":" +
    zeroPad(seconds, 2) +
    ":" +
    zeroPad(frames, 2)
  );
}

/**
 * Helper: convert seconds to timecode (HH:MM:SS:FF)
 */
export function secondsToTimecode(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const remainder = totalSeconds % 3600;
  const minutes = Math.floor(remainder / 60);
  const seconds = Math.floor(remainder % 60);

  return (
    zeroPad(hours, 2) +
    ":" +
    zeroPad(minutes, 2) +
    ":" +
    zeroPad(seconds, 2) +
    ":00"
  );
}

/**
 * Helper: convert seconds to large timecode (HHHH:MM:SS)
 */
export function secondsToLargeTimecode(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const remainder = totalSeconds % 3600;
  const minutes = Math.floor(remainder / 60);
  const seconds = Math.floor(remainder % 60);

  return (
    zeroPad(hours, 4) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2)
  );
}

/**
 *    Calculate the duration between two timecodes, both given in frames,
 *    and return the result in frames (integer). Same behavior as above,
 *    but purely numeric rather than timecode string.
 *
 *    @param startFrames - Start time in frames
 *    @param endFrames   - End time in frames
 *    @returns           - Duration in frames
 */
/*function getDurationInFrames(startFrames: number, endFrames: number): number {
  const duration = endFrames - startFrames
  return duration < 0 ? 0 : duration // or throw an error if negative
}*/

/**
 *    Check if one time range (a1, a2) overlaps or is inside the other
 *    (b1, b2). All four values are in frames.
 *    Returns true if [a1, a2] intersects with [b1, b2].
 *
 *    @param a1 - start of first range in frames
 *    @param a2 - end of first range in frames
 *    @param b1 - start of second range in frames
 *    @param b2 - end of second range in frames
 *    @returns  - boolean (true if overlaps)
 */
export function rangesOverlap(
  a1: number,
  a2: number,
  b1: number,
  b2: number
): boolean {
  // They do NOT overlap if one ends before the other starts:
  //   (a2 < b1) or (b2 < a1).
  // So overlap is the negation of that:
  if (a2 < b1 || b2 < a1) {
    return false;
  }
  return true;
}
