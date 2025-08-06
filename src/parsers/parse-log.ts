import fs from "fs";
import path from "path";
import YAML from "yaml";
import { LogType, LogDynamicZod } from "../schemas/log";
import { ProjectSchemaType } from "../schemas/project";
import * as z from "zod";

export const parseLog = async (
  filePath: string,
  project: ProjectSchemaType
): Promise<LogType> => {
  if (!project) throw new Error("No active project provided");
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    throw new Error(
      `Failed to read file ${filePath}: ${(err as Error).message}`
    );
  }

  const { name } = path.parse(filePath);
  let parsed: unknown;
  try {
    parsed = YAML.parse(raw);
  } catch (err) {
    throw new Error(
      `YAML syntax error in ${filePath}: ${(err as Error).message}`
    );
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(
      `Invalid log format in ${filePath}: content must be an object`
    );
  }
  const log = { id: name, ...parsed };
  try {
    const res = LogDynamicZod(project).safeParse(log);
    if (res.success) return res.data as LogType;
    if (res.error) throw new Error(z.prettifyError(res.error));
  } catch (err) {
    throw new Error(`Validation failed for ${filePath}: ${err}`);
  }
  throw new Error(`Unknown validation error in ${filePath}`);
};
