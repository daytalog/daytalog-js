export function padDay(day: string | number, pad: 1 | 2 | 3 = 1): string {
  const str = typeof day === "number" ? day.toString() : day;
  return str.padStart(pad, "0");
}
