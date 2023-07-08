const LogThis = (logSettings=null, logMessage) => {  
  if(process.env.LOG_LEVEL>=1) {
    logSettings? 
    (console.log("%s: %s", new Date().toLocaleTimeString(), logMessage))
    :
    (console.log("%s: %s, %s: %s", new Date().toLocaleTimeString(), logSettings.sourceFilename, logSettings.sourceFunction, logMessage)) 
    }
}

const initLogSettings = (fileName='', functionName='') => {
  return {
    sourceFilename: fileName,
    sourceFunction: functionName
  }
}

module.exports = {LogThis, initLogSettings}
