/** @format */

import { LOG_LEVEL } from "../constants/enviromentConstants";

export const LogThis = (logSettings, logMessage) => {
  if (LOG_LEVEL >= 1) {
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
