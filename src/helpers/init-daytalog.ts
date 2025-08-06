import { createDaytalog } from "../core/daytalog";
import { LogType } from "../schemas/log";
import { ProjectSchemaType } from "../schemas/project";

export type InitDaytalogProps = {
  selection?: string[];
  message?: string;
};

export async function initializeDaytalog(options: InitDaytalogProps = {}) {
  const { selection, message } = options;
  const modulePath = import.meta.resolve("/daytalog/generated/data.ts");
  const { project, logs } = (await import(modulePath)) as {
    project: ProjectSchemaType;
    logs: LogType[];
  };

  return createDaytalog({
    project,
    logs: logs,
    selection,
    message,
  });
}
