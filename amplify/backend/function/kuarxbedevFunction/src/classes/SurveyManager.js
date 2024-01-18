const TemplateManager = require("./TemplateManager")
const { LogManager, L3} = require("./LogManager.js")

const sourceFilename = "SurveyManager.js"

class SurveyManager extends TemplateManager {
    constructor(collectionName, identifierFieldName){
        super(    
            //templateList,
            collectionName,
            identifierFieldName,
            //owner,
            )
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
        }
        async save(templateList, linkField, linkValue){
            this.log.setFunctionName("Save")
            this.log.LogThis(`START`, L3)
            this.setOneToManyConstantLink(linkField, linkValue)
            this.templateList=templateList
            this.prepareOneToManyConstantTemplate()
            return await super.save()
        }
    }

module.exports = SurveyManager