import fs from "fs";
import YAML from "yaml";
import { ProjectSchemaZod, ProjectSchemaType } from "../schemas/project";

export const parseProject = async (
  filePath: string
): Promise<ProjectSchemaType> => {
  if (fs.existsSync(filePath)) {
    const yaml = fs.readFileSync(filePath, "utf8");
    const parsedYaml = YAML.parse(yaml);
    const parse = ProjectSchemaZod.safeParse(parsedYaml);

    if (parse.success) {
      return parse.data;
    } else {
      throw new Error(`Invalid project config in ${filePath}: ${parse.error}`);
    }
  } else {
    throw new Error("Project config file does not exist");
  }
};
