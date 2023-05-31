import { LOG_LEVEL } from '../constants/enviromentConstants'

export const LogThis = (LogMessage) => {
  if(LOG_LEVEL>=1) {
    console.log(LogMessage)
  }
}


