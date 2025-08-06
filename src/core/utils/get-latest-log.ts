import { LogType } from "../../schemas/log";
import { ProjectSchemaType } from "../../schemas/project";

export async function getLatestLog(
  logs: LogType[],
  project: ProjectSchemaType
): Promise<LogType> {
  if (!logs.length) {
    throw new Error("No logs found");
  }

  const maxDay = Math.max(...logs.map((log) => log.day));

  const latestEntries = logs.filter((log) => log.day === maxDay);

  if (latestEntries.length === 1) return latestEntries[0];

  if (project.unit && latestEntries.length > 1) {
    const matchingUnitEntries = latestEntries.filter(
      (log) => log.unit === project.unit
    );
    if (matchingUnitEntries.length === 1) return matchingUnitEntries[0];
  }
  return latestEntries[0];
}
