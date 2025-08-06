export { useDaytalog } from "./context/daytalog-context";
export { InternalDaytalogProvider } from "./context/daytalog-context";
export { createDaytalog } from "./core/daytalog";
export type { DaytalogProps } from "./core/daytalog";

// Main exports
export { DaytalogProvider } from "./helpers/daytalog-provider";
export type { DaytalogProviderProps } from "./helpers/daytalog-provider";

// Advanced initialization helpers
export { initializeDaytalog } from "./helpers/init-daytalog";
export type { InitDaytalogProps } from "./helpers/init-daytalog";

// Type generation

//export { createTypeDefinition } from "./typegen/type-gen";
export type { Daytalog, Log } from "./typegen/daytalog";

//schemas
export {
  GlobalSchemaZod,
  ProjectSchemaZod,
  emailZodObj,
  pdfZodObj,
  delimitersZod,
  fieldEnum as fieldEnumZod,
  CustomSchemaZod,
} from "./schemas/project";

export {
  CameraMetadataZod,
  CameraMetadataEnum as CameraMetadataEnumZod,
  LogZod,
  LogDynamicZod,
  CustomSchema,
  OCFZod,
  SoundZod,
  ProxyZod,
} from "./schemas/log";

// Types
export type {
  ProjectSchemaType,
  EmailType,
  PdfType,
  FieldEnumType,
  SubFieldsType,
  FieldType,
  CustomSchemaType,
  TextFieldType,
  TextListFieldType,
  TextListListFieldType,
  KvMapFieldType,
  KvMapListFieldType,
} from "./schemas/project";

export type {
  CopyType,
  CopyBaseType,
  CameraMetadataType,
  CameraMetadataEnumType,
  OcfClipType,
  OcfClipBaseType,
  SoundClipType,
  ProxyClipType,
  CustomClipType,
  CustomType,
  LogType,
  LogTypeMerged,
} from "./schemas/log";

// utils
export {
  getDuration,
  getReels,
  countClipFiles,
  sumClipSizes,
} from "./core/utils/methods";

export * as format from "./core/utils/format";
