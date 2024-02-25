/** @format */

const OFF = -1;
const L0 = 0;
const L1 = 1;
const L2 = 2;
const L3 = 3;

const LogThis = (logSettings, logMessage, level = OFF) => {
  if (level != OFF && process.env.LOG_LEVEL != OFF) {
    if (process.env.LOG_LEVEL >= level) {
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

const LogThisLegacy = (logSettings = null, logMessage) => {
  if (process.env.LOG_LEVEL >= 1) {
    !logSettings
      ? console.log("%s: %s", new Date().toLocaleTimeString(), logMessage)
      : console.log(
          "%s: %s, %s: %s",
          new Date().toLocaleTimeString(),
          logSettings.sourceFilename,
          logSettings.sourceFunction,
          logMessage
        );
  }
};

const initLogSettings = (fileName = "", functionName = "") => {
  return {
    sourceFilename: fileName,
    sourceFunction: functionName,
  };
};

function LoggerSettings(fileName = "", functionName = "") {
  this.fileName = fileName || "";
  this.functionName = functionName || "";
}

module.exports = {
  LogThis,
  LogThisLegacy,
  initLogSettings,
  LoggerSettings,
  OFF,
  L0,
  L1,
  L2,
  L3,
};
