/** @format */

const TemplateManager = require('./TemplateManager')
let { SurveySuperiorOutputLayout } = require('../models/surveysModel.js')
const { LogManager, L3 } = require('./LogManager.js')
const { addPropertyValueInArray } = require('../utils/Functions.js')
const { saveDynamicModelToDB } = require('../utils/mongoDbHelper.js')

const identifierFieldName = 'fieldName'
const sourceFilename = 'SurveySuperiorOutputLayoutManager.js'

class SurveySuperiorOutputLayoutManager extends TemplateManager {
   constructor(templateList, surveySuperiorId, superSurveyShortName) {
      super(templateList, SurveySuperiorOutputLayout, identifierFieldName)

      this.log = new LogManager(sourceFilename, 'constructor')
      this.log.LogThis(`START`, L3)
      this.surveySuperiorId = surveySuperiorId
      this.superSurveyShortName = superSurveyShortName
      this.preProcessTemplate()
   }
   preProcessTemplate = () => {
      addPropertyValueInArray(
         this.templateList,
         'surveySuperiorId',
         this.surveySuperiorId,
      )
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

   async save() {
      const collectionSaved = await super.save()
      const dynamicTableCreated = await this.createDynamicTableFromTemplate()
      return {
         results: {
            colectionSaved: collectionSaved,
            dynamicTableCreated: dynamicTableCreated,
         },
      }
   }
}

module.exports = SurveySuperiorOutputLayoutManager
