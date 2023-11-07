/** @format */
import { LOG_LEVEL } from "../constants/enviromentConstants";

export const OFF = -1;
export const L0 = 0;
export const L1 = 1;
export const L2 = 2;
export const L3 = 3;

export const LogThis = (logSettings, logMessage, level = OFF) => {
  if (level != OFF && LOG_LEVEL != OFF) {
    if (LOG_LEVEL >= level) {
      !logSettings
        ? console.log("%s: %s", new Date().toLocaleTimeString(), logMessage)
        : console.log(
            "%s: %s, %s: %s",
            new Date().toLocaleTimeString(),
            logSettings.fileName ?? "NA",
            logSettings.functionName ?? "NA",
            logMessage
          );
    }
  }
};
export const objLogSettings = { sourceFilename: "", sourceFunction: "" };

export const initLogSettings = (fileName = "", functionName = "") => {
  return {
    fileName: fileName,
    functionName: functionName,
  };
};

export function LoggerSettings(fileName = "", functionName = "") {
  this.fileName = fileName || "";
  this.functionName = functionName || "";
}
