const LogThis = (LogMessage) => {
  if(process.env.LOG_LEVEL>=1) {
    console.log(LogMessage)
  }
}

module.exports = LogThis
