/** @format */

import {
   SURVEY_PROCESS_ANSWERS_REQUEST,
   SURVEY_PROCESS_ANSWERS_SUCCESS,
   SURVEY_PROCESS_ANSWERS_FAIL,
   SURVEY_PROCESS_ANSWERS_STATUS,
   SURVEY_DETAILS_REQUEST,
   SURVEY_DETAILS_SUCCESS,
   SURVEY_DETAILS_FAIL,
   SURVEY_DETAILS_RESET,
   SURVEY_OUTPUTS_REQUEST,
   SURVEY_OUTPUTS_SUCCESS,
   SURVEY_OUTPUTS_FAIL,
   SURVEY_OUTPUTS_RESET,
} from '../constants/surveyConstants'

import { KUARSIS_DB_SURVEY_ANSWERS_BATCH_SIZE } from '../constants/enviromentConstants'
//import { SURVEY_MONKEY_TOKEN } from "../constants/secretConstants";

import {
   zipFile,
   unzipFile,
   unzipStringBase64,
   applyStringCriteriaToValue,
} from '../libs/Functions'

import { LogThis, LoggerSettings, L0, L1, L2, L3, OFF } from '../libs/Logger'

import { rowCleaner2 } from '../libs/csvProcessingLib'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import axios from 'axios'
const srcFileName = 'surveyActions.js'

const WEIGHTED_PAIRS = 'WEIGHTED_PAIRS'
const WEIGHTED_CRITERIA = 'WEIGHTED_CRITERIA'

const CAL_CONCAT_GROUP_BASED_ON_CRITERIA = 'CAL_CONCAT_GROUP_BASED_ON_CRITERIA'
const CAL_SUM_THE_GROUP = 'CAL_SUM_THE_GROUP'
const CAL_CRITERIA_ON_OTHER_FIELD = 'CAL_CRITERIA_ON_OTHER_FIELD'

