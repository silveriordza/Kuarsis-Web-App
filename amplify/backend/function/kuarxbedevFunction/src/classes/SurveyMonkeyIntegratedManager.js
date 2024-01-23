
const { LogManager, L3} = require("./LogManager.js")
const MongoDBManager = require("./MongoDBManager.js")
const TemplateManager = require("./TemplateManager.js")

const sourceFilename = "SurveyMonkeyIntegratedManager.js"
const collectionName = "SurveyMonkeyIntegrated"

class SurveyMonkeyIntegratedManager extends TemplateManager {
    constructor(superSurveyConfig, monkeyConfig){
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.mongoDBManager = new MongoDBManager(collectionName)
            this.superSurveyConfig = superSurveyConfig[0]
            this.monkeyConfig = monkeyConfig
        }

        


    
    
    }

    

module.exports = SurveyMonkeyIntegratedManager