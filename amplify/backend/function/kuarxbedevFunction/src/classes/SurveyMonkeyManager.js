/** @format */

const axios = require('axios')

const { getSecretValue } = require('../awsServices/awsMiscellaneous.js')
let {
   SurveySuperior,
   Survey,
   SurveyQuestion,
   SurveyCalculatedField,
   SurveyCalculatedValue,
   //SurveyMulti,
   SurveySuperiorOutputLayout,
   SurveyResponse,
   SurveyMonkeyConfig,
   SurveyMonkeyNewResponse,
} = require('../models/surveysModel.js')
const {
   HasDataException,
   LoggerSettings,
   LogThis,
   j,
   HasData,
   L0,
   L1,
   L2,
   L3,
} = require('../utils/Logger.js')

class SurveyMonkeyManager {
   constructor() {
      this.sourceFile = 'SurveyMonkeyManager.js'
      this.token = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

      if (!this.token || this.token == '') {
         throw new Error(`Survey Monkey token not found.`)
      }
      this.configSurveyMonkey = {
         //responseType: "arraybuffer",
         headers: {
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
         },
      }
   }

   async getSurveyMonkeyConfigById(surveyMonkeyId) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeyConfigById',
      )

      HasDataException(surveyMonkeyId, `Id must not be empty`, log)

      const result = await SurveyMonkeyConfig.findOne({
         id: surveyMonkeyId,
      }).lean()
      return result
   }

   async getSurveyMonkeyConfigBySurveyName(name) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeyConfigBySurveyName',
      )

      HasDataException(name, `Name must not be empty`, log)

      const result = await SurveyMonkeyConfig.findOne({
         'survey.title': name,
      }).lean()
      return result
   }

   async getSurveyMonkeyConfigByIdorName(surveyMonkeyId, surveyName) {
      const log = new LoggerSettings(this.sourceFile, 'getSurveyMonkeyConfig')

      let surveyMonkeyConfigsResult = null

      if (!surveyMonkeyId || surveyMonkeyId === '') {
         surveyMonkeyConfigsResult =
            await this.getSurveyMonkeyConfigBySurveyName(surveyName)
      } else {
         surveyMonkeyConfigsResult = await this.getSurveyMonkeyConfigById(
            surveyMonkeyId,
         )
      }

      return surveyMonkeyConfigsResult
   }

   async getSurveyMonkeySurveysList() {
      const result = await axios.get(
         `https://api.surveymonkey.com/v3/surveys`,
         this.configSurveyMonkey,
      )
      const data = result.data.data
      LogThis(log, `data=${j(data)}`, L3)
      return data
   }

   async getSurveyMonkeySurveyDetails(surveyMonkeyId) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeySurveyDetailsById',
      )
      HasDataException(surveyMonkeyId, `surveyId must not be empty`, log)
      const result = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}`,
         this.configSurveyMonkey,
      )

      const data = result.data
      LogThis(log, `data=${j(data)}`, L3)
      return data
   }

   async getSurveyMonkeySurveyPages(surveyMonkeyId) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeySurveyDetailsById',
      )
      HasDataException(surveyMonkeyId, `surveyMonkeyId must not be empty`, log)
      const result = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages`,
         this.configSurveyMonkey,
      )

      const data = result.data.data
      LogThis(log, `data=${j(data)}`, L3)
      return data
   }

   async getSurveyMonkeyPageQuestions(surveyMonkeyId, pageId) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeyPageQuestions',
      )
      HasDataException(surveyMonkeyId, `surveyMonkeyId must not be empty`, log)
      const result = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${pageId}/questions`,
         this.configSurveyMonkey,
      )
      const data = result.data.data
      LogThis(log, `data=${j(data)}`, L3)
      return data
   }
   async getSurveyMonkeyQuestionDetails(surveyMonkeyId, pageId, questionId) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getSurveyMonkeySurveyDetailsById',
      )
      HasDataException(surveyMonkeyId, `surveyId must not be empty`, log)
      const result = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${pageId}/questions/${questionId}`,
         this.configSurveyMonkey,
      )
      const data = result.data
      LogThis(log, `data=${j(data)}`, L3)
      return data
   }
   async saveSurveyMonkeyConfig(surveyMonkeyInfo) {
      const surveyMonkeyId = surveyMonkeyInfo.survey.id
      const survey = surveyMonkeyInfo.survey

      const surveyMonkeyConfig = new SurveyMonkeyConfig({
         surveyMonkeyId: surveyMonkeyId,
         survey: survey,
      })

      await SurveyMonkeyConfig.deleteOne({ surveyMonkeyId: surveyMonkeyId })
      const surveyMonkeyConfigSaved = await surveyMonkeyConfig.save()

      if (!surveyMonkeyConfigSaved) {
         throw new Error('Error saving Survey Monkey Config into database.')
      } else {
         return surveyMonkeyConfigSaved
      }
   }

   /**
    * - Given a surveyShortName (that already exists in SurveySuperior collection) it check if the SurveySuperior has a surveyMonkeyId, otherwise it gets it from Survey Monkey matching by the Survey Name in Survey Superior then updates the SurveySuperior with the surveyMonkeyId and returns the SurveySuperior object already updated. It also updates the SurveySuperior with in the database.
    * @param {*} surveyShortName
    * @returns - SurveySuperior updated with surveyMonkeyId
    */
   async updateSurveyMonkeyIdFromShortName(surveyShortName) {
      let superSurvey = await SurveySuperior.findOne({
         surveyShortName: surveyShortName,
      })
      if (superSurvey) {
         throw new Error(`Super surveyShortName value was not found`)
      }

      if (superSurvey.surveyMonkeyId == '') {
         //Start getting survey monkey configs
         // const surveysResult = await axios.get(
         //    `https://api.surveymonkey.com/v3/surveys`,
         //    this.configSurveyMonkey,
         // )
         // const surveys = surveysResult.data.data
         const surveys = await this.getSurveyMonkeySurveysList()

         const surveyFound = surveys.find(
            survey => survey.title == superSurvey.surveyName,
         )
         if (!surveyFound) {
            throw new Error('Survey not found.')
         } else {
            superSurvey.surveyMonkeyId = surveyFound.id
            superSurvey = await superSurvey.save()
         }
      }
      return superSurvey
   }

   async getConfigsFromSurveyMonkeyAndUpdateKSSB(surveyMonkeyIdIn) {
      const log = new LoggerSettings(
         this.sourceFile,
         'getConfigsFromSurveyMonkeyAndUpdateKSSById',
      )

      const surveyInfo = await this.getSurveyMonkeySurveyDetails(
         surveyMonkeyIdIn,
      )
      HasDataException(
         surveyInfo,
         `Survey id was not found in Survey Monkey.`,
         log,
      )
      const surveyMonkeyInfo = { survey: {} }

      surveyMonkeyInfo.survey.title = surveyInfo.title
      surveyMonkeyInfo.survey.category = surveyInfo.category
      surveyMonkeyInfo.survey.question_count = surveyInfo.question_count
      surveyMonkeyInfo.survey.page_count = surveyInfo.page_count
      surveyMonkeyInfo.survey.date_created = surveyInfo.date_created
      surveyMonkeyInfo.survey.date_modified = surveyInfo.date_modified
      surveyMonkeyInfo.survey.id = surveyInfo.id

      const surveyMonkeyId = surveyInfo.id

      LogThis(log, `surveyMonkeyInfo=${j(surveyMonkeyInfo)}`, L3)
      const pages = await this.getSurveyMonkeySurveyPages(surveyMonkeyId)
      let page = null
      //LogThis(log, `pages=${j(pages)}`, L3)
      if (HasData(pages)) {
         for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            page = pages[pageIndex]
            //Start getting survey monkey configs
            // let questionsResult = await axios.get(
            //    `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions`,
            //    configSurveyMonkey,
            // )
            // let questions = questionsResult.data.data
            let questions = await this.getSurveyMonkeyPageQuestions(
               surveyMonkeyId,
               page.id,
            )

            LogThis(log, `questions=${j(questions)}`, L3)
            if (!HasData(questions)) {
               continue
            }

            page.questions = questions

            for (
               let questionIndex = 0;
               questionIndex < questions.length;
               questionIndex++
            ) {
               let question = page.questions[questionIndex]

               // let questionDetailsResult = await axios.get(
               //    `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions/${question.id}`,
               //    configSurveyMonkey,
               // )

               // let questionDetails = questionDetailsResult.data
               const questionDetails =
                  await this.getSurveyMonkeyQuestionDetails(
                     surveyMonkeyId,
                     page.id,
                     question.id,
                  )

               LogThis(log, `questionDetails=${j(questionDetails)}`, L3)
               if (!HasData(questionDetails)) {
                  continue
               }
               question.details = questionDetails
            }
         }
         surveyMonkeyInfo.survey.pages = pages
      }
      LogThis(
         log,
         `surveyMonkeyInfo=${JSON.stringify(surveyMonkeyInfo, null, 2)}`,
         L3,
      )
      const returnResult = await this.saveSurveyMonkeyConfig(surveyMonkeyInfo)
      return returnResult
   }
}

module.exports = SurveyMonkeyManager