export const surveyProcessAnswersAction =
   survey => async (dispatch, getState) => {
      try {
         const log = new LoggerSettings(srcFileName, 'surveyProcessAnswers')

         dispatch({
            type: SURVEY_PROCESS_ANSWERS_REQUEST,
         })

         const fileNumeric = survey.fileNumeric
         const fileReal = survey.fileReal
         const surveySuperiorId = survey.surveySuperiorId

         if (fileNumeric && fileReal) {
            const zippedFileNumeric = await zipFile(
               'fileNumeric.csv',
               fileNumeric,
            )

            const zippedFileReal = await zipFile('fileReal.csv', fileReal)

            const formData = new FormData()

            formData.append('fileNumeric', zippedFileNumeric)
            formData.append('fileReal', zippedFileReal)

            const {
               userLogin: { userInfo },
            } = getState()

            LogThis(log, 'ABOUT TO CALL AXIOS')
            const config = {
               //responseType: "arraybuffer",
               headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${userInfo.token}`,
                  Accept: 'application/zip',
               },
            }

            const { data } = await axios.put(
               BACKEND_ENDPOINT + `/surveys/${surveySuperiorId}`,
               formData,
               config,
            )
            //LogThis(log, `data=${data}`);
            //const data2 = Buffer.from(data, "base64").toString("binary");
            //const arrayBuffer = new Uint8Array(data2).buffer;
            // const blob = new Blob([data2], {
            //   type: "application/octet-stream",
            // });

            // LogThis(log, `About to log data arraybuffer as Text`);
            // const text = new TextDecoder().decode(data2);
            //LogThis(log, `data=${data2}`);

            const unzippedText = await unzipStringBase64(
               data,
               'OutputReport.csv',
            )
            // LogThis(log, `unzippedText=${JSON.stringify(data)}`);
            LogThis(
               log,
               `unzippedText=${JSON.stringify(unzippedText, null, 2)}`,
            )
            dispatch({
               type: SURVEY_PROCESS_ANSWERS_SUCCESS,
               payload: {
                  csvLayout: unzippedText,
                  surveySuccessMessage: 'Procesamiento finalizado.',
               },
            })
         } else {
            throw Error('Survey response files were not provided as expected.')
         }
      } catch (error) {
         dispatch({
            type: SURVEY_PROCESS_ANSWERS_FAIL,
            payload:
               error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
         })
      }
   }

export const testsAction = survey => async (dispatch, getState) => {
   try {
      const log = new LoggerSettings(srcFileName, 'testsAction')
      dispatch({
         type: SURVEY_PROCESS_ANSWERS_REQUEST,
      })

      const {
         userLogin: { userInfo },
      } = getState()

      LogThis(log, 'ABOUT TO CALL AXIOS')
      const config = {
         //responseType: "arraybuffer",
         headers: {
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
            Accept: 'application/octet-stream',
         },
      }

      const { data } = await axios.put(
         BACKEND_ENDPOINT + `/surveys/tests`,
         config,
      )
      const unzippedText = data
      dispatch({
         type: SURVEY_PROCESS_ANSWERS_SUCCESS,
         payload: {
            csvLayout: unzippedText,
            surveySuccessMessage: 'Procesamiento finalizado.',
         },
      })
   } catch (error) {
      dispatch({
         type: SURVEY_PROCESS_ANSWERS_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      })
   }
}

export const processAnswersFromSurveyMonkey =
   survey => async (dispatch, getState) => {
      const log = new LoggerSettings(
         srcFileName,
         'processAnswersFromSurveyMonkey',
      )
      try {
         dispatch({
            type: SURVEY_PROCESS_ANSWERS_REQUEST,
         })

         const surveySuperiorId = survey.surveyInfo.surveySuperiorId
         const surveyShortName = survey.surveyInfo.surveyShortName
         const updateType = survey.updateType
         LogThis(log, `START`, L3)
         const {
            userLogin: { userInfo },
         } = getState()

         if (!userInfo) {
            throw new Error(
               `User is not logged in or login information missing.`,
            )
         }

         const config = {
            //responseType: "arraybuffer",
            headers: {
               //"Content-Type": "multipart/form-data",
               Authorization: `Bearer ${userInfo.token}`,
               //Accept: "application/zip",
            },
         }

         //Getting Survey Monkey Token
         const surveyMonkeyTokenResult = await axios.get(
            BACKEND_ENDPOINT + `/configs/surveymonkey`,
            config,
         )
         // LogThis(
         //   log,
         //   `monkeyTokResult=${JSON.stringify(surveyMonkeyTokenResult)}`,
         //   L3
         // );
         const surveyMonkeyToken = surveyMonkeyTokenResult.data
         // LogThis(
         //   log,
         //   `surveyMonkeyToken=${JSON.stringify(surveyMonkeyToken)}`,
         //   L3
         // );
         const { data } = await axios.get(
            BACKEND_ENDPOINT + `/surveys/${surveyShortName}/respondentidsinfo`,
            config,
         )
         const existentRespondentIdsInfo = data.respondentIdsInfo

         LogThis(
            log,
            `existentRespondentIdsInfo=${JSON.stringify(
               existentRespondentIdsInfo,
               null,
               2,
            )}`,
            L3,
         )

         dispatch({
            type: SURVEY_PROCESS_ANSWERS_STATUS,
            payload: {
               message: 'Información de respuestas existentes obtenida.',
               row: 0,
            },
         })
         await new Promise(resolve => setTimeout(resolve, 1))

         const configSurveyMonkey = {
            //responseType: "arraybuffer",
            headers: {
               //"Content-Type": "multipart/form-data",
               Authorization: `Bearer ${surveyMonkeyToken}`,
               Accept: 'application/json',
            },
         }

         const existentRespondentIdsTotal = existentRespondentIdsInfo.length
         const pageSize = 200
         const page = Math.ceil(existentRespondentIdsTotal / pageSize)
         LogThis(log, `page is: ${page}`, L3)
         let respondentIdsMonkeyApi = await axios.get(
            `https://api.surveymonkey.com/v3/surveys/182423261/responses?per_page=${pageSize}&page=${page}`,
            configSurveyMonkey,
         )
         const surveyMonkeyRespondentIds = respondentIdsMonkeyApi.data

         LogThis(
            log,
            `surveyMonkeyRespondentIds.total=${
               surveyMonkeyRespondentIds.total
            }; surveyMonkeyRespondentIds=${JSON.stringify(
               surveyMonkeyRespondentIds,
               null,
               2,
            )}`,
            L3,
         )
         const newRespondentIds = []
         const respondentIdsMonkeyData = surveyMonkeyRespondentIds.data
         const lastExistentRespondentId =
            existentRespondentIdsInfo[0].SCOLINFO_respondent_id
         LogThis(
            log,
            `lastExistentRespondentId=${lastExistentRespondentId}`,
            L3,
         )
         for (let i = respondentIdsMonkeyData.length - 1; i >= 0; i--) {
            let monkeyRespondent = respondentIdsMonkeyData[i]
            LogThis(
               log,
               `monkeyRespondent=${JSON.stringify(monkeyRespondent)}`,
               L3,
            )
            LogThis(
               log,
               `existentRespondent=${
                  monkeyRespondent.id
               }; lastMonkeyRespondent=${lastExistentRespondentId}; condition=${
                  monkeyRespondent.id != lastExistentRespondentId
               }`,
               L3,
            )
            if (monkeyRespondent.id != lastExistentRespondentId) {
               newRespondentIds.push(monkeyRespondent.id)
            } else {
               break
            }
         }

         LogThis(
            log,
            `newRespondentIds=${JSON.stringify(newRespondentIds, null, 2)}`,
            L3,
         )
         // const superSurveyMonkey = await axios.get(
         //   `https://api.surveymonkey.com/v3/surveys/182423261/responses?per_page=${pageSize}&page=${page}`,
         //   configSurveyMonkey
         // );

         dispatch({
            type: SURVEY_PROCESS_ANSWERS_SUCCESS,
            payload: {
               csvLayout: JSON.stringify(surveyMonkeyRespondentIds),
               surveySuccessMessage: newRespondentIds.length
                  ? `Procesamiento finalizado. Encuestas procesadas: ${newRespondentIds.length}`
                  : `Procesamiento finalizado. Los archivos no contienen respuestas nuevas. Encuestas procesadas: ${newRespondentIds.length}`,
            },
         })
      } catch (error) {
         dispatch({
            type: SURVEY_PROCESS_ANSWERS_FAIL,
            payload:
               error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
         })
      }
   }

export const surveyProcessAnswersAtClientAction =
   survey => async (dispatch, getState) => {
      try {
         const log = new LoggerSettings(
            srcFileName,
            'surveyProcessAnswersAtClientAction',
         )

         dispatch({
            type: SURVEY_PROCESS_ANSWERS_REQUEST,
         })

         await new Promise(resolve => setTimeout(resolve, 1))
         dispatch({
            type: SURVEY_PROCESS_ANSWERS_STATUS,
            payload: {
               message: 'Procesamiento de encuestas iniciado.',
               row: 0,
            },
         })
         await new Promise(resolve => setTimeout(resolve, 1))

         const {
            userLogin: { userInfo },
         } = getState()

         if (!userInfo) {
            throw new Error(
               `User is not logged in or login information missing.`,
            )
         }

         const config = {
            //responseType: "arraybuffer",
            headers: {
               //"Content-Type": "multipart/form-data",
               Authorization: `Bearer ${userInfo.token}`,
               //Accept: "application/zip",
            },
         }

         const fileNumeric = survey.fileNumeric
         const fileReal = survey.fileReal

         const surveySuperiorId = survey.surveySuperiorId
         const surveyShortName = survey.surveyShortName
         const updateType = survey.updateType

         LogThis(
            log,
            `surveySuperiorId selected: surveySuperiorId=${surveySuperiorId}; surveyShortName=${surveyShortName}`,
            L0,
         )

         if (fileNumeric && fileReal) {
            //LogThis(log, "ABOUT TO CALL AXIOS");

            let answersRows = fileNumeric.replace(/\r/g, '').split('\n')
            answersRows.shift()
            answersRows.shift()
            LogThis(
               log,
               `answersRows=${JSON.stringify(answersRows, null, 2)}`,
               L3,
            )

            let answersRealRows = fileReal.replace(/\r/g, '').split('\n')
            answersRealRows.shift()
            answersRealRows.shift()

            const results = await axios.get(
               BACKEND_ENDPOINT +
                  `/surveys/${surveyShortName}/respondentidsinfo`,
               config,
            )
            if (updateType == 'new') {
               const respondentIdsInfo = results.data.respondentIdsInfo
               LogThis(
                  log,
                  `respondentIdsInfo=${JSON.stringify(
                     respondentIdsInfo,
                     null,
                     2,
                  )}`,
                  L3,
               )
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message: 'Información de respuestas existentes obtenida.',
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))

               if (respondentIdsInfo && respondentIdsInfo.length > 0) {
                  LogThis(log, `Filtering required`, L3)
                  //START Filter rows by  new answers only

                  let filteredAnswersRows = []
                  let filteredRealAnswersRows = []
                  const lastestIdSaved =
                     respondentIdsInfo[0].SCOLINFO_respondent_id

                  const firstRow = rowCleaner2(answersRows[0]).split(',')
                  if (firstRow[0] >= lastestIdSaved) {
                     for (let i = 0; i < answersRows.length; i++) {
                        let row = rowCleaner2(answersRows[i]).split(',')
                        //if(row[0]>=lastestIdSaved){
                        // if(!uploadingOldFile)
                        // {
                        if (row[0] == lastestIdSaved) {
                           break
                        } else {
                           filteredAnswersRows.push(answersRows[i])
                           filteredRealAnswersRows.push(answersRealRows[i])
                        }
                        // } else {
                        //   let resIdFound = answersRows.find(rowI => rowCleaner2(rowI).split(",")[0]==row[0])
                        //   if(!resIdFound){
                        //     filteredAnswersRows.push(answersRows[i]);
                        //     filteredRealAnswersRows.push(answersRealRows[i]);
                        //   }
                        // }
                     }
                  } else {
                     filteredAnswersRows = answersRows.filter(
                        row =>
                           !respondentIdsInfo.find(
                              respondentId =>
                                 respondentId.SCOLINFO_respondent_id ==
                                 rowCleaner2(row).split(',')[0],
                           ),
                     )

                     filteredRealAnswersRows = answersRealRows.filter(rowReal =>
                        filteredAnswersRows.find(
                           rowNum =>
                              rowCleaner2(rowReal).split(',')[0] ==
                              rowCleaner2(rowNum).split(',')[0],
                        ),
                     )
                  }

                  answersRows = filteredAnswersRows

                  LogThis(
                     log,
                     `Filtered answersData=${JSON.stringify(
                        answersRows,
                        null,
                        2,
                     )}`,
                     L3,
                  )

                  answersRealRows = filteredRealAnswersRows
                  LogThis(
                     log,
                     `Filtered answersDataReal=${JSON.stringify(
                        answersRealRows,
                        null,
                        2,
                     )}`,
                     L3,
                  )
               } else {
                  LogThis(log, `Filtering not required`, L3)
               }
            }

            if (
               answersRows &&
               answersRows.length > 0 &&
               answersRows[0] != '' &&
               answersRealRows &&
               answersRealRows.length > 0 &&
               answersRealRows[0] != ''
            ) {
               LogThis(log, `answersRows files contains data`, L3)
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message: 'Obteniendo configuracion de las encuestas.',
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))
               let { data } = await axios.get(
                  BACKEND_ENDPOINT + `/surveys/${surveySuperiorId}/configs`,
                  config,
               )
               LogThis(log, `data=${JSON.stringify(data, null, 2)}`, L3)
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message: 'Configuracion de encuestas obtenido.',
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))

               const surveyConfigs = data

               //END Filter rows by  new answers only
               //console.log(`Getting multi surveys`);
               //GET MULTI SURVEY DATA HERE AND ASSIGN TO let multiSurveys
               //let multiSurvey = surveyConfigs.multiSurveys; // replace this with value from multiSurveys coming from response.
               const surveyIdsList = surveyConfigs.surveyIdsList

               //GET QUESTIONS FROM RESPONSE

               const questions = surveyConfigs.questions // replace with value from questions coming from response.

               //GET calculatedFields response
               const calculatedFields = surveyConfigs.calculatedFields

               LogThis(log, `surveyIdsList=${surveyIdsList}`)

               const surveyResponses = []

               const calculatedValues = []

               let allSurveyQuestions = []
               let allCalculatedFields = []
               console.log(`Getting questions per survey`)

               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message: 'Mapeando las preguntas a cada tipo de encuesta.',
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))
               surveyIdsList.map(surveyId => {
                  let surveyQuestions = questions
                     .filter(
                        question =>
                           question.surveyId._id.toString() ===
                           surveyId.toString(),
                     )
                     .sort((a, b) => a.superSurveyCol - b.superSurveyCol)

                  surveyQuestions.forEach(q => {
                     allSurveyQuestions.push(q)
                  })

                  let surveyCalculatedFields = calculatedFields
                     .filter(
                        calculatedField =>
                           calculatedField.surveyId._id.toString() ===
                           surveyId.toString(),
                     )
                     .sort((a, b) => a.sequence - b.sequence)

                  surveyCalculatedFields.forEach(cal => {
                     allCalculatedFields.push(cal)
                  })
               })

               LogThis(
                  log,
                  `calculatedFields=${JSON.stringify(
                     allSurveyQuestions,
                     null,
                     2,
                  )};`,
               )

               LogThis(
                  log,
                  `Filtered calculated fields allCalculatedFields=${JSON.stringify(
                     allCalculatedFields,
                     null,
                     2,
                  )};`,
               )

               let questionDesc = ''
               let questionShortDesc = ''
               let csv = ''
               console.log(`Mapping Questions`)

               questions.map(q => {
                  questionDesc =
                     questionDesc + q.question.replace(/,/g, ';') + ','
                  questionShortDesc =
                     questionShortDesc +
                     q.questionShort.replace(/,/g, ';') +
                     ','
               })

               allCalculatedFields.map(c => {
                  questionDesc =
                     questionDesc + c.description.replace(/,/g, ';') + ','
                  questionShortDesc =
                     questionShortDesc +
                     c.shortDescription.replace(/,/g, ';') +
                     ','
               })
               questionDesc = questionDesc.slice(0, -1)
               questionShortDesc = questionShortDesc.slice(0, -1)
               questionDesc = questionDesc + '\n'
               questionShortDesc = questionShortDesc + '\n'

               csv = csv + questionDesc + questionShortDesc

               let rowClean = ''
               let answers = []
               let respondentId = ''

               let rowRealClean = ''
               let answersReal = []
               console.log(`Processing rows`)

               for (let r = 0; r < answersRows.length; r++) {
                  if (r % 10 === 0) {
                     dispatch({
                        type: SURVEY_PROCESS_ANSWERS_STATUS,
                        payload: {
                           message: `Procesando respuestas para la encuesta número: ${
                              r + 1
                           }`,
                           row: r + 1,
                        },
                     })
                     await new Promise(resolve => setTimeout(resolve, 1))
                  }
                  LogThis(
                     log,
                     `Processing Row r=${r}; allSurveyQuestions=${JSON.stringify(
                        allSurveyQuestions,
                        null,
                        1,
                     )} length=${allSurveyQuestions.length}`,
                     L3,
                  )
                  rowClean = rowCleaner2(answersRows[r])
                  LogThis(
                     log,
                     `before calling split rowClean 1 rowClean=${JSON.stringify(
                        rowClean,
                     )}`,
                     L3,
                  )
                  answers = rowClean.split(',')
                  LogThis(
                     log,
                     `before calling split rowClean 2 answers=${JSON.stringify(
                        answers,
                     )}`,
                     L3,
                  )
                  rowRealClean = rowCleaner2(answersRealRows[r])
                  LogThis(
                     log,
                     `before calling split rowClean 3 rowRealClean=${JSON.stringify(
                        rowRealClean,
                     )}`,
                     L3,
                  )
                  answersReal = rowRealClean.split(',')
                  LogThis(
                     log,
                     `before calling split rowClean 4 answersReal=${JSON.stringify(
                        answersReal,
                     )}`,
                     L3,
                  )

                  LogThis(log, `answers=${answers}`, L3)
                  if (answers[0] == '' || answers[0].trim() == '') {
                     break
                  }

                  respondentId = answers[0].trim()
                  let row = r + 1
                  for (let a = 0; a < allSurveyQuestions.length; a++) {
                     LogThis(log, `processing question a=${a}`, L3)

                     let surveyQuestion = allSurveyQuestions[a]
                     let superSurveyQuestionCol =
                        surveyQuestion.superSurveyCol - 1
                     //transform the question answer value into the weighted answer for that Survey.
                     let weightedResponse = null
                     let response = null
                     let isWeighted = null

                     if (
                        surveyQuestion.weights &&
                        (Object.keys(surveyQuestion.weights).length > 0 ||
                           surveyQuestion.weigths.length > 0)
                     ) {
                        let answerA = answers[superSurveyQuestionCol]
                           .toString()
                           .trim()
                           .replace(/'\n'/g, '')
                        switch (surveyQuestion.weightType) {
                           case WEIGHTED_PAIRS:
                              weightedResponse = surveyQuestion.weights[answerA]
                              break
                           case WEIGHTED_CRITERIA:
                              weightedResponse = applyStringCriteriaToValue(
                                 surveyQuestion.weights,
                                 answerA,
                              )
                        }
                        LogThis(
                           log,
                           `question weights=${JSON.stringify(
                              surveyQuestion.weights,
                           )}`,
                           L3,
                        )
                        LogThis(
                           log,
                           `BEFORE col=${superSurveyQuestionCol}; fieldName=${surveyQuestion.fieldName}; isWeighted=${isWeighted}; answerA=${answerA}; weightedResponse=${weightedResponse}`,
                           L3,
                        )
                        if (weightedResponse === undefined) {
                           weightedResponse = answerA
                           isWeighted = false
                        } else {
                           isWeighted = true
                        }
                        response = answerA
                        answers[superSurveyQuestionCol] = weightedResponse
                        LogThis(
                           log,
                           `AFTER col=${superSurveyQuestionCol}; fieldName=${surveyQuestion.fieldName}; isWeighted=${isWeighted}; answerA=${answerA}; weightedResponse=${weightedResponse}`,
                           L3,
                        )
                     } else {
                        //CASE NO_WEIGHTED
                        let answerA = answers[superSurveyQuestionCol]
                        response = answerA
                        weightedResponse = answerA
                        isWeighted = false
                        LogThis(
                           log,
                           `no weighted: superSurveyQuestionCol=${superSurveyQuestionCol}; answer=${weightedResponse}`,
                           L3,
                        )
                     }

                     surveyResponses.push({
                        questionId: surveyQuestion._id,
                        respondentId: respondentId,
                        row: row,
                        col: a + 1,
                        response: response,
                        responseReal: answersReal[superSurveyQuestionCol],
                        weightedResponse: weightedResponse,
                        isWeighted: isWeighted,
                     })

                     if (isWeighted) {
                        LogThis(
                           log,
                           `Adding csv weighted answer: weightedResponse=${weightedResponse}`,
                           L3,
                        )
                        weightedResponse = weightedResponse ?? ''
                        csv = csv + weightedResponse.toString() + ','
                     } else {
                        csv = csv + response.toString() + ','
                     }
                  }

                  LogThis(
                     log,
                     `surveyResponses=${JSON.stringify(
                        surveyResponses,
                        null,
                        2,
                     )}`,
                     L3,
                  )

                  LogThis(
                     log,
                     `allCalculatedFields=${JSON.stringify(
                        allCalculatedFields,
                        null,
                        1,
                     )}`,
                     L3,
                  )
                  for (let a = 0; a < allCalculatedFields.length; a++) {
                     LogThis(
                        log,
                        `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}`,
                        L3,
                     )
                     let allCalculatedField = allCalculatedFields[a]
                     let value = null
                     if (
                        allCalculatedField.calculationType ===
                        CAL_CRITERIA_ON_OTHER_FIELD
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
                        let fieldNameValue = allCalculatedFields.find(
                           calField => {
                              LogThis(
                                 log,
                                 `calField=${JSON.stringify(
                                    calField,
                                    null,
                                    2,
                                 )}`,
                                 L3,
                              )
                              return (
                                 calField.fieldName ==
                                 criteria.fieldNameValue[0]
                              )
                           },
                        )
                        LogThis(
                           log,
                           `fieldNameValue1=${JSON.stringify(
                              fieldNameValue,
                              null,
                              2,
                           )}`,
                           L3,
                        )
                        let sequence = fieldNameValue.sequence
                        let calValue = calculatedValues.find(
                           value => value.col == sequence && value.row == row,
                        )
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
                                 value = criteria.resultIfTrue
                                 LogThis(
                                    log,
                                    `Creteria is true: value=${value}`,
                                    L3,
                                 )
                              } else {
                                 value = criteria.resultIfFalse
                                 LogThis(
                                    log,
                                    `Creteria is false: value=${value}`,
                                    L3,
                                 )
                              }
                              break
                           default:
                              value = null
                              LogThis(
                                 log,
                                 `Case entered default: value${value}`,
                                 L3,
                              )
                        }
                     } else if (
                        allCalculatedField.calculationType === CAL_SUM_THE_GROUP
                     ) {
                        let groups = allCalculatedField.group
                        groups.map(group => {
                           let newVal = parseInt(answers[group])

                           if (
                              typeof newVal != 'number' ||
                              newVal == null ||
                              isNaN(newVal)
                           ) {
                              newVal = 0
                           }
                           value = value + newVal
                        })
                     } else if (
                        allCalculatedField.calculationType ===
                        CAL_CONCAT_GROUP_BASED_ON_CRITERIA
                     ) {
                        let groups = allCalculatedField.group
                        value = ''
                        for (let i = 0; i < groups.length; i++) {
                           let group = groups[i]
                           if (
                              applyStringCriteriaToValue(
                                 allCalculatedField.criteria,
                                 parseInt(answers[group]),
                              ) == 1
                           ) {
                              LogThis(
                                 log,
                                 `groups=${groups}; group=${group}; calField=${allCalculatedField.fieldName};`,
                                 L3,
                              )
                              let questionSelected = allSurveyQuestions.find(
                                 q => q.superSurveyCol == group + 1,
                              )
                              LogThis(
                                 log,
                                 `groups=${groups}; group=${
                                    group + 1
                                 }; calField=${
                                    allCalculatedField.fieldName
                                 }; questionSelected.questionShort=${questionSelected.question.replace(
                                    /,/g,
                                    ';',
                                 )}`,
                                 L3,
                              )

                              value =
                                 value +
                                 questionSelected.question.replace(/,/g, ' ') +
                                 '; '
                           }
                        }
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
                     LogThis(
                        log,
                        `Pushing value: calculatedFieldId=${
                           allCalculatedFields[a]._id
                        }; row=${row};col=${a + 1}; value=${value};`,
                        L3,
                     )

                     calculatedValues.push({
                        calculatedFieldId: allCalculatedFields[a]._id,
                        respondentId: respondentId,
                        row: row,
                        col: a + 1,
                        value: value,
                     })
                     csv = csv + value.toString() + ','
                  }
                  csv = csv.slice(0, -1)
                  csv = csv + '\n'
               }
               LogThis(
                  log,
                  `calculatedValues=${JSON.stringify(
                     calculatedValues,
                     null,
                     2,
                  )}`,
                  L3,
               )
               //get outputLayout from response

               const outputLayout = surveyConfigs.outputLayout

               LogThis(
                  log,
                  `outputLayouts=${JSON.stringify(outputLayout, null, 2)}`,
                  L3,
               )

               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: { message: 'Generando el archivo CSV.', row: 0 },
               })
               await new Promise(resolve => setTimeout(resolve, 1))

               let csvLayout = ''
               let layout = null
               for (let o = 0; o < outputLayout.length - 1; o++) {
                  layout = outputLayout[o]
                  csvLayout =
                     csvLayout + layout.description.replace(/,/g, ';') + ','
               }
               LogThis(log, `outputLayout data csvLayout=${csvLayout}`, L3)

               layout = outputLayout[outputLayout.length - 1]
               csvLayout =
                  csvLayout + layout.description.replace(/,/g, ';') + '\n'

               for (let o = 0; o < outputLayout.length - 1; o++) {
                  layout = outputLayout[o]
                  csvLayout =
                     csvLayout +
                     layout.shortDescription.replace(/,/g, ';') +
                     ','
               }
               layout = outputLayout[outputLayout.length - 1]
               csvLayout =
                  csvLayout + layout.shortDescription.replace(/,/g, ';') + '\n'

               const cols = []
               LogThis(log, `Mapping columns to Layout`, L3)

               for (let o = 0; o < outputLayout.length; o++) {
                  layout = outputLayout[o]
                  LogThis(
                     log,
                     `layout.fieldId=${layout.fieldId}; layout.isCalculated=${layout.isCalculated}`,
                     L3,
                  )
                  if (layout.isCalculated) {
                     LogThis(
                        log,
                        `layout.isCalculated=${layout.isCalculated}`,
                        L3,
                     )
                     cols.push(
                        calculatedValues
                           .filter(
                              val => val.calculatedFieldId == layout.fieldId,
                           )
                           .sort((a, b) => a.row - b.row),
                     )
                  } else {
                     let responses = surveyResponses.filter(
                        val => val.questionId == layout.fieldId,
                     )
                     //LogThis(log, `responsesFound = ${JSON.stringify(responses)}`);
                     responses = responses.sort((a, b) => a.row - b.row)
                     //LogThis(log, `responsesSorted = ${JSON.stringify(responses)}`);
                     cols.push(responses)
                  }
               }
               LogThis(
                  log,
                  `cols=${JSON.stringify(
                     cols,
                     null,
                     2,
                  )}; outputLayout=${JSON.stringify(outputLayout, null, 2)}`,
                  L3,
               )

               let value = null
               LogThis(
                  log,
                  `cols Length=${cols.length}; rows length=${cols[0].length}; outputLayout Length=${outputLayout.length}`,
                  L3,
               )
               console.log(`Getting values for the columns in the layout`)

               let row = []
               let outputValues = []
               for (let r = 0; r < cols[0].length; r++) {
                  if (r % 10 === 0) {
                     dispatch({
                        type: SURVEY_PROCESS_ANSWERS_STATUS,
                        payload: {
                           message:
                              'Agregando encuesta al archivo CSV, número:',
                           row: r + 1,
                        },
                     })
                     await new Promise(resolve => setTimeout(resolve, 1))
                  }

                  for (let c = 0; c < cols.length - 1; c++) {
                     layout = outputLayout[c]
                     LogThis(log, `Processing Col=${c}; row=${r}`, L3)

                     value = cols[c][r]
                     LogThis(
                        log,
                        `value cycle=${JSON.stringify(value, null, 2)}`,
                        L3,
                     )
                     if (layout.outputAsReal) {
                        value = value.responseReal
                     } else {
                        if ('isWeighted' in value) {
                           if (value.isWeighted) {
                              value = value.weightedResponse
                           } else {
                              value = value.response
                           }
                        } else {
                           value = value.value
                        }
                     }

                     if (value == null || value == undefined) {
                        value = ''
                     }
                     LogThis(log, `value=${value}`, L3)
                     csvLayout = csvLayout + value + ','
                     row.push(value)
                  }
                  LogThis(
                     log,
                     `Processing Last Col=${outputLayout.length - 1}; row=${r}`,
                     L3,
                  )
                  value = cols[outputLayout.length - 1][r]

                  if (layout.outputAsReal) {
                     value = value.responseReal
                  } else {
                     if ('isWeighted' in value) {
                        if (value.isWeighted) {
                           value = value.weightedResponse
                        } else {
                           value = value.response
                        }
                     } else {
                        value = value.value
                     }
                  }

                  if (value == null || value == undefined) {
                     value = ''
                  }
                  LogThis(log, `value=${value}`, L3)
                  csvLayout = csvLayout + value + '\n'
                  row.push(value)

                  outputValues.push([...row])
                  LogThis(
                     log,
                     `Building outputValues: row=${JSON.stringify(
                        row,
                     )}; outputValues=${JSON.stringify(outputValues)}`,
                     L3,
                  )
                  row.length = 0
               }
               LogThis(log, `Output layout is ready`, L3)

               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: { message: 'Archivo CSV generado.', row: 0 },
               })

               await new Promise(resolve => setTimeout(resolve, 1))
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message:
                        'Guardando encuestas y respuestas en la base de datos',
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))
               console.log(`CATCH PRE`)
               const columnsNames = []
               outputLayout.forEach(column => {
                  columnsNames.push(column.fieldName)
               })

               const outputData = {
                  columnsNames: columnsNames,
                  outputValues: null,
               }

               if (csvLayout && csvLayout.length > 0) {
                  console.log(`CATCH IN OUTPUT`)

                  dispatch({
                     type: SURVEY_PROCESS_ANSWERS_STATUS,
                     payload: {
                        message:
                           'Enviando respuestas a la base de datos en partes.',
                        row: 0,
                     },
                  })
                  await new Promise(resolve => setTimeout(resolve, 1))
                  LogThis(log, `status sent`, L3)

                  LogThis(log, `after promise`, L3)
                  let row = 0
                  let r = 0
                  const outputValuesSlice = []
                  const sliceSize = KUARSIS_DB_SURVEY_ANSWERS_BATCH_SIZE

                  if (updateType == 'all') {
                     LogThis(log, `About to call axios.delete for /outputs`, L3)

                     await axios.delete(
                        BACKEND_ENDPOINT +
                           `/surveys/${surveySuperiorId}/outputs`,
                        config,
                     )
                     LogThis(log, `After calling axios.delete for /outputs`, L0)
                  }

                  for (
                     let slice = 1;
                     slice <= Math.ceil(outputValues.length / sliceSize);
                     slice++
                  ) {
                     LogThis(log, `CATCH ERROR 2`, L3)
                     for (
                        r = row;
                        r < row + sliceSize && r < outputValues.length;
                        r++
                     ) {
                        outputValuesSlice.push([...outputValues[r]])
                        LogThis(
                           log,
                           `Pushing row to slice ${slice} row ${r}; outputValues=${JSON.stringify(
                              outputValues[r],
                           )}; outputValuesSlice=${JSON.stringify(
                              outputValuesSlice,
                           )}`,
                           L3,
                        )
                     }
                     LogThis(log, `CATCH ERROR 3`, L3)
                     outputData.outputValues = outputValuesSlice
                     row = r
                     LogThis(
                        log,
                        `current slice ${slice} outputValuesSlice=${JSON.stringify(
                           outputValuesSlice,
                        )}`,
                        L3,
                     )
                     let fromSurvey = 0
                     if (sliceSize >= r) {
                        fromSurvey = r
                     } else {
                        fromSurvey = r - sliceSize
                     }
                     dispatch({
                        type: SURVEY_PROCESS_ANSWERS_STATUS,
                        payload: {
                           message: `Enviando parte ${slice} encuesta número ${fromSurvey} a la ${r}`,
                           row: r,
                        },
                     })
                     await new Promise(resolve => setTimeout(resolve, 1))
                     LogThis(log, `about to call axios send output data`, L3)
                     LogThis(
                        log,
                        `about to call post axios for /outputs with: config=${JSON.stringify(
                           config,
                        )}; slice=${slice}`,
                        L0,
                     )
                     await axios.post(
                        BACKEND_ENDPOINT +
                           `/surveys/${surveySuperiorId}/outputs`,
                        outputData,
                        config,
                     )
                     LogThis(
                        log,
                        `AFTER call axios get /outputs slice=${slice}`,
                        L0,
                     )
                     outputValuesSlice.length = 0
                  }
                  //const csvLayout = "Hola Mundo";
                  dispatch({
                     type: SURVEY_PROCESS_ANSWERS_SUCCESS,
                     payload: {
                        csvLayout: csvLayout,
                        surveySuccessMessage: `Procesamiento finalizado. Encuestas nuevas procesadas: ${outputValues.length}`,
                     },
                  })
                  await new Promise(resolve => setTimeout(resolve, 1))
                  dispatch({
                     type: SURVEY_PROCESS_ANSWERS_STATUS,
                     payload: {
                        message: `Procesamiento de encuestas terminado, encuentre archivo CSV in el folder de downloads`,
                        row: r,
                        //row: 0,
                     },
                  })
                  await new Promise(resolve => setTimeout(resolve, 1000))
               } else {
                  throw Error('No CSV data generated.')
               }
            } else {
               LogThis(log, `answersRows files does not contains new data`, L3)
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_STATUS,
                  payload: {
                     message: `Los archivos no contienen respuestas nuevas, el sistema ya está al corriente.`,
                     row: 0,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))
               //const csvLayout = "Hola Mundo";
               LogThis(
                  log,
                  `answersRows files does not contains new data Dispatched SUCCESS`,
                  L3,
               )
               dispatch({
                  type: SURVEY_PROCESS_ANSWERS_SUCCESS,
                  payload: {
                     csvLayout: '',
                     surveySuccessMessage: `Procesamiento finalizado. Encuestas nuevas procesadas: 0`,
                  },
               })
               await new Promise(resolve => setTimeout(resolve, 1))
            }
         } else {
            throw Error('Survey response files were not provided as expected.')
         }
      } catch (error) {
         dispatch({
            type: SURVEY_PROCESS_ANSWERS_FAIL,
            payload:
               error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
         })
      }
   }

