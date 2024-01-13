/** @format */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

let {
   LogThis,
   LoggerSettings,
   j,
   L0,
   L1,
   L2,
   L3,
} = require('../utils/Logger.js')

const srcFileName = 'surveysLib.js'

const buildOutputHeaders = (fields, calculatedfields, outputLayout) => {
   const log = new LoggerSettings(srcFileName, 'buildOutputHeaders')
   let isCalculated = false
   let outputFields = []
   for (let i = 0; i < outputLayout.length; i++) {
      //LogThis(log, `output header = ${i} of ${outputLayout.length}: `, L3)
      isCalculated = false
      layout = outputLayout[i]
      LogThis(
         log,
         `output header = ${i} of ${
            outputLayout.length
         }: layout=${JSON.stringify(layout)}`,
         L3,
      )
      let field = fields.find(
         field =>
            field.surveyId.surveyShortName.toLowerCase() ==
               layout.surveyShortName.toLowerCase() &&
            field.fieldName.toLowerCase() == layout.fieldName.toLowerCase(),
      )
      if (!field) {
         field = calculatedfields.find(
            field =>
               field.surveyId.surveyShortName.toLowerCase() ==
                  layout.surveyShortName.toLowerCase() &&
               field.fieldName.toLowerCase() == layout.fieldName.toLowerCase(),
         )
         isCalculated = true
      }
      if (!field) {
         throw new Error(
            `Error output layout field not found: ${JSON.stringify(layout)}`,
         )
      }

      outputFields = [
         ...outputFields,
         {
            fieldId: field._id,
            surveyShortName: field.surveyId.surveyShortName,
            description: isCalculated ? field.description : field.question,
            shortDescription: isCalculated
               ? field.shortDescription
               : field.questionShort,
            fieldName: field.fieldName,
            outputSequence: layout.sequence,
            valuePosition: isCalculated ? field.sequence : field.superSurveyCol,
            isCalculated: isCalculated,
            outputAsReal: layout.outputAsReal,
            field: field,
         },
      ]
   }
   LogThis(log, `outputFields=${JSON.stringify(outputFields)}`)
   return outputFields
}

/**
 * Get all the configs for all the superSurveys on the superSurveysList including Questions, Calculated Fields, Outpout layouts.
 *
 * @param {SurveySuperior} superSurveysList - List of surveys of type SurveySuperior from DB model.
 * @returns {SurveyConfigs} An array of SurveySuperiors including all Surveys, Questions, CalculatedFields and outpout layouts.
 */
const getSuperSurveysConfigs = async superSurveysList => {
   const log = new LoggerSettings(srcFileName, 'getSuperSurveysConfigs')

   let surveys = await Survey.find({
      superSurveyId: { $all: superSurveysList.map(survey => survey._id) },
   })
      .sort({ surveyMonkeyPosition: 1 })
      .lean()

   LogThis(log, `surveys=${j(surveys)}`, L3)

   let questions = await SurveyQuestion.find({
      surveyId: { $in: surveys.map(survey => survey._id) },
   })
      .sort({ superSurveyCol: 1 })
      .lean()

   LogThis(log, `questions=${j(questions)}`, L3)
   surveys.forEach(survey => {
      survey.questions = questions.filter(question => {
         return question.surveyId.toString() == survey._id.toString()
      })
      //LogThis(log, `Questions mapped to survey ${j(survey.questions)} `, L3);
   })

   //LogThis(log, `surveys.questionsAll=${j(surveys)}`, L3);

   superSurveysList.forEach(superSurvey => {
      superSurvey.surveys = surveys.filter(
         survey =>
            survey.superSurveyId.toString() == superSurvey._id.toString(),
      )
   })

   //LogThis(log, `All configs=${j(superSurveysList)}`, L3);
   return superSurveysList
}

const addResponseInfo = (row, response) => {
   row.push(response.id)
   row.push(response.collector_id)
   row.push(response.date_created)
   row.push(response.date_modified)
   row.push(response.ip_address)
   row.push(response.email_address)
   row.push(response.first_name)
   row.push(response.last_name)
   row.push(response.custom_value)
}

const addRepeatValues = (list, times, value) => {
   for (let i = 0; i < times; i++) {
      list.push(value)
   }
}

const addResponseInfoAll = (values, realValues, scores, response) => {
   addResponseInfo(values, response)
   addResponseInfo(realValues, response)
   addRepeatValues(scores, 9, '')
}

module.exports = {
   buildOutputHeaders,
   getSuperSurveysConfigs,
   addResponseInfo,
   addResponseInfoAll,
   addRepeatValues,
}
