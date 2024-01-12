const { addPropertyValueInArray } = require("../utils/Functions")
const { LogManager, L0, L3} = require("./LogManager")
const MongoDBManager = require("./MongoDBManager")


class TemplateManager {
    constructor(templateList, collection, identiferFieldName, owner=''){
        this.log = new LogManager("TemplateManager.js", "constructor")
        this.log.LogThis(`START`, L3)
        this.mongoDBManager = new MongoDBManager(collection)
        this.templateList = templateList
        this.collection = collection
        this.identiferFieldName = identiferFieldName
        this.owner = owner
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
        this.identifiersList = this.templateList.map(template => (template[this.identiferFieldName]))
        return this.identifiersList
    }

    

    save = async () => {
        await this.deleteAllMatchingTemplates()

        this.templateStoredInDB = this.mongoDBManager.insertMany(this.templateList)
        return this.templateStoredInDB

    }
}

module.exports = TemplateManager