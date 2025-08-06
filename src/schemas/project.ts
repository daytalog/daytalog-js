import * as z from "zod";
import { CameraMetadataEnum } from "./log";

export const fieldEnum = z.enum([
  "text", //string
  "text_list", //list_of_strings
  "text_list_list", //list_of_string_arrays
  "kv_map", // key-value_object
  "kv_map_list", //list_of_mapped_objects
]);

export const delimitersZod = z.enum([",", ";", "|", ":", "="]);

const fileNameRegex = /^[^<>:"/\\|?*\x00-\x1F]*$/;

const reservedNames = ["settings", "shared", "templates"];

const subfields = z
  .array(z.object({ key_name: z.string().min(1).max(80) }))
  .nonempty()
  .check((ctx) => {
    const seen = new Set<string>();
    ctx.value.forEach((subfield, i) => {
      const keyLower = subfield.key_name.toLowerCase();
      if (seen.has(keyLower)) {
        ctx.issues.push({
          code: "custom",
          message: "Key must be unique",
          input: [i, "key_name"],
        });
      } else {
        seen.add(keyLower);
      }
    });
  });

const key_name = z.string().min(1).max(80);
const column = z.preprocess((val) => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return val;
}, z.string().min(1).max(80).optional());

const textField = z.object({
  type: fieldEnum.extract(["text"]),
  key_name,
  column,
});
const textListField = z.object({
  type: fieldEnum.extract(["text_list"]),
  key_name,
  column,
  delimiter: delimitersZod.optional(),
});
const textListListField = z.object({
  type: fieldEnum.extract(["text_list_list"]),
  key_name,
  column,
  primary_delimiter: delimitersZod.optional(),
  secondary_delimiter: delimitersZod.optional(),
});
const kvMapField = z.object({
  type: fieldEnum.extract(["kv_map"]),
  key_name,
  column,
  primary_delimiter: delimitersZod.optional(),
  secondary_delimiter: delimitersZod.optional(),
});
const kvMapListField = z.object({
  type: fieldEnum.extract(["kv_map_list"]),
  key_name,
  column,
  subfields,
  primary_delimiter: delimitersZod.optional(),
  secondary_delimiter: delimitersZod.optional(),
});
const MetadataType = z.object({
  type: CameraMetadataEnum,
  column,
});

export type TextFieldType = z.infer<typeof textField>;
export type TextListFieldType = z.infer<typeof textListField>;
export type TextListListFieldType = z.infer<typeof textListListField>;
export type KvMapFieldType = z.infer<typeof kvMapField>;
export type KvMapListFieldType = z.infer<typeof kvMapListField>;

const logField = z.discriminatedUnion("type", [
  textField,
  textListField,
  textListListField,
  kvMapField,
  kvMapListField,
]);

const clipfield = z.discriminatedUnion("type", [
  textField,
  textListField,
  textListListField,
  kvMapField,
  kvMapListField,
  MetadataType,
]);

export const CustomSchemaZod = z
  .object({
    id: z.string().min(1).max(80),
    order: z.int(),
    active: z.boolean().prefault(true),
    sync: z.enum(["clip", "tc"]),
    csv_import: z.boolean().prefault(false),
    log_fields: z
      .array(logField)
      .check((ctx) => {
        const reservedNames = [
          "id",
          "day",
          "date",
          "unit",
          "ocf",
          "sound",
          "proxy",
          "custom",
          "match_schema",
          "match_sound",
          "version",
        ];
        const seenNames = new Set<string>(reservedNames);

        ctx.value.forEach((field, index) => {
          if ("key_name" in field) {
            const keyLowerCase = field.key_name.toLowerCase();
            if (seenNames.has(keyLowerCase)) {
              const message = reservedNames.includes(keyLowerCase)
                ? `"${field.key_name}" is reserved and cannot be used.`
                : "Key must be unique";
              ctx.issues.push({
                code: "custom",
                message: message,
                input: [index, "key_name"],
              });
            } else {
              seenNames.add(field.key_name);
            }
          }
        });
      })
      .optional(),
    clip_fields: z
      .array(clipfield)
      .check((ctx) => {
        const reservedNames = ["clip", "size", "duration", "proxy", "sound"];
        const seenNames = new Set<string>(reservedNames);

        ctx.value.forEach((field, index) => {
          if ("key_name" in field) {
            const keyLowerCase = field.key_name.toLowerCase();
            if (seenNames.has(keyLowerCase)) {
              const message = reservedNames.includes(keyLowerCase)
                ? `"${field.key_name}" is reserved and cannot be used.`
                : "Key must be unique";
              ctx.issues.push({
                code: "custom",
                message: message,
                input: [index, "key_name"],
              });
            } else {
              seenNames.add(field.key_name);
            }
          }
        });
      })
      .optional(),
  })
  .check((ctx) => {
    if (ctx.value.csv_import === true) {
      ctx.value.log_fields?.forEach((field) => {
        if (!field.column) {
          ctx.issues.push({
            code: "invalid_type",
            expected: "string",
            received: "undefined",
            input: field.column,
            message: `${ctx.value.id}.${field.key_name}: Column is required for ${field.key_name} when csv import is enabled`,
          });
        }
      });
      ctx.value.clip_fields?.forEach((field) => {
        if (!field.column) {
          ctx.issues.push({
            code: "invalid_type",
            expected: "string",
            received: "undefined",
            input: field.column,
            message: `${ctx.value.id}.${"key_name" in field ? field.key_name : field.type}: Column is required for ${"key_name" in field ? field.key_name : field.type} when csv import is enabled`,
          });
        }
      });
    }
  });

