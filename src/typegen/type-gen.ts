import { ZodType } from "zod";
//import { printNode, zodToTs } from "zod-to-ts";
import {
  ClipDynamicZod,
  OcfClipZod,
  SoundClipZod,
  ProxyClipZod,
  LogDynamicZod,
} from "../schemas/log";
import { ProjectSchemaType } from "../schemas/project";

type ClipTypeName = "Log" | "Clip" | "OcfClip" | "SoundClip" | "ProxyClip";
type TypeDefinition = {
  [K in ClipTypeName]: string;
};

/*function transformAstString(astString: string, identifier: string): string {
  return `${identifier === "Clip" ? `interface ${identifier} ` : ""}${astString
    .replace(/\.\.\.args_\d+: unknown\[\]/g, "") // Remove variadic arguments
    .replace(/,\s*,/g, ",") // Remove duplicate commas
    .replace(/\(\s*,/g, "(") // Remove leading commas in parentheses
    .replace(/,\s*\)/g, ")") // Remove trailing commas in parentheses
    .replace(/\(args_0:/, "(options?:") // Rename args_0 to options?
    .trim()}`;
}

const generateDynamicAST = (
  identifier: ClipTypeName,
  schema: ZodTypeAny
): Pick<TypeDefinition, typeof identifier> => {
  const { node } = zodToTs(schema, identifier);
  return {
    [identifier]: transformAstString(printNode(node), identifier),
  } as Pick<TypeDefinition, typeof identifier>;
};*/

function schemaToType(schema: ZodType<any, any, any>): string {
  const def = (schema as any).def;
  switch (def.type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "literal":
      return JSON.stringify(def.value);
    case "enum":
      return def.values.map((v: string) => JSON.stringify(v)).join(" | ");
    case "array":
      return `${schemaToType(def.element)}[]`;
    case "object": {
      const shape = def.shape;
      const entries = Object.entries(shape).map(([key, child]) => {
        const childDef = (child as any).def;
        const isOpt = childDef.type === "optional";
        const inner = isOpt ? childDef.innerType : child;
        const optionalFlag = isOpt ? "?" : "";
        return `${key}${optionalFlag}: ${schemaToType(inner)}`;
      });
      return `{ ${entries.join("; ")} }`;
    }
    case "union":
      return def.options
        .map((opt: ZodType<any, any, any>) => schemaToType(opt))
        .join(" | ");
    case "optional":
      return `${schemaToType(def.innerType)} | undefined`;
    case "nullable":
      return `${schemaToType(def.innerType)} | null`;
    case "default":
      return schemaToType(def.innerType);
    case "pipe":
      return `${schemaToType(def.out)}`;
    case "record":
      return `Record<${schemaToType(def.keyType)}, ${schemaToType(def.valueType)}>`;
    default:
      return "any";
  }
}

function schemaToInterfaceText(
  identifier: ClipTypeName,
  schema: ZodType<any, any, any>
): Pick<TypeDefinition, typeof identifier> {
  if ((schema as any).def.type !== "object") {
    throw new Error("schemaToInterfaceText expects a ZodObject schema");
  }
  const shape = (schema as any).def.shape;
  const members = Object.entries(shape).map(([key, child]) => {
    let optionalFlag = "";
    let typeSchema: ZodType<any, any, any> = child as ZodType<any, any, any>;
    const childDef = (child as any).def;
    if (childDef.type === "optional") {
      optionalFlag = "?";
      typeSchema = childDef.innerType;
    }
    return `  ${key}${optionalFlag}: ${schemaToType(typeSchema)};`;
  });
  return {
    [identifier]: `{\n${members.join("\n")}\n}`,
  } as Pick<TypeDefinition, typeof identifier>;
}

export const createTypeDefinition = (
  project: ProjectSchemaType
): TypeDefinition => {
  const clipTypes = [
    { name: "Log" as const, schema: LogDynamicZod(project) },
    { name: "Clip" as const, schema: ClipDynamicZod(project) },
    { name: "OcfClip" as const, schema: OcfClipZod },
    { name: "SoundClip" as const, schema: SoundClipZod },
    { name: "ProxyClip" as const, schema: ProxyClipZod },
  ];

  return clipTypes.reduce(
    (acc, { name, schema }) => ({
      ...acc,
      ...schemaToInterfaceText(name, schema),
    }),
    {} as TypeDefinition
  );
};