export const surveyDetailsAction = () => async (dispatch, getState) => {
   try {
      const log = new LoggerSettings(srcFileName, 'surveyDetailsAction')
      dispatch({
         type: SURVEY_DETAILS_REQUEST,
      })

      const {
         userLogin: { userInfo },
      } = getState()

      LogThis(log, 'ABOUT TO CALL AXIOS')
      const config = {
         headers: {
            Authorization: `Bearer ${userInfo.token}`,
         },
      }

      const { data } = await axios.get(BACKEND_ENDPOINT + `/surveys`, config)
      LogThis(log, `data=${JSON.stringify(data)}`, L3)
      dispatch({
         type: SURVEY_DETAILS_SUCCESS,
         payload: data,
      })
   } catch (error) {
      dispatch({
         type: SURVEY_DETAILS_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      })
   }
}

export const surveyGetOutputValuesAction =
   superSurveyId => async (dispatch, getState) => {
      try {
         const log = new LoggerSettings(
            srcFileName,
            'surveyGetOutputValuesAction',
         )
         dispatch({
            type: SURVEY_OUTPUTS_REQUEST,
         })

         const {
            userLogin: { userInfo },
         } = getState()

         LogThis(log, 'ABOUT TO CALL AXIOS')
         const config = {
            headers: {
               Authorization: `Bearer ${userInfo.token}`,
            },
         }
         LogThis(
            log,
            `superSurveyId=${JSON.stringify(
               superSurveyId,
            )}; superSurveyId.superSurveyShortName=${
               superSurveyId.superSurveyShortName
            }; userInfo.token=${userInfo.token}`,
            L3,
         )
         const { data } = await axios.get(
            BACKEND_ENDPOINT +
               `/surveys/${superSurveyId.surveySuperiorId}/outputs?superSurveyShortName=${superSurveyId.surveyShortName}&pageNumber=${superSurveyId.pageNumber}&keyword=${superSurveyId.keyword}`,
            config,
         )

         LogThis(log, `dataOutputValues=${JSON.stringify(data, null, 2)}`, L3)

         if (data && data.outputsInfo) {
            //LogThis(log, `data=${JSON.stringify(data)}`, L0);
            dispatch({
               type: SURVEY_OUTPUTS_SUCCESS,
               payload: data.outputsInfo,
            })
         } else {
            throw new Error(`No output info or output data found`)
         }
      } catch (error) {
         dispatch({
            type: SURVEY_OUTPUTS_FAIL,
            payload:
               error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
         })
      }
   }
