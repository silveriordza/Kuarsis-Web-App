const { addPropertyValueInArray } = require("../utils/Functions")
const { LogManager, L0, L3} = require("./LogManager")
const MongoDBManager = require("./MongoDBManager")

class TemplateManager {
    constructor(/*templateList,*/ collection, identiferFieldName){
        this.log = new LogManager("TemplateManager.js", "constructor")
        this.log.LogThis(`START`, L3)
        
        this.mongoDBManager = new MongoDBManager(collection)
        this.oneToManyLinkField = ''
        this.oneToManyLinkValue = ''
        this.templateList = null
        this.collection = collection
        this.identiferFieldName = identiferFieldName
        this.identifiersList = null
    }

    deleteAllMatchingTemplates = async () => {
                
        const log = this.log

        log.setFunctionName("deleteAllMatchingTemplates")

        const identifiersList = this.identifiersList

        log.HasData(identifiersList) || this.getIdentifiersList()

        log.HasDataMultipeEx("collectionToDeleteFrom,filterByField, this.identifiersList", this.collection, this.identiferFieldName, this.identifiersList)

        const result = this.mongoDBManager.deleteManyWithCheck(this.collection, this.identiferFieldName, this.identifiersList)
        return result
    }
     //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
     getIdentifiersList = () => {
        this.log.HasDataMultipeEx("templateList, identiferFieldName",
        this.templateList, this.identiferFieldName)

        this.identifiersList = this.templateList.map(template => (template[this.identiferFieldName]))
        return this.identifiersList
    }
    setOneToManyConstantLink(oneToManyLinkField, oneToManyLinkValue){
        this.oneToManyLinkField=oneToManyLinkField
        this.oneToManyLinkValue=oneToManyLinkValue
    }
    prepareOneToManyConstantTemplate = () => 
        {   this.log.HasDataMultipeEx(`templateList, ${this.oneToManyLinkField}`,
            this.templateList, this.oneToManyLinkValue)
            addPropertyValueInArray(this.templateList, this.oneToManyLinkField, this.oneToManyLinkValue)
        }

    async save () {
        this.log.HasDataMultipeEx("templateList, collection, identiferFieldName",
        this.templateList, this.collection, this.identiferFieldName)

        await this.deleteAllMatchingTemplates()

        this.templateStoredInDB = this.mongoDBManager.insertMany(this.templateList)
        return this.templateStoredInDB

    }
}

module.exports = TemplateManager