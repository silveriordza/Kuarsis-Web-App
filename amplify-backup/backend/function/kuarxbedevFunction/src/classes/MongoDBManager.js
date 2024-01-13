const { HasDataException } = require("../utils/Logger");
const { LogManager } = require("./LogManager");
const mongoose = require('mongoose');

class MongoDBManager {
    constructor(collection){
        this.collection = collection
        this.log = new LogManager("MongoDBManager.js", "constructor")

        
    }

    isDeletedEx (result, msg) {
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

    async saveWithEx(){
        try{
            this.log.setFunctionName("saveWithEx")
            const savedDocument = await this.collection.save()
            this.log.HasDataException(savedDocument,`Couldn't save ${this.collection.modelName}`)
            return savedDocument
        } catch (error){
            throw new Error(`Couldn't save document ${this.collection.modelName}; ${j(this.collection)}; ${j(this.log.logSettings)}; error=${error.message}`)
        }
    }

      deleteManyWithCheck = async (filterByField, identifiersList) => {
        this.log.setFunctionName("deleteManyWithCheck")
        const filter = {}
        filter[filterByField]={$in: identifiersList}
        
        const result = await this.collection.deleteMany(filter)
        this.isDeletedEx(result, `Error deleting documents from collection ${this.collection.modelName} matching by field ${filterByField} for the values list ${identifiersList}`)
        return result
    }
    validateResultsSavedEx (collectionList, results) {
        if(collectionList.length != results.length){
           throw new Error(`Not all values could be saved for collectionList: ${j(collecitonList)}, results:${j(results)}`)
        }
     }

    async insertMany (collectionList) {
        this.log.HasDataException(collectionList, `Collection List is empty`)

        const results = await this.collection.insertMany(collectionList)

        this.validateResultsSavedEx(collectionList, results)
        
        return results
    }

    useCollection = (collection) => {
        this.collection = collection
        return mongoose.model(model)
    }
    useCollectionByStringName = (collection) => {
        this.collection = mongoose.model(model)
    }
} 

module.exports = MongoDBManager