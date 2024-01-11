const { LogManager } = require("./LogManager");
const mongoose = require('mongoose');

class MongoDBManager {
    constructor(){
        this.log = new LogManager("MongoDBManager.js", "constructor")
    }

    isDeletedEx(result, msg){
        if (!result || !result.acknowledged) {
            throw new Error(
                msg,
            )
         }
    }

    isDeletedCheck(result, msg){
        this.log.setFunctionName("isDeletedCheck")
        if (!result || !result.acknowledged) {
            this.log.LogThis (msg, L3)
            return false
         }
    }

    async saveWithEx(documentToSave){
        try{
            const savedDocument = await documentToSave.save()
            this.log.HasDataException(savedDocument,`Couldn't save ${documentToSave.modelName}`)
            return savedDocument
        } catch (error){
            throw new Error(`Couldn't save document ${documentToSave.modelName}; ${j(documentToSave)}; ${j(this.log.logSettings)}; error=${error.message}`)
        }
    }

    async deleteManyWithCheck (collectionToDeleteFrom, filterByField, identifiersList){
        const filter = {}
        filter[filterByField]={$in: identifiersList}
        
        const result = await collectionToDeleteFrom.deleteMany(filter)
        isDeletedEx(result, `Error deleting documents from collection ${collectionToDeleteFrom.modelName} matching by field ${filterByField} for the values list ${identifiersList}`)
        return result
    }

    getModelByName = (modelName) => {
        return mongoose.model(modelName)
    }
} 

module.exports = MongoDBManager