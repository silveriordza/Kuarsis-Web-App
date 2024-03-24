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
   MonkeyConfig,
   MonkeyNewResponse,
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

const {
   applyStringCriteriaToValue,
   formatDate,
} = require('../utils/Functions.js')

let { loadOneDynamicModelFromDB } = require('../utils/mongoDbHelper.js')

const srcFileName = 'surveysLib.js'

const CAL_CONCAT_GROUP_BASED_ON_CRITERIA = 'CAL_CONCAT_GROUP_BASED_ON_CRITERIA'
const CAL_SUM_THE_GROUP = 'CAL_SUM_THE_GROUP'
const CAL_CRITERIA_ON_OTHER_FIELD = 'CAL_CRITERIA_ON_OTHER_FIELD'

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
            outputSequence: layout.position,
            valuePosition: isCalculated ? field.position : field.superSurveyCol,
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
      .sort({ monkeyPosition: 1 })
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

const getsurveyElementKey = (
   surveyElement,
   keyList = ['surveyShortName', 'fieldName'],
) => {
   let questionKey = null

   if (keyList.length <= 0) {
      return null
   } else if (keyList === 1) {
      return surveyElement[keyList[0]]
   } else {
      for (let key in keyList) {
         if (surveyElement.hasOwnProperty(key)) {
            let keyValue = surveyElement[key]
            if (!questionKey) {
               questionKey = keyValue
            } else {
               questionKey = questionKey + `_${keyValue}`
            }
         } else {
            throw Error(
               'Property incorrect and not found in getSurveyElementKey into the surveyElement.',
            )
         }
      }
   }

   return questionKey
}

/**
 *
 */
const surveySaveOutputRedesignedHelper = async (
   superSurveyId,
   outputLayoutValues,
   isFromWebhook,
) => {
   const functionName = 'surveySaveOutputHelper'
   const log = new LoggerSettings(srcFileName, functionName)
   try {
      const columnsNames = outputLayoutValues
      const outputValues = outputLayoutValues

      // LogThis(
      //    log,
      //    `superSurveyId=${superSurveyId}; columnsNames=${JSON.stringify(
      //       outputLayoutValues,
      //       null,
      //       2,
      //    )}; outputValues=${JSON.stringify(outputValues)}`,
      //    L3,
      // )
      const surveySuperiors = await SurveySuperior.find({
         _id: superSurveyId,
      }).lean()
      let x = 1
      LogThis(
         log,
         `x=${x}; surveySuperiors=${JSON.stringify(surveySuperiors)}`,
         L3,
      )

      const surveyOutputCollectionName = `surveyOutputs_${surveySuperiors[0].superSurveyShortName}`

      let surveyOutputCollection = await loadOneDynamicModelFromDB(
         surveyOutputCollectionName,
      )

      const outputValueDocuments = []
      let dateTimeParts = []
      let dateValue = null
      let doc = {}
      outputValues.forEach(row => {
         //let doc = {}
         let column = row.fieldName
         let answer = null
         answer = row.outputAsReal
            ? row.processedAnswer?.realValue || ''
            : row.processedAnswer.isCalculatedField
            ? row.processedAnswer.calculatedValue
            : row.processedAnswer.weightedResponse

         //columnsNames.forEach((column, index) => {
         switch (column) {
            case 'INFO_3':
               if (isFromWebhook) {
                  doc[column] = formatDate(answer)
               } else {
                  dateTimeParts = answer.split(/[\s/:\-]/)
                  dateValue = new Date(
                     dateTimeParts[2], // Year
                     dateTimeParts[0] - 1, // Month
                     dateTimeParts[1], // Day
                     dateTimeParts[3], // Hours
                     dateTimeParts[4], // Minutes)
                  )
                  doc[column] = dateValue
               }
               break
            case 'INFO_4':
               if (isFromWebhook) {
                  doc[column] = formatDate(answer)
               } else {
                  dateTimeParts = answer.split(/[\s/:\-]/)
                  dateValue = new Date(
                     dateTimeParts[2], // Year
                     dateTimeParts[0] - 1, // Month
                     dateTimeParts[1], // Day
                     dateTimeParts[3], // Hours
                     dateTimeParts[4], // Minutes)
                  )
                  doc[column] = dateValue
               }
               break
            default:
               doc[column] = answer
         }
         // })
      })
      outputValueDocuments.push(doc)
      doc = {}
      //NEXT 111
      if (outputValueDocuments && outputValueDocuments.length > 0) {
         const respondentsFound = await surveyOutputCollection.find({
            INFO_1: {
               $in: outputValueDocuments.map(outputValue => {
                  LogThis(log, `respondent id = ${outputValue['INFO_1']}`, L0)
                  return outputValue['INFO_1']
               }),
            },
         })

         let outputNews = null
         if (respondentsFound && respondentsFound.length > 0) {
            const outputUpdates = outputValueDocuments.filter(doc =>
               respondentsFound.find(res => doc.INFO_1 === res.INFO_1),
            )
            outputUpdates[0].INFO_4 = formatDate(new Date())

            for (let r = 0; r < respondentsFound.length; r++) {
               let respondentFound = respondentsFound[r]
               let outputUpdate = outputUpdates.find(
                  update => update.INFO_1 === respondentFound.INFO_1,
               )

               Object.keys(outputUpdate).forEach(key => {
                  respondentFound[key] = outputUpdate[key]
               })
               LogThis(
                  log,
                  `updating respondents response ${j(respondentFound.INFO_1)}`,
                  L0,
               )
               await respondentFound.save()
               LogThis(log, `updated respondents DONE.`, L0)
            }

            // const outputCollectionUpdated =
            //    await surveyOutputCollection.updateMany(
            //       {
            //          INFO_1: {
            //             $in: outputUpdates.map(outputUpdate => {
            //                LogThis(
            //                   log,
            //                   `scolInfoIdList=${outputUpdate.INFO_1}`,
            //                   L0,
            //                )
            //                return outputUpdate.INFO_1
            //             }),
            //          },
            //       },
            //       { $set: outputUpdates },
            //    )

            outputNews = outputValueDocuments.filter(
               doc => !respondentsFound.find(res => doc.INFO_1 === res.INFO_1),
            )
         } else {
            outputNews = outputValueDocuments
         }
         LogThis(log, `inserting new respondents ${j(outputNews)}`, L3)
         await surveyOutputCollection.insertMany(outputNews)
         LogThis(log, `respondents inserted new DONE.`, L3)
      }

      // let outputUpdates = outputValueDocuments.filter(out => respondentsFoundout.INFO_1)

      // if(respondentsFound && respondentsFound.length > 0){
      //    for (let res =0; res < respondentsFound.length; res++){
      //       let respondentFound = respondentsFound[res]
      //       let outputFound = outputValueDocuments.find(outputDoc => outputDoc.INFO_1 === respondentFound.INFO_1)
      //    }
      // }

      // LogThis(
      //   log,
      //   `outputValueDocuments=${JSON.stringify(outputValueDocuments)}`
      // );

      //await surveyOutputCollection.insertMany(outputValueDocuments)
   } catch (error) {
      LogThis(log, `error ocurred: ${error.message}`, L3)
      throw error
   }
}

