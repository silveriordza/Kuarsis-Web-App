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
        
        async load(identifierValue){
            this.log.setFunctionName("load")
            this.filter = {}
            this.identifierValue = identifierValue

            this.filter[this.identifierFieldName]=identifierValue
            
            return await super.load(this.filter) 
        }

        async loadMatchList (matchListValues, matchField){
            this.log.setFunctionName("loadMatchList")
            this.log.HasDataMultipeEx("matchListValues, matchField", matchListValues, matchField)
            const matchValues = matchListValues.map(matchValue => matchValue[matchField])
            
            this.filter = {}
            this.identifierValues = matchValues
            this.filter[this.identifierFieldName]={$in: matchValues}
            return await super.load(this.filter)
        }

    }

module.exports = SurveyManager