export const pdfZodObj = z.object({
  id: z.string().length(5),
  label: z.string().nonempty("Label is required"),
  output_name: z
    .string()
    .nonempty("Output name is required")
    .endsWith(".pdf", "Output name must end with .pdf")
    .regex(
      /^[a-zA-Z0-9<>_-]+\.pdf$/,
      "Output name must end with .pdf and contain only allowed characters before it."
    ),
  react: z.string().nonempty("Selecting a template is required"),
  enabled: z.boolean(),
});

export const emailZodObj = z.object({
  id: z.string().length(5),
  label: z.string().nonempty("Label is required"),
  recipients: z
    .array(z.email({ error: "Must be a vaild email" }))
    .min(1, { error: "Must contain at least one recipient" }),
  subject: z.string().min(1, "Subject are required"),
  attachments: z.array(z.string().length(5)).optional(),
  message: z.string().optional(),
  react: z.string().optional(),
  enabled: z.boolean(),
});

export const GlobalSchemaZod = z.object({
  logid_template: z
    .string()
    .regex(/^[a-zA-Z0-9<>_-]*$/, {
      message: "The log ID contains illegal characters.",
    })
    .regex(/^(?!.*<log>).*$/, {
      message: `The field cannot contain it's tag "<log>".`,
    })
    .optional(),
  unit: z
    .string()
    .regex(/^(?!.*<unit>).*$/, {
      message: `The field cannot contain it's tag "<unit>".`,
    })
    .optional(),
  custom_info: z.array(z.record(z.string(), z.string())).optional(),
  default_ocf_paths: z.array(z.string()).optional(),
  default_sound_paths: z.array(z.string()).optional(),
  default_proxy_path: z.string().optional(),
  match_sound: z.boolean().prefault(true),
  match_schemas: z.boolean().prefault(true),
  custom_schemas: z.array(CustomSchemaZod).optional(),
  emails: z.array(emailZodObj).optional(),
  email_sender: z.string().optional(),
  pdfs: z.array(pdfZodObj).optional(),
  version: z.number().int(),
});

export const ProjectSchemaZod = z.object({
  project_name: z
    .string()
    .min(1, { message: "The project name must contain at least 1 character" })
    .max(100, { message: "The project name must be shorter" })
    .regex(fileNameRegex, {
      message: "Please remove any invalid characters from project name",
    })
    .refine((name) => !reservedNames.includes(name), {
      message: "The project name cannot be a reserved name",
    }),
  ...GlobalSchemaZod.omit({ email_sender: true }).shape,
});

export type ProjectSchemaType = z.infer<typeof ProjectSchemaZod>;

export type EmailType = z.infer<typeof emailZodObj>;
export type PdfType = z.infer<typeof pdfZodObj>;

export type FieldEnumType = z.infer<typeof fieldEnum>;
export type SubFieldsType = z.infer<typeof subfields>;
export type FieldType = z.infer<typeof clipfield>;
export type CustomSchemaType = z.infer<typeof CustomSchemaZod>;
export type LogOptions = {
  match_sound: boolean;
  match_schemas: boolean;
  schemas?: CustomSchemaType[];
};
