const {LogThis, HasDataException, j, LoggerSettings} = require("../utils/Logger");
const { LogManager } = require("./LogManager");


class MongoDBManager {
    constructor(log){
        this.logLocal = new LogManager("MongoDBManager.js", "constructor")
        this.log = log
    }

    isDeletedEx(data, msg){
        if (!data || !data.acknowledged) {
            throw new Error(
                msg,
            )
         }
    }

    isDeletedCheck(data, msg){
        this.logLocal.setFunctionName("isDeletedCheck")
        if (!data || !data.acknowledged) {
            this.logLocal.LogThis (msg, L3)
            return false
         }
    }

    async saveWithEx(mongoDocument){
        try{
            const savedDocument = await mongoDocument.save()
            this.log.HasDataException(savedDocument,`Couldn't save ${mongoDocument.modelName}`)
            return savedDocument
        } catch (error){
            throw new Error(`Couldn't save document ${mongoDocument.modelName}; ${j(mongoDocument)}; ${j(this.log.logSettings)}; error=${error.message}`)
        }
    }

    async deleteManyWithCheck (collectionToUse, fieldToMatch, valuesListToMatch){
        const log = this.log
        const filter = {}
        filter[fieldToMatch]={$in: listToMatch}
        const result = await collectionToUse.deleteMany(filter)
        isDeletedEx(result, `Error deleting documents from collection ${collectionToUse.modelName} matching by field ${fieldToMatch} for the values list ${valuesListToMatch}`)
        return result
    }
} 

module.exports = MongoDBManager