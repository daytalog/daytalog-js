import * as z from "zod";
import { CustomSchemaType, FieldType, ProjectSchemaType } from "./project";
import {
  isValidTimecodeFormat,
  timecodeValidation,
} from "./utils/validate-timecode";

const timecode = z.string().refine((val) => isValidTimecodeFormat(val), {
  error: "Invalid timecode format",
});

// KEEP CAMERA METADATA MINIMAL - EXTEND WITH CUSTOM
export const CameraMetadataZod = z.object({
  clip: z.string(),
  tc_start: timecode.optional(),
  tc_end: timecode.optional(),
  duration: timecode.optional(),
  camera_model: z.string().optional(),
  reel: z.string().optional(),
  fps: z.coerce.number().optional(),
  sensor_fps: z.coerce.number().optional(),
  lens: z.string().optional(),
  shutter: z.coerce.number().optional(),
  resolution: z.string().optional(),
  codec: z.string().optional(),
  gamma: z.string().optional(),
  ei: z.coerce.number().optional(),
  wb: z.coerce.number().optional(),
  tint: z.string().optional(),
  lut: z.string().optional(),
});

export const CameraMetadataEnum = CameraMetadataZod.keyof();
export type CameraMetadataEnumType = z.infer<typeof CameraMetadataEnum>;

export type CameraMetadataType = z.infer<typeof CameraMetadataZod>;

const copy = z.object({
  volume: z.string(),
  hash: z.string().nullable(),
});
const copies = z.array(copy).default([]);
export type CopyBaseType = z.infer<typeof copy>;
const size = z.number().nonnegative();

export type CopyType = {
  volumes: string[];
  clips: string[];
  count: [number, number];
};

const OcfClipBaseZod = z.object({
  clip: z.string(),
  size: size,
  copies: copies,
});

export const OcfClipZod = timecodeValidation(
  z.object({ ...OcfClipBaseZod.shape, ...CameraMetadataZod.shape }),
  ["tc_start", "tc_end", "duration"]
);
const OcfClipBasePartial = OcfClipBaseZod.partial({ size: true, copies: true });
export type OcfClipType = z.infer<typeof OcfClipZod>;
export type OcfClipBaseType = z.infer<typeof OcfClipBaseZod>;

export const SoundClipZod = timecodeValidation(
  z.object({
    clip: z.string(),
    size: size,
    copies: copies,
    tc_start: z.string().optional(),
    tc_end: z.string().optional(),
  }),
  ["tc_start", "tc_end"]
);

export type SoundClipType = z.infer<typeof SoundClipZod>;

export const ProxyClipZod = z.object({
  clip: z.string(),
  size: size,
  format: z.string().optional(),
  codec: z.string().optional(),
  resolution: z.string().optional(),
});
export type ProxyClipType = z.infer<typeof ProxyClipZod>;

const file = z.int().nonnegative().optional();
const sizeOptional = z.optional(size);
const copiesarray = z.array(z.string()).optional();

export const SoundZod = z.object({
  files: file,
  size: sizeOptional,
  copies: copiesarray,
  clips: z.array(SoundClipZod).optional(),
});
export type SoundType = z.infer<typeof SoundZod>;

export const OCFZod = z.object({
  files: file,
  size: sizeOptional,
  duration: timecode.optional(),
  reels: z.array(z.string()).optional(),
  copies: copiesarray,
  clips: z.array(OcfClipZod).optional(),
});
export type OcfType = z.infer<typeof OCFZod>;

export const ProxyZod = z.object({
  files: file,
  size: sizeOptional,
  clips: z.array(ProxyClipZod).optional(),
});
export type ProxyType = z.infer<typeof ProxyZod>;

const customClipZod = z
  .object({
    clip: z.string().optional(),
    tc_start: timecode.optional(),
    tc_end: timecode.optional(),
  })
  .catchall(z.any());

const CustomZod = z.object({
  schema: z.string(),
  log: z.object(z.record(z.string(), z.any())).optional(),
  clips: z.array(customClipZod).optional(),
});

export type CustomClipType = z.infer<typeof customClipZod>;
export type CustomType = z.infer<typeof CustomZod>;

export const LogZod = z.object({
  id: z.string().min(1).max(50),
  day: z
    .int({ error: "day is required" })
    .gte(1, { error: "Day must be greater than or equal to 1" })
    .lte(999, { error: "Day must be below 999" }),
  date: z.iso.date(),
  unit: z.string().optional(),
  ocf: OCFZod.optional(),
  proxy: ProxyZod.optional(),
  sound: SoundZod.optional(),
  custom: z.array(CustomZod).optional(),
  version: z.int(),
});

export const logZodMerged = LogZod.omit({ day: true }).extend({
  day: z.coerce.string({ error: "day is required" }),
});

export type LogType = z.infer<typeof LogZod>;
export type LogTypeMerged = z.infer<typeof logZodMerged>;

