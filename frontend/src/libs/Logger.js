import { LOG_LEVEL } from '../constants/enviromentConstants'

export const LogThis = (logSettings=null, logMessage='') => {
    
  if(LOG_LEVEL>=1) {
    !logSettings? 
    (console.log("%s: %s", new Date().toLocaleTimeString(), logMessage))
    :
    (console.log("%s: %s, %s: %s", new Date().toLocaleTimeString(), logSettings.sourceFilename??'NA', logSettings.sourceFunction??'NA', logMessage)) 
    }
}
export const objLogSettings = {sourceFilename: '', sourceFunction: ''}

export const initLogSettings = (fileName='', functionName='') => {
  return {
    sourceFilename: fileName,
    sourceFunction: functionName
  }
}