const processCalculatedFields = (
   survey,
   fieldsAnswersMap,
   subscaleToFieldsMap,
) => {
   const log = new LoggerSettings(srcFileName, 'getSuperSurveysConfigs')

   try {
      // for (let a = 0; a < allCalculatedFields.length; a++) {
      //    LogThis(
      //       log,
      //       `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a].fieldName}`,
      //       L3,
      //    )
      //let allCalculatedField = allCalculatedFields[a]
      for (const allCalculatedField of survey.calculatedFields) {
         let currentCalculatedField = null
         currentCalculatedField = fieldsAnswersMap.get(
            allCalculatedField.fieldName,
         )
         if (
            allCalculatedField.calculationType === CAL_CRITERIA_ON_OTHER_FIELD
         ) {
            let criteria = allCalculatedField.criteria
            LogThis(
               log,
               `Criteria in Question: criteria=${JSON.stringify(
                  criteria,
                  null,
                  2,
               )}`,
               L3,
            )

            // let fieldNameValue = allCalculatedFields.find(calField => {
            //    LogThis(log, `calField=${JSON.stringify(calField, null, 2)}`, L3)
            //    return calField.fieldName == criteria.fieldNameValue[0]
            // })
            let fieldNameValue = fieldsAnswersMap.get(
               criteria.fieldNameValue[0],
            )

            LogThis(
               log,
               `fieldNameValue1=${JSON.stringify(fieldNameValue, null, 2)}`,
               L3,
            )
            //let position = fieldNameValue.position
            // let calValue = calculatedValues.find(
            //    value => value.col == position && value.row == row,
            // )
            let calValue = {}
            if (fieldNameValue.isCalculatedField) {
               calValue.value = fieldNameValue.calculatedValue
            } else {
               calValue.value = fieldNameValue.weightedResponse
            }
            LogThis(
               log,
               `About to get into case > calValue=${JSON.stringify(
                  calValue,
                  null,
                  2,
               )}; criteria.operator=${JSON.stringify(
                  criteria.operator,
                  null,
                  2,
               )}`,
               L3,
            )
            switch (criteria.operator) {
               case '>':
                  LogThis(
                     log,
                     `Inside case: calValue.value=${calValue.value};criteria.value=${criteria.value};criteria.resultIfTrue=${criteria.resultIfTrue}`,
                     L3,
                  )
                  if (calValue.value > criteria.value) {
                     currentCalculatedField.calculatedValue =
                        criteria.resultIfTrue
                     LogThis(
                        log,
                        `Creteria is true: value=${currentCalculatedField.calculatedValue}`,
                        L3,
                     )
                  } else {
                     currentCalculatedField.calculatedValue =
                        criteria.resultIfFalse
                     LogThis(
                        log,
                        `Creteria is false: value=${currentCalculatedField.calculatedValue}`,
                        L3,
                     )
                  }
                  break
               default:
                  currentCalculatedField.calculatedValue = null
                  LogThis(
                     log,
                     `Case entered default: value${currentCalculatedField.calculatedValue}`,
                     L3,
                  )
            }
         } else if (allCalculatedField.calculationType === CAL_SUM_THE_GROUP) {
            // let groups = allCalculatedField.group
            // groups.map(group => {
            //    let newVal = parseInt(answers[group])
            //    if (
            //       typeof newVal != 'number' ||
            //       newVal == null ||
            //       isNaN(newVal)
            //    ) {
            //       newVal = 0
            //    }
            //    value = value + newVal
            // })
            let subScalesTotalSum = 0
            for (const subScale of allCalculatedField.subScales) {
               subScalesTotalSum =
                  subScalesTotalSum +
                  subscaleToFieldsMap
                     .get(subScale)
                     .reduce((sumTotal, currentFieldAnswer) => {
                        return sumTotal + currentFieldAnswer.weightedResponse
                     }, 0)
            }
            currentCalculatedField.calculatedValue = subScalesTotalSum
         } else if (
            allCalculatedField.calculationType ===
            CAL_CONCAT_GROUP_BASED_ON_CRITERIA
         ) {
            //let groups = allCalculatedField.group

            let value = ''
            let calculatedValue = ''
            for (const subScale of allCalculatedField.subScales) {
               let subScaleGroup = subscaleToFieldsMap.get(subScale)

               for (const subScaleFieldAnswer of subScaleGroup) {
                  if (subScaleFieldAnswer.isCalculatedField) {
                     value = subScaleFieldAnswer.calculatedValue
                  } else {
                     value = subScaleFieldAnswer.weightedResponse
                  }

                  if (
                     applyStringCriteriaToValue(
                        allCalculatedField.criteria,
                        value,
                     ) == 1
                  ) {
                     // LogThis(
                     //    log,
                     //    `groups=${groups}; group=${group}; calField=${allCalculatedField.fieldName};`,
                     //    L3,
                     // )
                     // let questionSelected = allSurveyQuestions.find(
                     //    q => q.superSurveyCol == group + 1,
                     // )
                     // LogThis(
                     //    log,
                     //    `groups=${groups}; group=${group + 1}; calField=${
                     //       allCalculatedField.fieldName
                     //    }; questionSelected.questionShort=${questionSelected.question.replace(
                     //       /,/g,
                     //       ';',
                     //    )}`,
                     //    L3,
                     // )
                     calculatedValue =
                        calculatedValue + subScaleFieldAnswer.realValue + '; '
                  }
               }
            }
            currentCalculatedField.calculatedValue = calculatedValue
         } else {
            LogThis(
               log,
               `Invalid calculated field calculation type = ${
                  allCalculatedField.calculationType
               } ${JSON.stringify(allCalculatedField)}`,
               L3,
            )
            throw new Error(
               `Invalid calculated field calculation type = ${JSON.stringify(
                  allCalculatedField,
               )}`,
            )
         }
         // LogThis(
         //    log,
         //    `Pushing value: calculatedFieldId=${
         //       allCalculatedFields[a]._id
         //    }; row=${row};col=${a + 1}; value=${value};`,
         //    L3,
         // )

         // calculatedValues.push({
         //    calculatedFieldId: allCalculatedFields[a]._id,
         //    respondentId: respondentId,
         //    row: row,
         //    col: a + 1,
         //    value: value,
         // })
         //csv = csv + value.toString() + ",";
         //}
      }
   } catch (error) {
      throw error
   }
}

module.exports = {
   buildOutputHeaders,
   getSuperSurveysConfigs,
   addResponseInfo,
   addResponseInfoAll,
   addRepeatValues,
   getsurveyElementKey,
   processCalculatedFields,
   surveySaveOutputRedesignedHelper,
}