const preprocessNestedObjectToArray = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(preprocessNestedObjectToArray); // Recursively process nested arrays
  }
  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    if (keys.every((key) => /^\d+$/.test(key))) {
      // If all keys are numeric, convert to array
      return keys
        .map(Number)
        .sort((a, b) => a - b)
        .map((key) => (data as Record<string, unknown>)[key]);
    }
  }
  return data; // Return unchanged if no transformation is needed
};

const mapTypeToZod = (field: FieldType): z.ZodType | undefined => {
  switch (field.type) {
    case "text":
      return z.string().optional();
    case "text_list":
      return z.array(z.string()).optional();
    case "text_list_list":
      return z
        .array(z.preprocess(preprocessNestedObjectToArray, z.array(z.string())))
        .optional();
    case "kv_map":
      return z.record(z.string(), z.string().optional()).optional();
    case "kv_map_list":
      const subfieldobjects: Record<string, z.ZodTypeAny> = {};
      const { subfields } = field;
      subfields.forEach((subfield) => {
        subfieldobjects[subfield.key_name] = z.string().optional();
      });
      return z.array(z.object(subfieldobjects)).optional();
    default:
      return undefined;
  }
};

const buildCustomFieldsSchema = (fields?: FieldType[]) => {
  const customFields: Record<string, z.ZodTypeAny> = {};
  if (fields) {
    for (const field of fields) {
      if ("key_name" in field) {
        const zodSchema = mapTypeToZod(field);
        if (zodSchema) {
          customFields[field.key_name] = zodSchema;
        }
      } else if (CameraMetadataEnum.options.includes(field.type)) {
        customFields[field.type] = CameraMetadataZod.shape[field.type];
      }
    }
  }

  return customFields;
};

export const CustomClipsFieldsZod = (schema: CustomSchemaType) => {
  if (schema.sync === "tc") {
    return z
      .object({
        ...buildCustomFieldsSchema(schema.clip_fields),
        tc_start: timecode,
        tc_end: timecode,
      })
      .check((ctx) => {
        if (!ctx.value.tc_start) {
          ctx.issues.push({
            code: "custom",
            message: "tc_start is required when tc sync method is chosen",
            input: ctx.value,
          });
        }
        if (!ctx.value.tc_end) {
          ctx.issues.push({
            code: "custom",
            message: "tc_end is required when tc sync method is chosen",
            input: ctx.value,
          });
        }
      });
  } else {
    return z.object({
      ...buildCustomFieldsSchema(schema.clip_fields),
      clip: z.string({
        error: "clip is required when clip sync method is chosen",
      }),
    });
  }
};

export const CustomSchema = (schema: CustomSchemaType) =>
  z.object({
    schema: z.string().min(1).max(80),
    log: z.object(buildCustomFieldsSchema(schema.log_fields)).optional(),
    clips: z.array(CustomClipsFieldsZod(schema)).optional(),
  });

const CustomSchemas = (project: ProjectSchemaType) => {
  if (!project.custom_schemas) return z.array(z.object({})).optional();
  const sortedSchemas = project.custom_schemas
    .filter((schema) => schema.active)
    .sort((a, b) => a.order - b.order);
  if (sortedSchemas.length === 0) {
    // No active custom schemas, return a safe empty schema
    return z.array(z.object({})).optional();
  }
  return z.array(z.union(sortedSchemas.map((s) => CustomSchema(s))));
};

export const CustomClipsFromSchemas = (project: ProjectSchemaType) => {
  if (!project.custom_schemas) {
    return z.object({});
  }
  const sortedSchemas = project.custom_schemas
    .filter((schema) => schema.active)
    .sort((a, b) => a.order - b.order);

  if (sortedSchemas.length === 0) {
    // No active custom schemas, return a safe empty schema
    return z.object({});
  }
  // Merge all custom fields into a single shape
  const customFields: Record<string, z.ZodType> = sortedSchemas.reduce(
    (acc, schema) => ({
      ...acc,
      ...buildCustomFieldsSchema(schema.clip_fields),
    }),
    {}
  );
  return z.object(customFields);
};

export const LogDynamicZod = (project: ProjectSchemaType) => {
  return LogZod.omit({ custom: true }).extend({
    custom: CustomSchemas(project).optional(),
  });
};

const ClipZod = z.object({
  ...OcfClipBasePartial.shape,
  ...CameraMetadataZod.shape,
  sound: z.array(z.string()).default([]),
  proxy: ProxyClipZod.omit({ clip: true }),
});
export type ClipType = z.infer<typeof ClipZod>;

// for definitions
export const ClipDynamicZod = (project: ProjectSchemaType) => {
  return z
    .object({
      ...ClipZod.shape,
      ...CustomClipsFromSchemas(project).shape,
    })
    .omit({
      size: true,
      duration: true,
      proxy: true,
    });
};
