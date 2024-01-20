/** @format */

const { j } = require('../utils/Logger')
const { saveDynamicModelToDB } = require('../utils/mongoDbHelper')
const { LogManager, L3 } = require('./LogManager')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class MongoDBManager {
   constructor(collection) {
      this.collection = mongoose.model(collection)
      this.log = new LogManager('MongoDBManager.js', 'constructor')
   }

   isDeletedEx(result, msg) {
      if (!result || !result.acknowledged) {
         throw new Error(msg)
      }
   }

   isDeletedCheck(result, msg) {
      this.log.setFunctionName('isDeletedCheck')
      if (!result || !result.acknowledged) {
         this.log.LogThis(msg, L3)
         return false
      }
   }

   async saveWithEx() {
      try {
         this.log.setFunctionName('saveWithEx')
         const savedDocument = await this.collection.save()
         this.log.HasDataException(
            savedDocument,
            `Couldn't save ${this.collection.modelName}`,
         )
         return savedDocument
      } catch (error) {
         throw new Error(
            `Couldn't save document ${this.collection.modelName}; ${j(
               this.collection,
            )}; ${j(this.log.logSettings)}; error=${error.message}`,
         )
      }
   }

   async deleteManyWithCheck(filterByField, identifiersList) {
      this.log.setFunctionName('deleteManyWithCheck')
      const filter = {}
      filter[filterByField] = { $in: identifiersList }

      const result = await this.collection.deleteMany(filter)
      this.isDeletedEx(
         result,
         `Error deleting documents from collection ${this.collection.modelName} matching by field ${filterByField} for the values list ${identifiersList}`,
      )
      return result
   }
   validateResultsSavedEx(collectionList, results) {
      if (collectionList.length != results.length) {
         throw new Error(
            `Not all values could be saved for collectionList: ${j(
               collecitonList,
            )}, results:${j(results)}`,
         )
      }
   }

   async insertMany(collectionList) {
      this.log.HasDataException(collectionList, `Collection List is empty`)

      const results = await this.collection.insertMany(collectionList)

      this.validateResultsSavedEx(collectionList, results)

      return results
   }

   useCollection(collection) {
      this.collection = collection
      return mongoose.model(model)
   }
   useCollectionByStringName(collection) {
      this.collection = mongoose.model(model)
   }

   async createDynamicCollectionFromFields(modelName, modelFields) {
      const collections = await mongoose.connection.db
         .listCollections({ name: modelName })
         .toArray()

      const collInfo = collections.find(
         collection => collection.name === modelName,
      )
      if (collInfo) {
         this.log.LogThis(`dropping modelName`, L3)
         let surveyOutputCollection = await mongoose.connection.collection(
            modelName,
         )

         await surveyOutputCollection.drop()

         this.log.LogThis(`dropped modelName`, L3)

         delete mongoose.models[modelName]
         this.log.LogThis(`deleted models`, L3)
      }

      let surveyOutputColumns = {}

      modelFields.forEach(column => {
         this.log.LogThis(
            `output Layout Field column=${JSON.stringify(column)}`,
            L3,
         )
         surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.String
      })

      const surveyOutputCollectionSchema = new Schema(surveyOutputColumns)

      const surveyOutputCollection = mongoose.model(
         modelName,
         surveyOutputCollectionSchema,
      )
      await saveDynamicModelToDB(modelName, surveyOutputColumns)
   }

   leanCollectionList(collectionList) {
      let leanList = collectionList.map(collection =>
         collection.toObject({ virtuals: true, getters: true }),
      )
      //leanList = j(leanList)
      return leanList
   }
   async findSortedAsc(filter) {
      //this.log.HasDataException(collectionList, `Collection List is empty`)
      this.log.setFunctionName('find')

      const results = await this.collection.find(filter).sort({ position: 1 })

      return results
   }
}

module.exports = MongoDBManager
