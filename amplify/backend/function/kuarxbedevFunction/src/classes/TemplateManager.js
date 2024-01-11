const { LogManager, L0, L3} = require("./LogManager")
const MongoDBManager = require("./MongoDBManager")


class TemplateManager {
    constructor(templateList, collectionName, identiferFieldName, owner=''){
        this.log = new LogManager("TemplateManager.js", "constructor")
        this.log.LogThis(`START`, L3)
        this.mongoDBManager = new MongoDBManager()
        this.templateList = templateList
        this.collectionName = collectionName
        this.collection = this.mongoDBManager.getModelByName(collectionName)
        this.identiferFieldName = identiferFieldName
        this.owner = owner
        this.identifiersList = null
    }

    deleteAllMatchingTemplates = async () => {
                
        const identifiersList = this.identifiersList
        log.HasDataMultipeEx("collectionToDeleteFrom,filterByField, this.identifiersList", this.collectionName, this.identiferFieldName, this.identifiersList)

        log.HasDataException(identifiersList,`identifiersList is empty, please call getIdentifiersList first.`)
        const mongoDBManager = new MongoDBManager()
        const result = mongoDBManager.deleteManyWithCheck(this.collectionName, this.identiferFieldName, this.identifiersList)
        return result
    }
     //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
     getIdentifiersList = () => {
        this.identifiersList = this.templateList.map(template => (template[this.identiferFieldName]))
        return this.identifiersList
    }

    addOwnerToTemplate = () => 
    {
        const templateList = this.templateList

        templateList.forEach(template => {
            template.owner = this.owner
        });
    }

    save = async () => {
        await this.deleteAllMatchingTemplates()
        
        const result = this.mongoDBManager.save()
    }
}

module.exports = TemplateManager