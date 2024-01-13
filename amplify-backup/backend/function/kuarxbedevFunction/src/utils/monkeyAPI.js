/**
 * @format
 * @prittier
 * */

const axios = require('axios')
let {
   LogThis,
   HasDataException,
   LoggerSettings,
   L0,
   L1,
   L2,
   L3,
   LogVars,
   LogThisFilter,
   LogVarsFilter,
   HasData,
   j,
} = require('../utils/Logger.js')

const srcFileName = 'monkeyAPI.js'

const getMonkeyResponses = async newResponses => {
   const log = new LoggerSettings(srcFileName, 'getMonkeyResponses')
   const monkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

   if (!monkeyToken || monkeyToken == '') {
      throw new Error(`Survey Monkey token not found.`)
   }

   const configMonkey = {
      //responseType: "arraybuffer",
      headers: {
         //"Content-Type": "multipart/form-data",
         Authorization: `Bearer ${monkeyToken}`,
         Accept: 'application/json',
      },
   }
   const monkeyResponses = []
   for (let r = 0; r < newResponses.length; r++) {
      let response = newResponses[r]

      let surveyResponseResult = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${response.monkeyId}/responses/${response.respondent_id}/details`,
         configMonkey,
      )
      let surveyResponse = surveyResponseResult.data
      monkeyResponses.push(surveyResponse)
   }
   return monkeyResponses
}

const ValidateMonkeyConfigs = (monkeyConfigs, log) => {
   HasDataException(monkeyConfigs, `Monkey configuration is null or empty`, log)
   HasDataException(
      monkeyConfigs.survey,
      `Monkey configuration does not have super survey`,
      log,
   )
   HasDataException(
      monkeyConfigs.survey.pages,
      `Monkey configuration super survey does not have any surveys or pages`,
      log,
   )
}

const PushBlankPage = (colsValue, colsReal, colsScore, monkeyPageConfig) => {
   const functionName = 'monkeyUpdateResponses'
   const log = new LoggerSettings(srcFileName, functionName)
   //LogThis(log, `Array filled with empties: ${Array(monkeyPageConfig.questions.length).fill("")}`, L0)

   colsValue = colsValue.concat(
      Array(monkeyPageConfig.questions.length).fill(''),
   )
   colsReal = colsReal.concat(Array(monkeyPageConfig.questions.length).fill(''))
   colsScore = colsScore.concat(
      Array(monkeyPageConfig.questions.length).fill(''),
   )

   LogThis(log, `colsValue page filled with empty: ${colsValue}`, L3)
   LogThis(log, `colsReal page filled with empty: ${colsReal}`, L3)
   LogThis(log, `colsScore page filled with empty: ${colsScore}`, L3)
   return {
      colsValue: colsValue,
      colsReal: colsReal,
      colsScore: colsScore,
   }
}

const AnalyzeQuestionResponse = (
   monkeyQuestionConf,
   monkeyResponseQuestion,
) => {
   const log = new LoggerSettings(srcFileName, 'AnalyzeQuestionResponse')
   let value = null
   let realValue = null
   let score = null
   const monkeyQuestionDetailsConf = monkeyQuestionConf.details
   const monkeyQuestionAnswersConf = monkeyQuestionDetailsConf.answers
   const monkeyResponseAnswers = monkeyResponseQuestion?.answers
   const colsValue = []
   const colsReal = []
   const colsScore = []
   const cols = {
      colsValue: colsValue,
      colsReal: colsReal,
      colsScore: colsScore,
   }

   const pushValueCol = (valueIn, realValueIn, scoreIn) => {
      colsValue.push(valueIn)
      colsReal.push(realValueIn.trim().replace(/\u00A0/g, ' '))
      colsScore.push(scoreIn)
   }
   const pushEmptyCol = () => {
      colsValue.push('')
      colsReal.push('')
      colsScore.push('')
   }

   /**
    *
    * @param {*} choice - This is the survey monkey confing choice that should have position text and score properties.
    * @param {*} outputScoreAsValue - Set this value as true to set the value as score for the rated subtypes
    */
   const pushChoiceCol = (choice, outputScoreAsValue = false) => {
      let value = choice.position
      let text = choice.text.trim()
      let score = null

      if (choice['quiz_options'] != undefined) {
         score = choice.quiz_options.score
      } else if (choice['weight'] != undefined) {
         score = choice.weight
      } else {
         throw new Error(
            `Score property not found in question for choice id: ${choice.id}`,
         )
      }

      if (outputScoreAsValue) {
         value = score
      }

      if (!text || text == '') {
         text = value.toString()
      }
      pushValueCol(value, text, score)
   }

   //Validate that the question config id matches with the response question id if not, abort

   // if (monkeyResponseQuestion == null || monkeyResponseQuestion == undefined) {
   //    pushEmptyCol()
   //    return cols
   // }

   // if (
   //    monkeyQuestionDetailsConf &&
   //    monkeyResponseQuestion &&
   //    monkeyQuestionDetailsConf.id != monkeyResponseQuestion.id
   // ) {
   //    throw new Error(
   //       `The response question id does not match question config id for question config id ${monkeyQuestionDetailsConf.id} response id ${monkeyResponseQuestion.id}`,
   //    )
   // }

   // let subtype = monkeyQuestionDetailsConf.subtype

   // if (subtype == 'vertical_three_col') {
   //    subtype = 'vertical'
   // }

   let questionType =
      monkeyQuestionDetailsConf.family + '_' + monkeyQuestionDetailsConf.subtype

   switch (questionType) {
      case 'open_ended_single':
         if (
            monkeyResponseQuestion &&
            monkeyResponseAnswers &&
            monkeyResponseAnswers.length > 0
         ) {
            value = monkeyResponseAnswers[0].text.trim()
            realValue = monkeyResponseAnswers[0].text.trim()
            score = ''
         } else {
            value = ''
            realValue = ''
            score = ''
         }
         pushValueCol(value, realValue, score)

         //LogVars(log, L0, "Final values=", "cols", cols)
         break
      case 'single_choice_menu':
         //throw new Error(`BREAKING EXECUTION`)
         //questionMonkeyPosition = questionItem.monkeyPosition;
         {
            const DEBUG_SECTION = 'DEBUG_SINGLE_MENU'
            //process.env.LOG_LEVEL = 'DEBUG_SINGLE_MENU'
            const msg = 'single_choice_menu'
            const monkeyResponseAnswer = monkeyResponseAnswers[0]
            if (monkeyResponseAnswer['choice_id']) {
               const monkeyAnswerChoiceConf =
                  monkeyQuestionAnswersConf.choices.find(
                     confChoice =>
                        confChoice.id == monkeyResponseAnswer.choice_id,
                  )
               HasDataException(
                  monkeyAnswerChoiceConf,
                  `Choice in monkey response not found in survey config ${monkeyResponseAnswer.choice_id}`,
                  log,
               )
               //when choice is selected, the value, real and score are in the selected choice found in survey config.

               pushChoiceCol(monkeyAnswerChoiceConf)

               //When choice is selected, other values are empty in the output file.
               if (
                  monkeyQuestionAnswersConf['other'] != undefined &&
                  monkeyResponseAnswer['other_id'] == undefined
               ) {
                  pushEmptyCol()
               }

               LogVars(
                  log,
                  msg,
                  L3,
                  'monkeyAnswerChoiceConf',
                  monkeyAnswerChoiceConf,
               )
            } else if (monkeyResponseAnswer['other_id'] != undefined) {
               const monkeyAnswerChoiceConf =
                  monkeyQuestionAnswersConf.other.find(
                     otherConf => otherConf.id == monkeyResponseAnswer.other_id,
                  )

               HasDataException(
                  monkeyAnswerChoiceConf,
                  `Other choice in monkey response not found in survey config ${monkeyResponseAnswer.other_id}`,
                  log,
               )

               pushChoiceCol(monkeyAnswerChoiceConf)
               pushValueCol(
                  monkeyResponseAnswer.text,
                  monkeyResponseAnswer.text,
                  '',
               )
            } else {
               throw Error(
                  `Invalid choice in survey monkey response for question details=${j(
                     monkeyQuestionDetailsConf,
                  )}`,
               )
            }
         }
         break
      case 'single_choice_vertical':
      case 'single_choice_vertical_three_col':
         {
            const monkeyResponseAnswer = monkeyResponseAnswers[0]
            if (monkeyResponseAnswer['choice_id']) {
               const monkeyAnswerChoiceConf =
                  monkeyQuestionAnswersConf.choices.find(
                     confChoice =>
                        confChoice.id == monkeyResponseAnswer.choice_id,
                  )
               HasDataException(
                  monkeyAnswerChoiceConf,
                  `Choice in monkey response not found in survey config ${monkeyResponseAnswer.choice_id}`,
                  log,
               )
               //when choice is selected, the value, real and score are in the selected choice found in survey config.
               pushChoiceCol(monkeyAnswerChoiceConf)
               //When choice is selected, other values are empty in the output file.

               if (
                  monkeyQuestionAnswersConf['other'] != undefined &&
                  monkeyResponseAnswer['other_id'] == undefined
               ) {
                  pushEmptyCol()
               }
            } else if (monkeyResponseAnswer['other_id'] != undefined) {
               const monkeyAnswerChoiceConf =
                  monkeyQuestionAnswersConf.other.find(
                     otherConf => otherConf.id == monkeyResponseAnswer.other_id,
                  )

               HasDataException(
                  monkeyAnswerChoiceConf,
                  `Other choice in monkey response not found in survey config ${monkeyResponseAnswer.other_id}`,
                  log,
               )

               pushChoiceCol(monkeyAnswerChoiceConf)
               pushValueCol(
                  monkeyResponseAnswer.text,
                  monkeyResponseAnswer.text,
                  '',
               )
            } else {
               throw Error(
                  `Invalid choice in survey monkey response for question details=${j(
                     monkeyQuestionDetailsConf,
                  )}`,
               )
            }
         }
         break
      case 'matrix_rating': //for updating responses from survey monkey
         {
            for (
               let rowIndex = 0;
               rowIndex < monkeyQuestionAnswersConf.rows.length;
               rowIndex++
            ) {
               let monkeyRowConf = monkeyQuestionAnswersConf.rows[rowIndex]
               LogThis(log, `monkeyRowConf = ${j(monkeyRowConf)}`)
               //for(let monkeyResponseIndex=0; monkeyResponseIndex<monkeyResponseAnswers.length ; monkeyResponseIndex++){
               let monkeyResponseAnswer = monkeyResponseAnswers.find(
                  monkeyResponse => monkeyResponse.row_id == monkeyRowConf.id,
               )

               // HasDataException(
               //    monkeyResponseAnswer,
               //    `The monkey answer row was not found in the answers responses for ${j(
               //       monkeyRowConf,
               //    )}`,
               //    log,
               // )
               if (HasData(monkeyResponseAnswer)) {
                  if (monkeyResponseAnswer['choice_id']) {
                     const monkeyAnswerChoiceConf =
                        monkeyQuestionAnswersConf.choices.find(
                           confChoice =>
                              confChoice.id == monkeyResponseAnswer.choice_id,
                        )
                     HasDataException(
                        monkeyAnswerChoiceConf,
                        `Choice in monkey response not found in survey config ${j(
                           monkeyResponseAnswer.choice_id,
                        )}`,
                        log,
                     )
                     //when choice is selected, the value, real and score are in the selected choice found in survey config.
                     pushChoiceCol(monkeyAnswerChoiceConf, true)
                     //When choice is selected, other values are empty in the output file.
                  } else {
                     // throw Error(
                     //    `The choice_id value was not found in the answer as expected: ${j(
                     //       monkeyResponseAnswer,
                     //    )}`,
                     // )
                     pushEmptyCol()
                  }
               } else {
                  pushEmptyCol()
               }
            }
         }
         break
      case 'open_ended_numerical': //for updating responses from survey monkey
         {
            for (
               let rowIndex = 0;
               rowIndex < monkeyQuestionAnswersConf.rows.length;
               rowIndex++
            ) {
               let monkeyRowConf = monkeyQuestionAnswersConf.rows[rowIndex]

               //for(let monkeyResponseIndex=0; monkeyResponseIndex<monkeyResponseAnswers.length ; monkeyResponseIndex++){
               let monkeyResponseAnswer = monkeyResponseAnswers.find(
                  monkeyResponse => monkeyResponse.row_id == monkeyRowConf.id,
               )

               // HasDataException(
               //    monkeyResponseAnswer,
               //    `The monkey answer row was not found in the answers responses for ${monkeyRowConf}`,
               //    log,
               // )
               if (HasData(monkeyResponseAnswer)) {
                  let text = monkeyResponseAnswer.text
                  let value = Number.parseInt(text)

                  //when choice is selected, the value, real and score are in the selected choice found in survey config.
                  pushValueCol(value, text, value)
               } else {
                  pushEmptyCol()
               }
            }
         }
         break
      case 'multiple_choice_vertical_three_col':
      case 'multiple_choice_vertical': //for updating responses from survey monkey
         {
            for (
               let choiceIndex = 0;
               choiceIndex < monkeyQuestionAnswersConf.choices.length;
               choiceIndex++
            ) {
               let monkeyChoiceConf =
                  monkeyQuestionAnswersConf.choices[choiceIndex]

               //for(let monkeyResponseIndex=0; monkeyResponseIndex<monkeyResponseAnswers.length ; monkeyResponseIndex++){
               let monkeyResponseAnswer = monkeyResponseAnswers?.find(
                  monkeyResponse =>
                     monkeyResponse.choice_id == monkeyChoiceConf.id,
               )

               // HasDataException(
               //    monkeyResponseAnswer,
               //    `The monkey answer row was not found in the answers responses for ${monkeyChoiceConf}`,
               //    log,
               // )
               if (HasData(monkeyResponseAnswer)) {
                  if (monkeyResponseAnswer['choice_id'] != undefined) {
                     //when choice is selected, the value, real and score are in the selected choice found in survey config.
                     pushChoiceCol(monkeyChoiceConf)
                  } else {
                     throw Error(
                        `The choice_id value was not found in the answer as expected: ${j(
                           monkeyResponseAnswer,
                        )}`,
                     )
                  }
               } else {
                  //For multiple choice vertical option, if the choice was not selected in the answers, then push en empty column.
                  pushEmptyCol()
               }
            }
         }
         break
      //   {
      //     if (surveyQuestion.fieldName == "ESTRES_4") {
      //       LogThis(
      //         log,
      //         `ESTRES_4 multiple choice value inputs=${j({
      //           surveyQuestion: surveyQuestion,
      //           monkeyAnswer: monkeyAnswer,
      //         })}; `,
      //         L0
      //       );
      //     }
      //     let surveyChoice =
      //       surveyQuestion.monkeyAnswers.answerChoices.find((choice) => {
      //         if (surveyQuestion.fieldName == "ESTRES_5") {
      //           LogThis(
      //             log,
      //             `finding choice values =${j({
      //               choice: choice,
      //               choiceId: choice.id.toString().trim(),
      //               monkeyAnswer: monkeyAnswer.toString().trim(),
      //               condition:
      //                 choice.id.toString().trim() ==
      //                 monkeyAnswer.toString().trim(),
      //             })}`,
      //             L0
      //           );
      //         }
      //         return (
      //           choice.id.toString().trim() == monkeyAnswer.toString().trim()
      //         );
      //       });
      //     if (surveyQuestion.fieldName == "ESTRES_5") {
      //       LogThis(
      //         log,
      //         `found surveyChoice = ${j({
      //           surveyChoice: surveyChoice,
      //           negatedSurveyChoice: !surveyChoice,
      //         })}`,
      //         L0
      //       );
      //     }
      //     if (!surveyChoice) {
      //       LogThis(
      //         log,
      //         `Log Choice not found for ${monkeyAnswer} surveyChoice=${j(
      //           surveyChoice
      //         )}; question field: ${surveyQuestion.fieldName}`,
      //         L0
      //       );
      //       throw new Error(`Error Choice not found for ${monkeyAnswer}`);
      //     }
      //     value = surveyChoice.value; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
      //     realValue = surveyChoice.realValue.trim(); //Triming because Survey Monkey sometimes introduces a non-breaking space character that is an invisible character that looks like a space but is not really a space (ASCII code 32) but an NBSP (ASCII code 160), which causes problems when copying the data into an Excel spreadsheet or CSV files.
      //     score = surveyChoice.score;
      //     if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //       LogThis(
      //         log,
      //         ` BECK_Nomesientoespecialme multiple_choice_vertical: finalValues=${j(
      //           {
      //             monkeyAnswer: monkeyAnswer,
      //             value: value,
      //             realValue: realValue,
      //             score: score,
      //             surveyChoice: surveyChoice,
      //             surveyQuestion: surveyQuestion,
      //           }
      //         )}`,
      //         L3
      //       );
      //     }
      //   }
      //   break;
      default:
         throw new Error(
            `Family:${monkeyQuestionDetailsConf.family} and subType=${monkeyQuestionDetailsConf.subtype} combination is not valid.`,
         )
   }
   LogThis(log, `cols=${j(cols)}`, L3)
   return cols
   // } else {
   //   value = ""; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
   //   realValue = "";
   //   score = "";
   //   if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
   //     LogThis(
   //       log,
   //       ` BECK_Nomesientoespecialme else happened: finalValues=${j({
   //         value: value,
   //         realValue: realValue,
   //         score: score,
   //       })}`,
   //       L3
   //     );
   //   }
   // }
}

module.exports = {
   getMonkeyResponses,
   ValidateMonkeyConfigs,
   AnalyzeQuestionResponse,
   PushBlankPage,
}
