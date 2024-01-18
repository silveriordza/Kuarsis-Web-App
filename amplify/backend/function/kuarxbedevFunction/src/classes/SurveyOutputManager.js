/** @format */

const { LogManager, L3 } = require('./LogManager.js')

const SurveyManager = require('./SurveyManager.js')

const sourceFilename = 'SurveyOutputManager.js'

class SurveyOutputManager extends SurveyManager {
   constructor(collectionName, identifierFieldName) {
      super(collectionName, identifierFieldName)

      this.log = new LogManager(sourceFilename, 'constructor')
      this.log.LogThis(`START`, L3)
   }

   createDynamicTableFromTemplate = async () => {
      //Start Output Collection

      const surveyOutputCollectionName =
         `surveyOutputs_${this.superSurveyShortName}`.toLocaleLowerCase()
      return await this.mongoDBManager.createDynamicCollectionFromFields(
         surveyOutputCollectionName,
         this.templateList,
      )
   }

   async save(templateList, linkField, linkValue) {
      this.superSurveyShortName = linkValue[0].superSurveyShortName
      this.superSurveyId = linkValue[0]._id
      const collectionSaved = await super.save(
         templateList,
         linkField,
         this.superSurveyId,
      )
      const dynamicTableCreated = await this.createDynamicTableFromTemplate()
      return {
         results: {
            colectionSaved: collectionSaved,
            dynamicTableCreated: dynamicTableCreated,
         },
      }
   }
}

module.exports = SurveyOutputManager
