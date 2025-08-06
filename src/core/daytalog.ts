import { ProjectSchemaType } from "../schemas/project";
import { LogType } from "../schemas/log";
import { mergeLogs } from "./utils/merge/merge-logs";
import { getLatestLog } from "./utils/get-latest-log";
import { createLog } from "./log";
import { FormatBytesTypes } from "./utils/format/format-bytes";
import {
  getDay,
  getTotalFiles,
  getTotalSize,
  getTotalDuration,
  getTotalDayRange,
  getTotalDateRange,
} from "./utils/methods";
import { Daytalog, Log } from "../typegen/daytalog";
import { DateFormatOptions } from "./utils/format/format-date";

const cache = new Map<
  string,
  { logAll: Log[]; logMap: Map<string, Log>; logLatest: LogType }
>();
const selCache = new Map<string, LogType[]>();
// cache merged results for a given selection key
const selResultCache = new Map<string, { log: Log; selectedLogs: Log[] }>();

export type DaytalogProps = {
  project: ProjectSchemaType;
  cacheLog?: string;
  logs: LogType[];
  selection?: string[]; // ['D01_250601', 'D02_250601']
  message?: string;
};
/**
 * Creates a new Daytalog instance with the provided options.
 * This factory function handles the heavy processing of merging logs and clips.
 *
 * @param options The options to create the Daytalog instance
 * @returns A Promise that resolves to a Daytalog instance
 */
export async function createDaytalog(props: DaytalogProps): Promise<Daytalog> {
  const { selection: _selection, cacheLog, logs, project, message } = props;

  if (!project) {
    throw new Error("Project is required to initialize Daytalog.");
  }

  if (!logs?.length) {
    throw new Error("The logs array must contain at least one Log.");
  }

  let log: Log;
  let selectedLogs: Log[];
  let logAll: Log[], logMap: Map<string, Log>;
  let logLatest: LogType;

  const options = {
    schemas: project.custom_schemas,
    match_sound: project.match_sound,
    match_schemas: project.match_schemas,
  };
  const hit = cacheLog ? cache.get(cacheLog) : null;
  if (hit) {
    ({ logAll, logMap, logLatest } = hit);
  } else {
    logAll = await Promise.all(logs.map((l) => createLog(l, options)));
    logMap = new Map(logAll.map((l) => [l.id, l]));
    logLatest = await getLatestLog(logs, project);
    if (cacheLog) cache.set(cacheLog, { logAll, logMap, logLatest });
  }
  const selKey = _selection?.join() ?? "";
  let selection: LogType | LogType[];
  const selHit = selCache.get(selKey);
  if (selHit) {
    // reuse cached selection
    selection = selHit.length === 1 ? selHit[0] : selHit;
  } else {
    const len = _selection?.length ?? 0;
    const selSet = new Set<string>(_selection);
    if (len === 0) {
      selection = logLatest;
    } else if (len === 1) {
      const log = logs.find((log) => selSet.has(log.id));
      if (!log) throw new Error("Selected log could not be found");
      selection = log;
    } else {
      const filtered = logs.filter((log) => selSet.has(log.id));
      if (!filtered) throw new Error("Selected logs coud not be found");
      selection = filtered;
    }
    const selArr = Array.isArray(selection) ? selection : [selection];
    selCache.set(selKey, selArr);
  }

  // reuse merged result if selection unchanged
  const selResultHit = selResultCache.get(selKey);
  if (selResultHit) {
    ({ log, selectedLogs } = selResultHit);
  } else {
    if (Array.isArray(selection)) {
      // Merge the selected logs
      console.log("multiple, will merge");
      const mergedData = await mergeLogs(selection, options);
      log = await createLog(mergedData, options);
      const logsToSet = selection.map((s) => {
        const entry = logMap.get(s.id);
        if (!entry) throw new Error(`Selected log ${s.id} could not be found`);
        return entry;
      });
      if (logsToSet.length === 0) {
        throw new Error("Selected logs could not be found");
      }
      selectedLogs = logsToSet;
    } else {
      console.log("is one log");
      const logToSet = logMap.get(selection.id);
      if (!logToSet) throw new Error("Selected log could not be found");
      log = logToSet;
      selectedLogs = [logToSet];
    }
    selResultCache.set(selKey, { log, selectedLogs });
  }

  const createCommonMethods = (
    data: Log[],
    context: "ocf" | "proxy" | "sound"
  ) => ({
    files: (): number => getTotalFiles(data, context),
    size: (options?: { type: FormatBytesTypes }): string =>
      getTotalSize(data, context, { output: "string", type: options?.type }),
    sizeAsNumber: (options?: { type: FormatBytesTypes }): number =>
      options
        ? getTotalSize(data, context, {
            output: "number",
            type: options.type,
          })
        : getTotalSize(data, context),
    sizeAsTuple: (options?: { type: FormatBytesTypes }): [number, string] =>
      getTotalSize(data, context, { output: "tuple", type: options?.type }),
  });

  return {
    log,
    logs: selectedLogs,
    logAll,
    projectName: project.project_name,
    customInfo: project.custom_info,
    message: message ?? "",
    total: {
      days: (minDigits?: 1 | 2 | 3) =>
        getDay(logAll.length, { pad: minDigits }),
      dayRange: (minDigits?: 1 | 2 | 3) =>
        getTotalDayRange(logAll, { pad: minDigits }),
      dateRange: (format?: DateFormatOptions) =>
        getTotalDateRange(logAll, { format }),
      ocf: {
        ...createCommonMethods(logAll, "ocf"),
        duration: () => getTotalDuration(logAll, "hms-string"),
        durationTC: () => getTotalDuration(logAll, "tc"),
        durationObject: () => getTotalDuration(logAll, "hms"),
      },
      proxy: createCommonMethods(logAll, "proxy"),
      sound: createCommonMethods(logAll, "sound"),
    },
  };
}
