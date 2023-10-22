/** @format */

const LogThis = (logSettings, logMessage) => {
  if (process.env.LOG_LEVEL >= 1) {
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

module.exports = { LogThis, initLogSettings, LoggerSettings };
