const { LogManager, L0, L3} = require("./LogManager")
const MongoDBManager = require("./MongoDBManager")


const srcFileName = "TemplateManager.js"
class TemplateManager {
    constructor(template, ownerId=''){
        this.log = new LogManager(srcFileName, "constructor")
        this.log.LogThis(`START`, L3)
        this.template = template
        this.owner = ownerId
        this.namesList = null
    }

    deleteAllExistentTemplates = async (collectionName, fieldName) => {
        const log = this.log
        
        const namesList = this.namesList
        log.HasDataException(this.namesList,`namesList is empty, please call getSurveyShortNamesList from child template first`)
        const mongoDBManager = new MongoDBManager()
        const result = mongoDBManager.deleteManyWithCheck(collectionName, fieldName, namesList)
        return result
    }
}

module.exports = TemplateManager