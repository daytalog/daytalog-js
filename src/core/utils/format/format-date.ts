// 1) Union type of all supported formats
export type DateFormatOptions =
  | "yyyymmdd"
  | "yymmdd"
  | "ddmmyyyy"
  | "ddmmyy"
  | "mmddyyyy"
  | "mmddyy"
  | "yyyy-mm-dd"
  | "yy-mm-dd"
  | "dd-mm-yyyy"
  | "dd-mm-yy"
  | "mm-dd-yyyy"
  | "mm-dd-yy"
  | "yyyy/mm/dd"
  | "yy/mm/dd"
  | "dd/mm/yyyy"
  | "dd/mm/yy"
  | "mm/dd/yyyy"
  | "mm/dd/yy";

// 2) formatDate function
export function formatDate(
  dateIso: string,
  format?: DateFormatOptions
): string {
  if (!format) return dateIso;
  // parse "YYYY-MM-DD"
  const parts = dateIso.split("-");
  const yyyy = parts[0];
  const mm = parts[1];
  const dd = parts[2];

  // derive short year
  const yy = yyyy.slice(2);

  // token → value map
  const map: { [token: string]: string } = {
    yyyy: yyyy,
    yy: yy,
    mm: mm,
    dd: dd,
  };

  // replace tokens in format string
  return format.replace(/yyyy|yy|mm|dd/g, function (token) {
    return map[token];
  });
}
