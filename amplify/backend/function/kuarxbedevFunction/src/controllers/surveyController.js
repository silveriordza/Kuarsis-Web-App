/**
 * @format
 * @prittier
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const util = require('util')
const axios = require('axios')

let asyncHandler = require('express-async-handler')

const { SURVEY_PROCESS_STATUS } = require('../config/surveyConstants.js')
const { j } = require('../utils/Functions.js')
const {
   getMonkeyResponses,
   ValidateMonkeyConfigs,
   PushBlankPage,
   AnalyzeQuestionResponse,
} = require('../utils/surveyMonkeyAPI.js')
const {
   buildOutputHeaders,
   getSuperSurveysConfigs,
   addResponseInfo,
   addResponseInfoAll,
} = require('../utils/surveysLib.js')

// let {
//   superSurveyConf,
// } = require("../models/otherModelsNotCode/surveyOnCareTreatmentTalentos2020.js");

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

//let { DynamicCollection } = require('../models/dynamicCollectionModel.js')

let {
   LogThis,
   LogVars,
   HasDataException,
   LoggerSettings,
   LogDebugSection,
   OFF,
   L0,
   L1,
   L2,
   L3,
} = require('../utils/Logger.js')

const archiver = require('archiver')
const AdmZip = require('adm-zip')
const JSZip = require('jszip')

let { rowCleaner } = require('../utils/csvProcessingLib.js')
let {
   saveDynamicModelToDB,
   loadOneDynamicModelFromDB,
   dynamicModelsMap,
} = require('../utils/mongoDbHelper.js')
const srcFileName = 'surveyController.js'

const fs = require('fs')

//let onCareSuperSurvey = require("../models/surveyOnCareTreatmentTalentos2020.json");

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyCreateConfig = asyncHandler(async (req, res) => {
   const functionName = 'getSuperSurveyConfigs'
   const log = new LoggerSettings(srcFileName, functionName)
   const { superSurveyConfig } = req.body
   let ownerId = req.user._id

   await SurveySuperior.deleteMany({})
   await Survey.deleteMany({})
   await SurveyQuestion.deleteMany({})
   //await SurveyMulti.deleteMany({});
   await SurveyCalculatedField.deleteMany({})
   await SurveySuperiorOutputLayout.deleteMany({})

   console.log('superSurveyConfig INPUT values are:')
   console.log(superSurveyConfig)
   console.log('Survey Configuration Values STRINGIFIED:')

   let superSurveyConfigTest = superSurveyConfig
   const superSurvey = new SurveySuperior({
      owner: ownerId,
      surveyName: superSurveyConfigTest.surveyName,
      surveyShortName: superSurveyConfigTest.surveyShortName,
      description: superSurveyConfigTest.description,
   })

   const createdSurveySuperior = await superSurvey.save()

   let surveysCreated = []
   let questionsCreated = []
   //let calculatedFieldsCreated = [];
   let surveyCreated = null
   let questions = []
   let calculatedFields = []
   let questionItem = null

   console.log('About to insert many')
   for (let i = 0; i < superSurveyConfigTest.surveyList.length; i++) {
      let surveyItem = superSurveyConfigTest.surveyList[i]
      let survey = new Survey({
         superSurveyId: createdSurveySuperior._id,
         surveyName: surveyItem.surveyName,
         surveyShortName: surveyItem.surveyShortName,
         description: surveyItem.description,
         instructions: surveyItem.instructions,
      })
      surveyCreated = await survey.save()
      // let multiSurvey = new SurveyMulti({
      //   owner: ownerId,
      //   superSurveyId: createdSurveySuperior._id,
      //   surveyId: surveyCreated._id,
      //   sequence: i + 1,
      // });
      // let multiSurveyCreated = await multiSurvey.save();

      surveysCreated.push(surveyCreated)

      for (let x = 0; x < surveyItem.questionList.length; x++) {
         questionItem = surveyItem.questionList[x]
         questions.push({
            surveyId: surveyCreated._id,
            question: questionItem.question,
            questionShort: questionItem.questionShort,
            fieldName: questionItem.fieldName,
            weightType: questionItem.weightType,
            weights: questionItem.weights,
            surveyCol: questionItem.surveyCol,
            superSurveyCol: questionItem.superSurveyCol,
         })
      }

      for (
         let x = 0;
         surveyItem.calculatedFieldList &&
         x < surveyItem.calculatedFieldList.length;
         x++
      ) {
         calculatedFieldItem = surveyItem.calculatedFieldList[x]
         calculatedFields
         calculatedFields.push({
            surveyId: surveyCreated._id,
            description: calculatedFieldItem.description,
            shortDescription: calculatedFieldItem.shortDescription,
            fieldName: calculatedFieldItem.fieldName,
            calculationType: calculatedFieldItem.calculationType,
            criteria: calculatedFieldItem.criteria ?? null,
            group: calculatedFieldItem.group,
            sequence: calculatedFieldItem.sequence,
         })
      }
      LogThis(log, 'About to insert many', L3)
      LogThis(log, `questions=${JSON.stringify(questions)}`, L3)
      questionsCreated = await SurveyQuestion.insertMany(questions)
      questions = []
      LogThis(log, `calculatedFields=${JSON.stringify(calculatedFields)}`, L3)
      if (calculatedFields.length > 0) {
         calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
            calculatedFields,
         )
         calculatedFields = []
      }
   }

   let outputLayouts = superSurveyConfigTest.surveySuperiorOutputLayout.sort(
      (a, b) => a.sequence - b.sequence,
   )
   LogThis(log, `outputLayouts = ${JSON.stringify(outputLayouts)}`, L3)
   let outputLayoutFields = []
   for (let i = 0; i < outputLayouts.length; i++) {
      outputLayout = outputLayouts[i]
      outputLayoutFields.push({
         surveySuperiorId: createdSurveySuperior._id,
         surveyShortName: outputLayout.surveyShortName,
         fieldName: outputLayout.fieldName,
         outputAsReal: outputLayout.outputAsReal,
         showInSurveyOutputScreen: outputLayout.showInSurveyOutputScreen,
         sequence: outputLayout.sequence,
      })
   }
   LogThis(
      log,
      `outputLayoutFields = ${JSON.stringify(outputLayoutFields)}`,
      L3,
   )
   const createdOutputLayout = await SurveySuperiorOutputLayout.insertMany(
      outputLayoutFields,
   )

   //Start Output Collection
   let x = 0
   x++
   const surveyOutputCollectionName =
      `surveyOutputs_${superSurveyConfigTest.surveyShortName}`.toLocaleLowerCase()
   LogThis(
      log,
      `x=${x}; surveyOutputCollectionName=${surveyOutputCollectionName}`,
      L3,
   )

   x = x + 1
   LogThis(log, `x=${x}`, L3)
   const collections = await mongoose.connection.db
      .listCollections({ name: surveyOutputCollectionName })
      .toArray()
   x = x + 1
   LogThis(log, `x=${x}`, L3)
   const collInfo = collections.find(
      collection => collection.name === surveyOutputCollectionName,
   )
   if (collInfo) {
      LogThis(log, `dropping surveyOutputCollectionName`, L3)
      let surveyOutputCollection = await mongoose.connection.collection(
         surveyOutputCollectionName,
      )

      await surveyOutputCollection.drop()

      LogThis(log, `dropped surveyOutputCollectionName`, L3)

      delete mongoose.models[surveyOutputCollectionName]
      LogThis(log, `deleted models`, L3)
   }
   x = x + 1
   LogThis(log, `x=${x}`, L3)

   let surveyOutputColumns = {}

   outputLayoutFields.forEach(column => {
      LogThis(log, `output Layout Field column=${JSON.stringify(column)}`, L3)
      surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.String
   })
   x = x + 1
   LogThis(
      log,
      `x=${x}; surveyOutputColumns=${JSON.stringify(
         Object.entries(surveyOutputColumns),
      )}`,
      L3,
   )

   const surveyOutputCollectionSchema = new Schema(surveyOutputColumns)
   x = x + 1
   LogThis(log, `x=${x}`, L3)
   const surveyOutputCollection = mongoose.model(
      surveyOutputCollectionName,
      surveyOutputCollectionSchema,
   )

   saveDynamicModelToDB(surveyOutputCollectionName, surveyOutputColumns)

   // await DynamicCollection.deleteOne({
   //   collectionName: surveyOutputCollectionName,
   // });

   // const schemaDefinition = {
   //   field1: String,
   //   field2: Number,
   //   // Add more fields as needed
   // };
   // const dynamicCollection = new DynamicCollection();
   // dynamicCollection.collectionName = surveyOutputCollectionName;
   // dynamicCollection.schemaDefinition = schemaDefinition;

   // const createdDynamicCollection = await dynamicCollection.save();
   // if (!createdDynamicCollection) {
   //   throw new Error(`DynamicCollection couldn't be created`);
   // }

   x = x + 1
   LogThis(log, `x=${x}`, L3)

   console.log('about to respond')
   res.status(201).json({
      surveySuperiorId: createdSurveySuperior._id,
      surveysCreated: surveysCreated,
      questionsCreated: questionsCreated,
      createdOutputLayout: createdOutputLayout,
      surveyOutputCollectionSchema: surveyOutputCollectionSchema,
   })
})

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyCreateConfigIntegratedWithMonkey = asyncHandler(
   async (req, res) => {
      const functionName = 'superSurveyCreateConfigIntegratedWithMonkey'
      const log = new LoggerSettings(srcFileName, functionName)
      const { superSurveyConfig } = req.body
      let ownerId = req.user._id
      const surveyMonkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

      if (!surveyMonkeyToken || surveyMonkeyToken == '') {
         throw new Error(`Survey Monkey token not found.`)
      }

      // const configSurveyMonkey = {
      //   //responseType: "arraybuffer",
      //   headers: {
      //     //"Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${surveyMonkeyToken}`,
      //     Accept: "application/json",
      //   },
      // };
      await SurveySuperior.deleteMany({})
      await Survey.deleteMany({})
      await SurveyQuestion.deleteMany({})
      //await SurveyMulti.deleteMany({});
      await SurveyCalculatedField.deleteMany({})
      await SurveySuperiorOutputLayout.deleteMany({})

      // console.log("superSurveyConfig INPUT values are:");
      // console.log(superSurveyConfig);
      // console.log("Survey Configuration Values STRINGIFIED:");

      const surveyMonkeyConfigsResult = await SurveyMonkeyConfig.find({
         surveyMonkeyId: superSurveyConfig.surveyMonkeyId,
      }).lean()

      if (surveyMonkeyConfigsResult && surveyMonkeyConfigsResult.length <= 0) {
         throw new Error(
            `Survey does not exist in the cached Survey Monkey table`,
         )
      }
      const surveyMonkeyConfigs = surveyMonkeyConfigsResult[0]
      //res.status(201).json(surveyMonkeyConfigs);
      //Save Survey Superior
      const superSurvey = new SurveySuperior({
         owner: ownerId,
         surveyName: superSurveyConfig.surveyName,
         surveyShortName: superSurveyConfig.surveyShortName,
         description: superSurveyConfig.description,
         surveyMonkeyId: superSurveyConfig.surveyMonkeyId,
      })

      const createdSurveySuperior = await superSurvey.save()

      let surveysCreated = []
      let questionsCreated = []
      //let calculatedFieldsCreated = [];
      let surveyCreated = null
      let questions = []
      let calculatedFields = []
      let questionItem = null
      let questionMonkeyPosition = null
      // LogThis(
      //   log,
      //   `surveyMonkeyConfigs=${JSON.stringify(surveyMonkeyConfigs)}`,
      //   L0
      // );
      for (let i = 1; i < superSurveyConfig.surveyList.length; i++) {
         let surveyItem = superSurveyConfig.surveyList[i]
         LogThis(
            log,
            `position=${
               surveyItem.surveyMonkeyPosition - 1
            }; surveyItem=${JSON.stringify(surveyItem, null, 1)}`,
            L0,
         )
         let surveyMonkeyItem =
            surveyMonkeyConfigs.survey.pages[
               surveyItem.surveyMonkeyPosition - 1
            ]

         let survey = new Survey({
            superSurveyId: createdSurveySuperior._id,
            surveyName: surveyItem.surveyName,
            surveyShortName: surveyItem.surveyShortName,
            description: surveyItem.description,
            instructions: surveyItem.instructions,
            surveyMonkeyId: surveyMonkeyItem.id,
            surveyMonkeyPosition: surveyItem.surveyMonkeyPosition,
         })
         surveyCreated = await survey.save()

         surveysCreated.push(surveyCreated)

         let surveyMonkeyQuestions = surveyMonkeyItem.questions
         LogThis(
            log,
            `surveyMonkeyQuestions=${JSON.stringify(
               surveyMonkeyQuestions,
               null,
               1,
            )}`,
            L0,
         )

         for (let x = 0; x < surveyItem.questionList.length; x++) {
            questionItem = surveyItem.questionList[x]
            LogThis(
               log,
               `questionItem.surveyMonkeyPosition.position=${questionItem.surveyMonkeyPosition.position}`,
               L0,
            )

            let monkeyQuestionItem = surveyMonkeyQuestions.find(question => {
               LogThis(
                  log,
                  `questio.position=${question.position}; monkeyPosition=${
                     questionItem.surveyMonkeyPosition.position
                  }; condition=${
                     question.position ==
                     questionItem.surveyMonkeyPosition.position
                  }`,
                  L0,
               )

               return (
                  question.position ==
                  questionItem.surveyMonkeyPosition.position
               )
            })
            LogThis(
               log,
               `monkeyQuestionItem=${JSON.stringify(
                  monkeyQuestionItem,
                  null,
                  1,
               )}`,
               L0,
            )
            if (!monkeyQuestionItem) {
               throw new Error(
                  `Monkey Question Item not found for questionItem=${j(
                     questionItem,
                  )}`,
               )
            }
            let monkeyQuestionDetails = monkeyQuestionItem.details
            let monkeyQuestionId = monkeyQuestionItem.id
            let family = monkeyQuestionDetails.family
            let subtype = monkeyQuestionDetails.subtype
            let monkeyQuestionAnswers = null
            let questionMonkeyPosition = null
            switch (family + '_' + subtype) {
               case 'open_ended_single':
                  monkeyQuestionAnswers = {
                     answerField: 'text',
                     answerChoices: null,
                  }
                  break
               case 'single_choice_menu':
                  questionMonkeyPosition = questionItem.surveyMonkeyPosition
                  if (questionMonkeyPosition.answerType == 'other') {
                     monkeyQuestionAnswers = {
                        answerField: 'text',
                        answerChoices: {
                           id: monkeyQuestionDetails.answers.other.id,
                           value: monkeyQuestionDetails.answers.other.position,
                           realValue: '',
                           score: null,
                        },
                     }
                  } else if (questionMonkeyPosition.answerType == 'noother') {
                     monkeyQuestionAnswers = {
                        answerField: 'choice_id',
                        answerChoices:
                           monkeyQuestionDetails.answers.choices.map(choice => {
                              return {
                                 id: choice.id,
                                 value: choice.position,
                                 realValue: choice.text.trim(),
                                 score: choice.quiz_options.score,
                              }
                           }),
                     }
                  } else {
                     LogThis(
                        log,
                        `Survey monkey position answer type ${questionMonkeyPosition.answerType} is not valid.`,
                        L0,
                     )
                     throw new Error(
                        `Survey monkey position answer type ${questionMonkeyPosition.answerType} is not valid.`,
                     )
                  }
                  break
               case 'single_choice_vertical':
                  questionMonkeyPosition = questionItem.surveyMonkeyPosition
                  if (questionMonkeyPosition.answerType == 'other') {
                     monkeyQuestionAnswers = {
                        answerField: 'text',
                        answerChoices: {
                           id: monkeyQuestionDetails.answers.other.id,
                           value: monkeyQuestionDetails.answers.other.position,
                           realValue: '',
                           score: null,
                        },
                     }
                  } else if (questionMonkeyPosition.answerType == 'noother') {
                     monkeyQuestionAnswers = {
                        answerField: 'choice_id',
                        answerChoices:
                           monkeyQuestionDetails.answers.choices.map(choice => {
                              return {
                                 id: choice.id,
                                 value: choice.position,
                                 realValue: choice.text.trim(),
                                 score: choice.quiz_options.score,
                              }
                           }),
                     }
                  } else {
                     LogThis(
                        log,
                        `Survey monkey position type ${questionMonkeyPosition.answerType} is not valid.`,
                        L0,
                     )
                     throw new Error(
                        `Survey monkey position type ${questionMonkeyPosition.answerType} is not valid.`,
                     )
                  }
                  break
               case 'matrix_rating': // for creating survey from survey monkey
                  {
                     let surveyMonkeyQuestion =
                        monkeyQuestionDetails.answers.rows.find(
                           monkeyQuestion =>
                              questionItem.surveyMonkeyPosition.subPosition ==
                              monkeyQuestion.position,
                        )

                     if (!surveyMonkeyQuestion) {
                        LogThis(
                           log,
                           `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                        )
                        throw new Error(
                           `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                        )
                     }

                     monkeyQuestionId = surveyMonkeyQuestion.id

                     monkeyQuestionAnswers = {
                        answerField: 'choice_id',
                        answerChoices:
                           monkeyQuestionDetails.answers.choices.map(choice => {
                              return {
                                 id: choice.id,
                                 value: choice.position,
                                 realValue: choice.text.trim(),
                                 score: choice.weight,
                              }
                           }),
                     }
                  }
                  break

               case 'multiple_choice_vertical': // for creating survey from survey monkey
                  {
                     let surveyMonkeyQuestion =
                        monkeyQuestionDetails.answers.choices.find(
                           monkeyQuestion =>
                              questionItem.surveyMonkeyPosition.subPosition ==
                              monkeyQuestion.position,
                        )

                     if (!surveyMonkeyQuestion) {
                        LogThis(
                           log,
                           `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                        )
                        throw new Error(
                           `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                        )
                     }

                     monkeyQuestionId = surveyMonkeyQuestion.id

                     monkeyQuestionAnswers = {
                        answerField: 'choice_id',
                        answerChoices: [
                           {
                              id: surveyMonkeyQuestion.id,
                              value: surveyMonkeyQuestion.position,
                              realValue: surveyMonkeyQuestion.text.trim(),
                              score: surveyMonkeyQuestion.quiz_options.score,
                           },
                        ],
                     }
                  }
                  break
               default:
                  LogThis(
                     log,
                     `Family:${family} and subType=${subtype} combination is not valid.`,
                     L0,
                  )
                  throw new Error(
                     `Family:${family} and subType=${subtype} combination is not valid.`,
                  )
            }

            let newQuestion = {
               surveyId: surveyCreated._id,
               question: questionItem.question,
               questionShort: questionItem.questionShort,
               fieldName: questionItem.fieldName,
               weightType: questionItem.weightType,
               weights: questionItem.weights,
               surveyCol: questionItem.surveyCol,
               superSurveyCol: questionItem.superSurveyCol,
               surveyMonkeyId: monkeyQuestionId,
               surveyMonkeyPosition: questionItem.surveyMonkeyPosition,
               surveyMonkeyFamily: monkeyQuestionItem.details.family,
               surveyMonkeySubType: monkeyQuestionItem.details.subtype,
               surveyMonkeyAnswers: monkeyQuestionAnswers,
            }

            // let surveyMonkeyQuestion = surveyMonkeyQuestions[x];
            // LogThis(
            //   log,
            //   `questionItem.question=${JSON.stringify(
            //     questionItem.question
            //   )}; surveyMonkeyQuestion.heading=${
            //     surveyMonkeyQuestion.heading
            //   };surveyMonkeyQuestion=${JSON.stringify(surveyMonkeyQuestion)}`,
            //   L0
            // );
            // newQuestion.surveyMonkeyId = surveyMonkeyQuestion.id;
            // newQuestion.surveyMonkeyPosition = surveyMonkeyQuestion.position;

            // let surveyMonkeyQuestionsDetailsResult = await axios.get(
            //   `https://api.surveymonkey.com/v3/surveys/${createdSurveySuperior.surveyMonkeyId}/pages/${surveyItem.surveyMonkeyId}/questions/${surveyMonkeyQuestion.id}`,
            //   configSurveyMonkey
            // );
            // let surveyMonkeyQuestionsDetails =
            //   surveyMonkeyQuestionsDetailsResult.data;

            // LogThis(
            //   log,
            //   `surveyMonkeyQuestionsDetails=${JSON.stringify(
            //     surveyMonkeyQuestionsDetails
            //   )}`,
            //   L0
            // );
            // newQuestion.surveyMonkeyFamily = surveyMonkeyQuestionsDetails.family;
            // newQuestion.surveyMonkeySubType = surveyMonkeyQuestionsDetails.subtype;

            // switch (surveyMonkeyQuestionsDetails.family) {
            //   case "open_ended":
            //     break;
            //   case "single_choice":
            //     switch (surveyMonkeyQuestionsDetails.subtype) {
            //       case "menu":
            //         if (surveyMonkeyQuestionsDetails.answers.choices ?? false) {
            //           let choices = surveyMonkeyQuestionsDetails.answers.choices;
            //           LogThis(log, `choices=${JSON.stringify(choices)}`, L0);

            //           let choicesFields = choices.map((choice) => {
            //             return {
            //               id: choice.id,
            //               value: choice.position,
            //               realValue: choice.text,
            //               weightedValue: choice.quiz_options.score,
            //             };
            //           });
            //           LogThis(
            //             log,
            //             `choicesFields=${JSON.stringify(choicesFields)}`,
            //             L0
            //           );
            //           newQuestion.surveyMonkeyAnswers = { choices: choicesFields };
            //         }

            //         if (surveyMonkeyQuestionsDetails.answers.other ?? false) {
            //           newQuestion.surveyMonkeyAnswers.other = {
            //             id: surveyMonkeyQuestionsDetails.answers.other.id,
            //             value: surveyMonkeyQuestionsDetails.answers.other.position,
            //             questionText:
            //               surveyMonkeyQuestionsDetails.answers.other.text,
            //           };
            //         }

            //         LogThis(
            //           log,
            //           `newQuestion.surveyMonkeyAnswers=${JSON.stringify(
            //             newQuestion.surveyMonkeyAnswers
            //           )}`,
            //           L0
            //         );
            //         break;
            //       default:
            //         break;
            //     }
            //   default:
            //     break;
            // }

            questions.push(newQuestion)
            LogThis(log, `questions=${JSON.stringify(questions, null, 2)}`, L0)
         }

         //   for (
         //     let x = 0;
         //     surveyItem.calculatedFieldList &&
         //     x < surveyItem.calculatedFieldList.length;
         //     x++
         //   ) {
         //     calculatedFieldItem = surveyItem.calculatedFieldList[x];
         //     calculatedFields;
         //     calculatedFields.push({
         //       surveyId: surveyCreated._id,
         //       description: calculatedFieldItem.description,
         //       shortDescription: calculatedFieldItem.shortDescription,
         //       fieldName: calculatedFieldItem.fieldName,
         //       calculationType: calculatedFieldItem.calculationType,
         //       //isCriteria: calculatedFieldItem.isCriteria,
         //       criteria: calculatedFieldItem.criteria ?? null,
         //       group: calculatedFieldItem.group,
         //       sequence: calculatedFieldItem.sequence,
         //     });
         //   }
         console.log('About to insert many')
         console.log(JSON.stringify(questions))
         questionsCreated = await SurveyQuestion.insertMany(questions)
         questions = []
         // console.log(JSON.stringify(calculatedFields));
         // if (calculatedFields.length > 0) {
         //   calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
         //     calculatedFields
         //   );
         //   calculatedFields = [];
         // }
      } //CLOSE SURVEY LOOP HERE

      // let outputLayouts = superSurveyConfig.surveySuperiorOutputLayout.sort(
      //   (a, b) => a.sequence - b.sequence
      // );
      // LogThis(log, `outputLayouts = ${JSON.stringify(outputLayouts)}`, L3);
      // let outputLayoutFields = [];
      // for (let i = 0; i < outputLayouts.length; i++) {
      //   outputLayout = outputLayouts[i];
      //   outputLayoutFields.push({
      //     surveySuperiorId: createdSurveySuperior._id,
      //     surveyShortName: outputLayout.surveyShortName,
      //     fieldName: outputLayout.fieldName,
      //     outputAsReal: outputLayout.outputAsReal,
      //     showInSurveyOutputScreen: outputLayout.showInSurveyOutputScreen,
      //     sequence: outputLayout.sequence,
      //   });
      // }
      // LogThis(
      //   log,
      //   `outputLayoutFields = ${JSON.stringify(outputLayoutFields)}`,
      //   L3
      // );
      // const createdOutputLayout = await SurveySuperiorOutputLayout.insertMany(
      //   outputLayoutFields
      // );

      // //Start Output Collection
      // let x = 0;
      // x++;
      // const surveyOutputCollectionName =
      //   `surveyOutputs_${superSurveyConfig.surveyShortName}`.toLocaleLowerCase();
      // LogThis(
      //   log,
      //   `x=${x}; surveyOutputCollectionName=${surveyOutputCollectionName}`,
      //   L3
      // );

      // x = x + 1;
      // LogThis(log, `x=${x}`, L3);
      // const collections = await mongoose.connection.db
      //   .listCollections({ name: surveyOutputCollectionName })
      //   .toArray();
      // x = x + 1;
      // LogThis(log, `x=${x}`, L3);
      // const collInfo = collections.find(
      //   (collection) => collection.name === surveyOutputCollectionName
      // );
      // if (collInfo) {
      //   LogThis(log, `dropping surveyOutputCollectionName`, L3);
      //   let surveyOutputCollection = await mongoose.connection.collection(
      //     surveyOutputCollectionName
      //   );

      //   await surveyOutputCollection.drop();

      //   LogThis(log, `dropped surveyOutputCollectionName`, L3);

      //   delete mongoose.models[surveyOutputCollectionName];
      //   LogThis(log, `deleted models`, L3);
      // }
      // x = x + 1;
      // LogThis(log, `x=${x}`, L3);

      // let surveyOutputColumns = {};

      // outputLayoutFields.forEach((column) => {
      //   LogThis(log, `output Layout Field column=${JSON.stringify(column)}`, L3);
      //   switch (column.fieldName) {
      //     case "SCOLINFO_date_created":
      //       surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.Date;
      //       break;
      //     case "SCOLINFO_date_modified":
      //       surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.Date;
      //       break;
      //     default:
      //       surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.String;
      //   }
      // });
      // x = x + 1;
      // LogThis(
      //   log,
      //   `x=${x}; surveyOutputColumns=${JSON.stringify(
      //     Object.entries(surveyOutputColumns)
      //   )}`,
      //   L3
      // );

      // const surveyOutputCollectionSchema = new Schema(surveyOutputColumns);
      // x = x + 1;
      // LogThis(log, `x=${x}`, L3);
      // const surveyOutputCollection = mongoose.model(
      //   surveyOutputCollectionName,
      //   surveyOutputCollectionSchema
      // );

      // saveDynamicModelToDB(surveyOutputCollectionName, surveyOutputColumns);

      // // await DynamicCollection.deleteOne({
      // //   collectionName: surveyOutputCollectionName,
      // // });

      // // const schemaDefinition = {
      // //   field1: String,
      // //   field2: Number,
      // //   // Add more fields as needed
      // // };
      // // const dynamicCollection = new DynamicCollection();
      // // dynamicCollection.collectionName = surveyOutputCollectionName;
      // // dynamicCollection.schemaDefinition = schemaDefinition;

      // // const createdDynamicCollection = await dynamicCollection.save();
      // // if (!createdDynamicCollection) {
      // //   throw new Error(`DynamicCollection couldn't be created`);
      // // }

      // x = x + 1;
      // LogThis(log, `x=${x}`, L3);

      res.status(201).json({
         surveySuperiorId: createdSurveySuperior._id,
         surveysCreated: surveysCreated,
         questionsCreated: questionsCreated,
         // createdOutputLayout: createdOutputLayout,
         // surveyOutputCollectionSchema: surveyOutputCollectionSchema,
      })
   },
)

const testSurveyMonkey = asyncHandler(async (req, res) => {
   const functionName = 'superSurveyCreateConfig'
   const log = new LoggerSettings(srcFileName, functionName)
   const { superSurveyConfig } = req.body
   let ownerId = req.user._id
   const surveyMonkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

   if (!surveyMonkeyToken || surveyMonkeyToken == '') {
      throw new Error(`Survey Monkey token not found.`)
   }

   const configSurveyMonkey = {
      //responseType: "arraybuffer",
      headers: {
         //"Content-Type": "multipart/form-data",
         Authorization: `Bearer ${surveyMonkeyToken}`,
         Accept: 'application/json',
      },
   }

   const surveysResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys`,
      configSurveyMonkey,
   )
   const surveys = surveysResult.data.data
   LogThis(log, `surveys=${JSON.stringify(surveys)}`, L0)

   res.status(201).json({
      surveys: surveys,
   })
})

const surveyMonkeyWebhookCreatedEvent = asyncHandler(async (req, res) => {
   const functionName = 'surveyMonkeyWebhookCreatedEvent'
   const log = new LoggerSettings(srcFileName, functionName)

   LogThis(log, `START`, L0)
   LogThis(log, `req.headers=${JSON.stringify(req.headers, null, 2)}`, L0)
   const bd = req.body
   LogThis(
      log,
      `name=${bd.name}; event_type=${bd.event_type}; object_id=${bd.object_id}`,
      L0,
   )

   LogThis(log, `resources=${JSON.stringify(bd.resources, null, 2)}`, L0)

   LogThis(log, `Event Happened`, L0)

   res.status(200).end()
})

const surveyMonkeyWebhookCompletedEvent = asyncHandler(async (req, res) => {
   const functionName = 'surveyMonkeyWebhookCompletedEvent'
   const log = new LoggerSettings(srcFileName, functionName)

   try {
      LogThis(log, `START`, L0)
      LogThis(log, `req.headers=${JSON.stringify(req.headers, null, 2)}`, L0)
      const bd = req.body
      LogThis(
         log,
         `name=${bd.name}; event_type=${bd.event_type}; object_id=${bd.object_id}`,
         L0,
      )

      LogThis(log, `resources=${JSON.stringify(bd.resources, null, 2)}`, L0)
      const resources = bd.resources

      const superSurveyFound = await SurveySuperior.findOne({
         surveyMonkeyId: resources.survey_id,
      }).lean()

      if (!superSurveyFound) {
         throw new Error(
            `Monkey webhook: survey_id ${resources.survey_id} of respondent ${resources.respondent_id} not found`,
         )
      }
      LogThis(
         log,
         `superSurveyFound=${JSON.stringify(superSurveyFound, null, 1)}`,
         L0,
      )
      const superSurvey = superSurveyFound
      let newResponseFound = await SurveyMonkeyNewResponse.findOne({
         respondent_id: resources.respondent_id,
         surveyMonkeyId: resources.survey_id,
      })
      //let newResponse = null;
      if (newResponseFound) {
         //newResponse = newResponseFound[0];
         LogThis(
            log,
            `updating respondent, status=${SURVEY_PROCESS_STATUS.UPDATED}`,
            L0,
         )
         newResponseFound.event_type = bd.event_type
         newResponseFound.event_datetime = bd.event_datetime
         newResponseFound.process_status = SURVEY_PROCESS_STATUS.UPDATED
      } else {
         LogThis(log, `creating respondent`, L0)
         LogThis(
            log,
            `resources.event_datetime=${
               bd.event_datetime
            }; date converted=${new Date(bd.event_datetime)}; status=${
               SURVEY_PROCESS_STATUS.NEW
            }`,
            L0,
         )
         newResponseFound = new SurveyMonkeyNewResponse({
            surveyMonkeyId: resources.survey_id,
            respondent_id: resources.respondent_id,
            event_type: bd.event_type,
            event_datetime: bd.event_datetime,
            process_status: SURVEY_PROCESS_STATUS.NEW,
         })
      }

      await newResponseFound.save()

      LogThis(log, `Event Happened`, L0)

      res.status(200).end()
   } catch (error) {
      LogThis(log, `Error found: ${error.message}`, L0)
      res.status(200).end()
   }
})

const getSurveyMonkeyResponses = asyncHandler(async (req, res) => {
   const functionName = 'updateSurveyMonkeyConfigs'
   const log = new LoggerSettings(srcFileName, functionName)
   //const { superSurveyConfig } = req.body;
   //let ownerId = req.user._id;

   //const paramTest = req.params.id;
   const superSurveyId = req.params.id

   LogThis(log, `START superSurveyId=${superSurveyId}`, L0)
   const surveyMonkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

   if (!surveyMonkeyToken || surveyMonkeyToken == '') {
      throw new Error(`Survey Monkey token not found.`)
   }

   const configSurveyMonkey = {
      //responseType: "arraybuffer",
      headers: {
         //"Content-Type": "multipart/form-data",
         Authorization: `Bearer ${surveyMonkeyToken}`,
         Accept: 'application/json',
      },
   }

   let superSurvey = await SurveySuperior.findOne({
      surveySuperiorId: superSurveyId,
   })

   if (superSurvey.surveyMonkeyId == '') {
      //Start getting survey monkey configs
      const surveysResult = await axios.get(
         `https://api.surveymonkey.com/v3/surveys`,
         configSurveyMonkey,
      )
      const surveys = surveysResult.data.data
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
   const surveyMonkeyId = superSurvey.surveyMonkeyId

   await SurveyMonkeyConfig.deleteOne({ surveyMonkeyId: surveyMonkeyId })

   //Start getting survey monkey configs
   const surveyInfoResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}`,
      configSurveyMonkey,
   )

   const surveyInfo = surveyInfoResult.data

   const surveyMonkeyInfo = { survey: {} }

   surveyMonkeyInfo.survey.title = surveyInfo.title
   surveyMonkeyInfo.survey.category = surveyInfo.category
   surveyMonkeyInfo.survey.question_count = surveyInfo.question_count
   surveyMonkeyInfo.survey.page_count = surveyInfo.page_count
   surveyMonkeyInfo.survey.date_created = surveyInfo.date_created
   surveyMonkeyInfo.survey.date_modified = surveyInfo.date_modified
   surveyMonkeyInfo.survey.id = surveyInfo.id

   LogThis(
      log,
      `surveyMonkeyInfo=${JSON.stringify(surveyMonkeyInfo, null, 2)}`,
      L0,
   )

   //Start getting survey monkey configs
   const pagesResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages`,
      configSurveyMonkey,
   )

   const pages = pagesResult.data.data

   LogThis(log, `pages=${JSON.stringify(pages, null, 2)}`, L0)

   for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      page = pages[pageIndex]
      //Start getting survey monkey configs
      let questionsResult = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions`,
         configSurveyMonkey,
      )
      let questions = questionsResult.data.data

      LogThis(log, `questions=${JSON.stringify(questions, null, 2)}`, L0)
      page.questions = questions

      for (
         let questionIndex = 0;
         questionIndex < questions.length;
         questionIndex++
      ) {
         let question = page.questions[questionIndex]

         let questionDetailsResult = await axios.get(
            `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions/${question.id}`,
            configSurveyMonkey,
         )

         let questionDetails = questionDetailsResult.data

         LogThis(
            log,
            `questionDetails=${JSON.stringify(questionDetails, null, 2)}`,
            L0,
         )
         question.details = questionDetails
      }
   }

   surveyMonkeyInfo.survey.pages = pages
   const surveyMonkeyConfig = new SurveyMonkeyConfig({
      superSurveyId: superSurveyId,
      surveyMonkeyId: surveyMonkeyId,
      survey: surveyMonkeyInfo.survey,
   })

   LogThis(
      log,
      `surveyMonkeyInfo=${JSON.stringify(surveyMonkeyInfo, null, 2)}`,
      L0,
   )

   const surveyMonkeyConfigSaved = await surveyMonkeyConfig.save()
   if (!surveyMonkeyConfigSaved) {
      res.status(401).json({
         surveyMonkeyInfo: surveyMonkeyInfo,
      })
      throw new Error('Error saving Survey Monkey Config into database.')
   } else {
      res.status(201).json({
         surveyMonkeyInfo: surveyMonkeyInfo,
      })
   }
})

const updateSurveyMonkeyConfigs = asyncHandler(async (req, res) => {
   const functionName = 'updateSurveyMonkeyConfigs'
   const log = new LoggerSettings(srcFileName, functionName)
   //const { superSurveyConfig } = req.body;
   //let ownerId = req.user._id;

   //const paramTest = req.params.id;
   const superSurveyId = req.params.id

   LogThis(log, `START superSurveyId=${superSurveyId}`, L0)
   const surveyMonkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN

   if (!surveyMonkeyToken || surveyMonkeyToken == '') {
      throw new Error(`Survey Monkey token not found.`)
   }

   const configSurveyMonkey = {
      //responseType: "arraybuffer",
      headers: {
         //"Content-Type": "multipart/form-data",
         Authorization: `Bearer ${surveyMonkeyToken}`,
         Accept: 'application/json',
      },
   }

   let superSurvey = await SurveySuperior.findOne({
      surveySuperiorId: superSurveyId,
   })

   if (superSurvey.surveyMonkeyId == '') {
      //Start getting survey monkey configs
      const surveysResult = await axios.get(
         `https://api.surveymonkey.com/v3/surveys`,
         configSurveyMonkey,
      )
      const surveys = surveysResult.data.data
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
   const surveyMonkeyId = superSurvey.surveyMonkeyId

   //Start getting survey monkey configs
   const surveyInfoResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}`,
      configSurveyMonkey,
   )

   const surveyInfo = surveyInfoResult.data

   const surveyMonkeyInfo = { survey: {} }

   surveyMonkeyInfo.survey.title = surveyInfo.title
   surveyMonkeyInfo.survey.category = surveyInfo.category
   surveyMonkeyInfo.survey.question_count = surveyInfo.question_count
   surveyMonkeyInfo.survey.page_count = surveyInfo.page_count
   surveyMonkeyInfo.survey.date_created = surveyInfo.date_created
   surveyMonkeyInfo.survey.date_modified = surveyInfo.date_modified
   surveyMonkeyInfo.survey.id = surveyInfo.id

   LogThis(
      log,
      `surveyMonkeyInfo=${JSON.stringify(surveyMonkeyInfo, null, 2)}`,
      L0,
   )

   //Start getting survey monkey configs
   const pagesResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages`,
      configSurveyMonkey,
   )

   const pages = pagesResult.data.data

   LogThis(log, `pages=${JSON.stringify(pages, null, 2)}`, L0)

   for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      page = pages[pageIndex]
      //Start getting survey monkey configs
      let questionsResult = await axios.get(
         `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions`,
         configSurveyMonkey,
      )
      let questions = questionsResult.data.data

      LogThis(log, `questions=${JSON.stringify(questions, null, 2)}`, L0)
      page.questions = questions

      for (
         let questionIndex = 0;
         questionIndex < questions.length;
         questionIndex++
      ) {
         let question = page.questions[questionIndex]

         let questionDetailsResult = await axios.get(
            `https://api.surveymonkey.com/v3/surveys/${surveyMonkeyId}/pages/${page.id}/questions/${question.id}`,
            configSurveyMonkey,
         )

         let questionDetails = questionDetailsResult.data

         LogThis(
            log,
            `questionDetails=${JSON.stringify(questionDetails, null, 2)}`,
            L0,
         )
         question.details = questionDetails
      }
   }

   surveyMonkeyInfo.survey.pages = pages
   const surveyMonkeyConfig = new SurveyMonkeyConfig({
      superSurveyId: superSurveyId,
      surveyMonkeyId: surveyMonkeyId,
      survey: surveyMonkeyInfo.survey,
   })

   LogThis(
      log,
      `surveyMonkeyInfo=${JSON.stringify(surveyMonkeyInfo, null, 2)}`,
      L0,
   )

   await SurveyMonkeyConfig.deleteOne({ surveyMonkeyId: surveyMonkeyId })
   const surveyMonkeyConfigSaved = await surveyMonkeyConfig.save()
   if (!surveyMonkeyConfigSaved) {
      res.status(401).json({
         surveyMonkeyInfo: surveyMonkeyInfo,
      })
      throw new Error('Error saving Survey Monkey Config into database.')
   } else {
      res.status(201).json({
         surveyMonkeyInfo: surveyMonkeyInfo,
      })
   }
})

// @desc    Upload Answers to a Super Survey
// @route   PUT /api/surveys/:id
// @access  Private/Admin
const superSurveyUploadAnswers = asyncHandler(async (req, res) => {
   try {
      const functionName = 'superSurveyUploadAnswers'
      const log = new LoggerSettings(srcFileName, functionName)

      LogThis(log, `START`)

      await SurveyResponse.deleteMany({})
      await SurveyCalculatedValue.deleteMany({})

      const superSurveyId = req.params.id
      LogThis(log, `superSurveyId=${superSurveyId}`, L3)
      const user = req.user
      //const owner = req.user._id;
      const owner = '62e551baf5c6b51f61e0ef93'

      // Access the uploaded file
      const fileDataZip = req.files['fileNumeric'][0]
      const fileDataRealZip = req.files['fileReal'][0]
      if (!fileDataZip) {
         throw Error('No fileNumeric received')
      }

      if (!fileDataRealZip) {
         throw Error('No fileReal received')
      }
      if (!fileDataZip.buffer) {
         throw Error('fileNumeric does not have buffer')
      }

      if (!fileDataRealZip.buffer) {
         throw Error('fileReal does not have buffer')
      }

      const zipNumeric = new AdmZip(fileDataZip.buffer)
      const zipReal = new AdmZip(fileDataRealZip.buffer)

      const fileData = zipNumeric.readFile('fileNumeric.csv').toString('utf8')
      const fileDataReal = zipReal.readFile('fileReal.csv').toString('utf8')

      if (!fileData) {
         throw Error('fileNumeric was not unzipped properly')
      }

      if (!fileDataReal) {
         throw Error('fileReal was not unzipped properly')
      }

      const answersData = fileData

      LogThis(log, `answersData=${answersData}`)

      const answersDataReal = fileDataReal
      LogThis(log, `answersDataReal=${answersDataReal}`)

      let answersRows = answersData.replace(/\r/g, '').split('\n')
      answersRows.shift()
      answersRows.shift()

      let answersRealRows = answersDataReal.replace(/\r/g, '').split('\n')
      answersRealRows.shift()
      answersRealRows.shift()

      //STARTING LOGIC TO SAVE ANSWERS TO DATABASE
      /**
       * Get the Super Survey and the list of its Surveys
       */
      //LogThis(log, `answerRows=${answersRows}`);
      console.log(`Getting multi surveys`)
      let multiSurveys = await SurveyMulti.find({
         superSurveyId: superSurveyId,
         owner: owner,
      })
         .select('surveyId sequence')
         .sort({ sequence: 1 })
         .lean()

      if (!multiSurveys) {
         res.status(404)
         throw new Error('Multi Surveys not found')
      }

      const surveyIdsList = []

      multiSurveys.map(multiSurveyItem => {
         surveyIdsList.push(multiSurveyItem.surveyId)
      })
      console.log(
         `Mapping multi surveys surveysIdsList=${JSON.stringify(
            surveyIdsList,
         )}`,
      )

      LogThis(log, `surveyIdsList=${surveyIdsList}`, L2)

      const questions = await SurveyQuestion.find({
         surveyId: { $in: surveyIdsList },
      })
         .populate('surveyId')
         .sort({ superSurveyCol: 1 })
         .lean()

      LogThis(log, `resultset questions=${JSON.stringify(questions)}`, L3)

      const calculatedFields = await SurveyCalculatedField.find({
         surveyId: { $in: surveyIdsList },
      })
         .populate('surveyId')
         .lean()

      LogThis(
         log,
         `Calculated Fields Found: calculatedFields=${JSON.stringify(
            calculatedFields,
         )};`,
      )

      const surveyResponses = []

      const calculatedValues = []

      let allSurveyQuestions = []
      let allCalculatedFields = []
      console.log(`Getting questions per survey`)
      surveyIdsList.map(surveyId => {
         let surveyQuestions = questions
            .filter(
               question =>
                  question.surveyId._id.toString() === surveyId.toString(),
            )
            .sort((a, b) => a.superSurveyCol - b.superSurveyCol)

         allSurveyQuestions = [...allSurveyQuestions, ...surveyQuestions]

         let surveyCalculatedFields = calculatedFields
            .filter(
               calculatedField =>
                  calculatedField.surveyId._id.toString() ===
                  surveyId.toString(),
            )
            .sort((a, b) => a.sequence - b.sequence)

         allCalculatedFields = [
            ...allCalculatedFields,
            ...surveyCalculatedFields,
         ]
      })

      LogThis(log, `calculatedFields=${JSON.stringify(allSurveyQuestions)};`)

      LogThis(
         log,
         `Filtered calculated fields allCalculatedFields=${JSON.stringify(
            allCalculatedFields,
         )};`,
      )

      let questionDesc = ''
      let questionShortDesc = ''
      let csv = ''
      console.log(`Mapping Questions`)
      questions.map(q => {
         questionDesc = questionDesc + q.question + ','
         questionShortDesc = questionShortDesc + q.questionShort + ','
      })

      allCalculatedFields.map(c => {
         questionDesc = questionDesc + c.description + ','
         questionShortDesc = questionShortDesc + c.shortDescription + ','
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
      //console.log(`Processing rows`);
      for (let r = 0; r < answersRows.length; r++) {
         //console.log(`Processing row ${r + 1}`);
         LogThis(
            log,
            `Processing Row r=${r}; allSurveyQuestions length=${allSurveyQuestions.length}`,
         )
         rowClean = rowCleaner(answersRows[r])
         answers = rowClean.split(',')

         rowRealClean = rowCleaner(answersRealRows[r])
         answersReal = rowRealClean.split(',')

         LogThis(log, `answers=${answers}`)
         if (answers[0] == '' || answers[0].trim() == '') {
            break
         }

         respondentId = answers[0].trim()
         let row = r + 1
         for (let a = 0; a < allSurveyQuestions.length; a++) {
            LogThis(log, `processing question a=${a}`)
            // LogThis(
            //   log,
            //   `row=${row}; allSurveyQuestions[a]._id=${allSurveyQuestions[a]._id}; answers[a]=${answers[a]}`
            // );
            let surveyQuestion = allSurveyQuestions[a]
            //transform the question answer value into the weighted answer for that Survey.
            let weightedResponse = null
            let response = null
            let isWeighted = null
            // LogThis(
            //   log,
            //   `surveyQuestion=${JSON.stringify(
            //     surveyQuestion
            //   )};surveyQuestion.weights=${JSON.stringify(surveyQuestion.weights)}`
            // );

            if (
               surveyQuestion.weights &&
               Object.keys(surveyQuestion.weights).length >
                  0 /*&& surveyQuestion.weights.length > 0*/
            ) {
               // LogThis(
               //   log,
               //   `weighting: answers[${a}]=${
               //     answers[a]
               //   };surveyQuestion.weights=${JSON.stringify(
               //     surveyQuestion.weights
               //   )}; weightedValue=${
               //     surveyQuestion.weights[
               //       answers[a].toString().trim().replace(/'\n'/g, "")
               //     ]
               //   }`
               // );
               let answerA = answers[a].toString().trim().replace(/'\n'/g, '')
               if (answerA == '') {
                  answerA = '0'
               }
               weightedResponse = surveyQuestion.weights[answerA]
               if (!weightedResponse) {
                  weightedResponse = '0'
               }
               response = answerA
               answers[a] = weightedResponse
               isWeighted = true
               LogThis(log, `final weight: answer=${weightedResponse}`)
            } else {
               let answerA = answers[a]
               if (answerA == '') {
                  answerA = '0'
               }
               response = answerA
               weightedResponse = answerA
               isWeighted = false
               LogThis(log, `no weighted: answer=${weightedResponse}`)
            }

            surveyResponses.push({
               questionId: surveyQuestion._id,
               respondentId: respondentId,
               row: row,
               col: a + 1,
               response: response,
               responseReal: answersReal[a],
               weightedResponse: weightedResponse,
               isWeighted: isWeighted,
            })

            if (isWeighted) {
               LogThis(
                  log,
                  `Adding csv weighted answer: weightedResponse=${weightedResponse}`,
               )
               weightedResponse = weightedResponse ?? ''
               csv = csv + weightedResponse.toString() + ','
            } else {
               csv = csv + response.toString() + ','
            }
         }

         LogThis(log, `surveyResponse cycle=${JSON.stringify(surveyResponses)}`)
         //console.log(`surveyResponses=${surveyResponses}`);

         for (let a = 0; a < allCalculatedFields.length; a++) {
            // LogThis(
            //   log,
            //   `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}; answers[a]=${answers[a]}`
            // );
            LogThis(
               log,
               `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}}`,
            )
            //let col = a + 1
            allCalculatedField = allCalculatedFields[a]
            let value = null
            if (allCalculatedField.isCriteria) {
               let criteria = allCalculatedField.criteria
               LogThis(
                  log,
                  `Criteria in Question: criteria=${JSON.stringify(criteria)}`,
               )
               let fieldNameValue = allCalculatedFields.find(calField => {
                  LogThis(log, `calField=${JSON.stringify(calField)}`)
                  return calField.fieldName == criteria.fieldNameValue[0]
               })
               LogThis(log, `fieldNameValue1=${JSON.stringify(fieldNameValue)}`)
               let sequence = fieldNameValue.sequence
               calValue = calculatedValues.find(
                  value => value.col == sequence && value.row == row,
               )
               LogThis(
                  log,
                  `About to get into case > calValue=${JSON.stringify(
                     calValue,
                  )}; criteria.operator=${JSON.stringify(criteria.operator)}`,
               )
               switch (criteria.operator) {
                  case '>':
                     LogThis(
                        log,
                        `Inside case: calValue.value=${calValue.value};criteria.value=${criteria.value};criteria.resultIfTrue=${criteria.resultIfTrue}`,
                     )
                     if (calValue.value > criteria.value) {
                        value = criteria.resultIfTrue
                        LogThis(log, `Creteria is true: value=${value}`)
                     } else {
                        value = criteria.resultIfFalse
                        LogThis(log, `Creteria is false: value=${value}`)
                     }
                     break
                  default:
                     value = null
                     LogThis(log, `Case entered default: value${value}`)
               }
            } else {
               // LogThis(
               //   log,
               //   `Field is not criteria: allCalculatedField=${JSON.stringify(
               //     allCalculatedField
               //   )}`
               // );

               let groups = allCalculatedField.group
               groups.map(group => {
                  // LogThis(
                  //   log,
                  //   ` row=${row}; col=${a + 1}; group=${group} answers[group]=${
                  //     answers[group]
                  //   }; parseInt(answers[group])=${parseInt(answers[group])}`
                  // );

                  value = value + parseInt(answers[group])
               })
            }
            LogThis(
               log,
               `Pushing value: calculatedFieldId=${
                  allCalculatedFields[a]._id
               }; row=${row};col=${a + 1}; value=${value}; `,
            )
            if (typeof value != 'number' || value == null || isNaN(value)) {
               value = -1000
            }
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
      } //This bracket

      //LogThis(log, `surveyResponses=${JSON.stringify(surveyResponses)}`);
      LogThis(log, `Inserting responses`)
      const surveyResponseCreated = await SurveyResponse.insertMany(
         surveyResponses,
      )

      LogThis(log, `calculatedValues=${JSON.stringify(calculatedValues)}`)
      LogThis(log, `Inserting calculatedValues`)
      const surveyCalculatedValuesCreated =
         await SurveyCalculatedValue.insertMany(calculatedValues)

      const outputLayoutsResult = await SurveySuperiorOutputLayout.find({
         surveySuperiorId: superSurveyId,
      }).sort({ sequence: 1 })

      // // questions;
      // // calculatedFields;
      // // surveyResponses;
      // // calculatedValues;
      //LogThis(log, `outputLayoutsResult=${JSON.stringify(outputLayoutsResult)}`);
      LogThis(log, `buildOutputHeaders`)
      console.log(`Building output headers`)
      const outputLayout = buildOutputHeaders(
         questions,
         calculatedFields,
         outputLayoutsResult,
      )

      LogThis(log, `outputLayouts=${JSON.stringify(outputLayout)}`, L3)

      let csvLayout = ''
      let layout = null
      for (let o = 0; o < outputLayout.length - 1; o++) {
         layout = outputLayout[o]
         csvLayout = csvLayout + layout.description + ','
      }
      layout = outputLayout[outputLayout.length - 1]
      csvLayout = csvLayout + layout.description + '\n'

      for (let o = 0; o < outputLayout.length - 1; o++) {
         layout = outputLayout[o]
         csvLayout = csvLayout + layout.shortDescription + ','
      }
      layout = outputLayout[outputLayout.length - 1]
      csvLayout = csvLayout + layout.shortDescription + '\n'

      const cols = []
      console.log(`Mapping colummns to Layout`)
      for (let o = 0; o < outputLayout.length; o++) {
         layout = outputLayout[o]
         LogThis(
            log,
            `layout.fieldId=${layout.fieldId}; layout.isCalculated=${layout.isCalculated}`,
         )
         if (layout.isCalculated) {
            LogThis(log, `layout.isCalculated=${layout.isCalculated}`)
            cols.push(
               calculatedValues
                  .filter(val => val.calculatedFieldId == layout.fieldId)
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
         `cols=${JSON.stringify(cols)}; outputLayout=${JSON.stringify(
            outputLayout,
         )}`,
      )

      //console.log(`cols=${JSON.stringify(cols)}`);
      let value = null
      LogThis(
         log,
         `cols Length=${cols.length}; rows length=${cols[0].length}; outputLayout Length=${outputLayout.length}`,
      )
      console.log(`Getting values for the columns in the layout`)
      for (let r = 0; r < cols[0].length; r++) {
         //LogThis(log, `Current Row length=${cols[r].length}`);
         for (let c = 0; c < cols.length - 1; c++) {
            layout = outputLayout[c]
            LogThis(log, `Processing Col=${c}; row=${r}`)
            //console.log(`Processing Col=${c}; row=${r}`);
            value = cols[c][r]
            LogThis(log, `value cycle=${JSON.stringify(value)}`)
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
            LogThis(log, `value=${value}`)
            csvLayout = csvLayout + value + ','
         }
         LogThis(
            log,
            `Processing Last Col=${outputLayout.length - 1}; row=${r}`,
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
         LogThis(log, `value=${value}`)
         csvLayout = csvLayout + value + '\n'
      }
      console.log(`Output layout is ready`)

      if (!questions) {
         res.status(404)
         throw new Error('Questions not found')
      }
      //Form the CSV output file

      //ENDING LOGIC TO SAVE ANSWERS TO DATABASE
      // console.log(
      //   `csvLayout.length=${csvLayout.length}; csvLayout=${csvLayout} `
      // );
      if (csvLayout && csvLayout.length > 0) {
         //if (true) {
         // LogThis(log, `END`);
         // // res.status(200).json({
         // //   // owner: user._id,
         // //   // superSurveyId: superSurveyId,
         // //   // multiSurveys: multiSurveys,
         // //   // surveyIdsList: surveyIdsList,
         // //   // allSurveyQuestions: allSurveyQuestions,
         // //   // surveyResponseCreated: surveyResponseCreated,
         // //   // surveyCalculatedValuesCreated: surveyCalculatedValuesCreated,
         // //   // answerRowsLength: answersRows.length,
         // //   // //questions: questions,
         // //   // answersRows: answersRows,
         // //   csv: csv,
         // // });
         // //console.log(csv);
         // LogThis(log, `csvLayoutEnd=${csvLayout}`);
         // // LogThis(
         // //   log,
         // //   `superSurveyId=${superSurveyId}; surveyFields=${JSON.stringify(
         // //     surveyFields
         // //   )}`
         // // );
         // // res.writeHead(200, {
         // //   "Content-Type": "text/plain",
         // //   "Content-Length": Buffer.byteLength(csv),
         // // });
         // // res.write(csv);
         // // res.end();
         // // res.writeHead(200, {
         // //   "Content-Type": "text/plain",
         // //   "Content-Length": Buffer.byteLength(csvLayout),
         // // });
         // // //res.write("Data Numeric next: \n");
         // // res.write(csvLayout);
         // // // res.write("\nData Real next:\n");
         // // // res.write(fileDataReal);
         // // res.end();

         // //Returning zip file using archiver
         // res.setHeader("Content-Type", "application/zip");
         // res.setHeader(
         //   "Content-Disposition",
         //   'attachment; filename="OutputReport.zip"'
         // );
         // const archive = archiver("zip", {
         //   zlib: { level: 9 },
         // });
         // archive.append(csvLayout, { name: "OutputReport.csv" });
         // archive.pipe(res);
         // console.log(`About to send the zip file back to the client`);
         // archive.finalize();

         // //Returning zip file using AdmZip
         // const zip = new AdmZip();

         // zip.addFile("OutputReport.csv", Buffer.from(csvLayout, "utf8"));

         // const outputReport = zip.toBuffer();
         // res.setHeader("Content-Type", "application/zip");
         // res.setHeader(
         //   "Content-Disposition",
         //   'attachment; filename="OutputReport.zip"'
         // );
         // console.log(
         //   `About to return outputReport as Buffer outputReport=${outputReport}`
         // );
         // //const text = new TextDecoder().decode(outputReport);
         // //console.log(`outputReport=${text}`);
         // res.send(outputReport);

         // //Returning zip file using AdmZip octet-stream and encoding with base64
         // const zip = new AdmZip();
         // zip.addFile("OutputReport.csv", Buffer.from(csvLayout, "utf8"));

         // const outputReport = zip.toBuffer();

         // const binaryOutputReport = Buffer.from(outputReport, "utf8");
         // const outputReport64 = binaryOutputReport.toString("base64");
         // res.setHeader("Content-Type", "application/octet-stream");
         // res.setHeader(
         //   "Content-Disposition",
         //   'attachment; filename="OutputReport.bin"'
         // );
         // //res.setHeader("Content-Transfer-Encoding", "base64");

         // console.log(`About to log the outputReport base64`);
         // //const text = new TextDecoder().decode(outputReport64);
         // //console.log(`outputReport=${text}`);
         // res.status(200).send(Buffer.from(outputReport64, "base64"));

         //Return zip file as application/zip but encoding it as Base64 string
         const zip = new AdmZip()

         zip.addFile('OutputReport.csv', Buffer.from(csvLayout, 'utf8'))

         const zipBuffer = zip.toBuffer()

         console.log(
            `zipBuffer=${zipBuffer}; toStringBase64=${zipBuffer.toString(
               'base64',
            )}; toStringUtf8=${zipBuffer.toString('utf8')} `,
         )

         const zipStr64 = Buffer.from(zipBuffer).toString('base64')
         const zipBuffer64 = Buffer.from(zipStr64, 'base64')

         res.setHeader('Content-Type', 'application/zip')

         res.setHeader(
            'Content-Disposition',
            'attachment; filename="OutputReport.zip"',
         )

         res.status(200).send(zipBuffer64.toString('base64'))
      } else {
         throw new Error('csv file does not have any values')
      }
   } catch (error) {
      res.status(404)
      throw new Error(error)
   }
})

const superSurveyTests = asyncHandler(async (req, res) => {
   try {
      //Basics investigation

      res.setHeader('Content-Type', 'application/zip')
      res.setHeader(
         'Content-Disposition',
         'attachment; filename="OutputReport.zip"',
      )
      //res.setHeader("Content-Transfer-Encoding", "base64");
      const str = 'A'
      console.log(`str=${str}`)

      const strBufferUtf8 = Buffer.from(str, 'utf8')

      console.log(
         `strBufferUtf8=${strBufferUtf8}; toStringBase64=${strBufferUtf8.toString(
            'base64',
         )}; toStringUtf8=${strBufferUtf8.toString('utf8')}`,
      )

      const strBase64 = Buffer.from(str).toString('base64')
      const strBufferBase64 = Buffer.from(strBase64, 'base64')

      console.log(
         `strBufferBase64=${strBufferBase64}; toStringBase64=${strBufferBase64.toString(
            'base64',
         )}; toStringUtf8=${strBufferBase64.toString('utf8')} `,
      )

      const strBinary = Buffer.from(str, 'binary')
      console.log(
         `strBinary=${strBinary}; toStringBase64=${strBinary.toString(
            'base64',
         )}; toStringUtf8=${strBinary.toString('utf8')} `,
      )

      const zip = new AdmZip()

      zip.addFile('OutputReport.csv', Buffer.from(str, 'utf8'))

      const zipBuffer = zip.toBuffer()

      console.log(
         `zipBuffer=${zipBuffer}; toStringBase64=${zipBuffer.toString(
            'base64',
         )}; toStringUtf8=${zipBuffer.toString('utf8')} `,
      )

      const zipStr64 = Buffer.from(zipBuffer).toString('base64')
      const zipBuffer64 = Buffer.from(zipStr64, 'base64')
      //str = Buffer.from(strBufferBase64, "base64").toString("utf-8");
      //console.log(`base64 decoded str=${str}`);
      res.status(200).send(zipBuffer64.toString('base64'))
   } catch (error) {
      throw new Error(error)
   }
})

const getSuperSurveyConfigs = asyncHandler(async (req, res) => {
   try {
      const functionName = 'getSuperSurveyConfigs'
      const log = new LoggerSettings(srcFileName, functionName)

      LogThis(log, `START BY user=${req.user.email}`, L1)

      const superSurveyId = req.params.id
      LogThis(log, `superSurveyId=${superSurveyId}`, L3)
      const user = req.user
      //const owner = req.user._id;
      //const owner = "62e551baf5c6b51f61e0ef93";

      console.log(`Getting multi surveys`)
      let multiSurveys = await Survey.find({
         superSurveyId: superSurveyId,
      })
         .sort({ surveyMonkeyPosition: 1 })
         .lean()

      if (!multiSurveys) {
         res.status(404)
         throw new Error('Multi Surveys not found')
      }

      const surveyIdsList = []

      multiSurveys.map(multiSurveyItem => {
         surveyIdsList.push(multiSurveyItem._id)
      })
      LogThis(
         log,
         `Mapping multi surveys surveysIdsList=${JSON.stringify(
            surveyIdsList,
         )}`,
         L3,
      )

      LogThis(log, `surveyIdsList=${surveyIdsList}`, L2)

      const questions = await SurveyQuestion.find({
         surveyId: { $in: surveyIdsList },
      })
         .populate('surveyId')
         .sort({ superSurveyCol: 1 })
         .lean()
      //return questions.
      LogThis(log, `resultset questions=${JSON.stringify(questions)}`, L3)

      const calculatedFields = await SurveyCalculatedField.find({
         surveyId: { $in: surveyIdsList },
      })
         .populate('surveyId')
         .lean()
      //return calculatedFields
      LogThis(
         log,
         `Calculated Fields Found: calculatedFields=${JSON.stringify(
            calculatedFields,
         )};`,
      )

      const outputLayoutsResult = await SurveySuperiorOutputLayout.find({
         surveySuperiorId: superSurveyId,
      }).sort({ sequence: 1 })
      LogThis(log, `buildOutputHeaders`)
      //co});nsole.log(`Building output headers`);

      const outputLayout = buildOutputHeaders(
         questions,
         calculatedFields,
         outputLayoutsResult,
      )

      LogThis(log, `outputLayouts=${JSON.stringify(outputLayout)}`, L3)

      res.status(200).json({
         multiSurveys: multiSurveys,
         surveyIdsList: surveyIdsList,
         questions: questions,
         calculatedFields: calculatedFields,
         outputLayout: outputLayout,
      })
   } catch (error) {
      res.status(404)
      throw new Error(error)
   }
})

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyGetList = asyncHandler(async (req, res) => {
   try {
      const surveySuperiors = await SurveySuperior.find({}).lean()

      res.status(200).json({ surveySuperiors: surveySuperiors })
   } catch (error) {
      res.status(404)
      throw new Error('Product not found ')
   }
})

const surveySaveOutputHelper = asyncHandler(
   async (superSurveyId, columnsNames, outputValues) => {
      const functionName = 'surveySaveOutputHelper'
      const log = new LoggerSettings(srcFileName, functionName)
      try {
         LogThis(
            log,
            `superSurveyId=${superSurveyId}; columnsNames=${JSON.stringify(
               columnsNames,
               null,
               2,
            )}; outputValues=${JSON.stringify(outputValues)}`,
            L3,
         )
         const surveySuperiors = await SurveySuperior.find({
            _id: superSurveyId,
         }).lean()
         let x = 0
         x = x + 1
         LogThis(
            log,
            `x=${x}; surveySuperiors=${JSON.stringify(surveySuperiors)}`,
            L3,
         )

         const surveyOutputCollectionName = `surveyOutputs_${surveySuperiors[0].surveyShortName}`

         //   const collections = await mongoose.connection.db
         //   .listCollections({ name: surveyOutputCollectionName })
         //   .toArray();
         // x = x + 1;
         // LogThis(log, `x=${x}`, L3);
         // const collInfo = collections.find(
         //   (collection) => collection.name === surveyOutputCollectionName
         // );

         //const surveyOutputs = mongoose.model(surveyOutputCollectionName);
         let surveyOutputCollection = mongoose.connection.collection(
            surveyOutputCollectionName.toLocaleLowerCase(),
         )
         // x = x + 1;
         // LogThis(log, `x=${x}`, L3);
         // await surveyOutputCollection.deleteMany({});
         x = x + 1
         LogThis(log, `x=${x}`, L3)
         const outputValueDocuments = []
         let dateTimeParts = []
         let dateValue = null
         outputValues.forEach(row => {
            let doc = {}
            columnsNames.forEach((column, index) => {
               switch (column) {
                  case 'SCOLINFO_date_created':
                     dateTimeParts = row[index].split(/[\s/:\-]/)
                     dateValue = new Date(
                        dateTimeParts[2], // Year
                        dateTimeParts[0] - 1, // Month
                        dateTimeParts[1], // Day
                        dateTimeParts[3], // Hours
                        dateTimeParts[4], // Minutes)
                     )
                     doc[column] = dateValue
                     break
                  case 'SCOLINFO_date_modified':
                     dateTimeParts = row[index].split(/[\s/:\-]/)
                     dateValue = new Date(
                        dateTimeParts[2], // Year
                        dateTimeParts[0] - 1, // Month
                        dateTimeParts[1], // Day
                        dateTimeParts[3], // Hours
                        dateTimeParts[4], // Minutes)
                     )
                     doc[column] = dateValue
                     break
                  default:
                     doc[column] = row[index]
               }
            })
            outputValueDocuments.push(doc)
            doc = {}
         })
         x = x + 1
         LogThis(log, `x=${x}`, L3)
         // LogThis(
         //   log,
         //   `outputValueDocuments=${JSON.stringify(outputValueDocuments)}`
         // );
         // x = x + 1;
         // LogThis(log, `x=${x}`, L3);
         await surveyOutputCollection.insertMany(outputValueDocuments)
         x = x + 1
         LogThis(log, `x=${x}`, L3)
      } catch (error) {
         LogThis(log, `error ocurred: ${error.message}`, L0)
         throw error
      }
   },
)

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveySaveOutput = asyncHandler(async (req, res) => {
   const functionName = 'superSurveySaveOutput'
   const log = new LoggerSettings(srcFileName, functionName)
   try {
      LogThis(log, `START BY user=${req.user.email}`, L1)
      const { columnsNames, outputValues } = req.body

      const superSurveyId = req.params.id

      await surveySaveOutputHelper(superSurveyId, columnsNames, outputValues)

      res.status(200).json({ surveyOutputStatus: 'success' })
   } catch (error) {
      res.status(404)
      LogThis(log, `error=${error.message}`, L1)
      throw new Error(`Survey Output Error: ${error.message}`)
   }
})

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyGetOutputValues = asyncHandler(async (req, res) => {
   const functionName = 'superSurveyGetOutputValues'
   const log = new LoggerSettings(srcFileName, functionName)
   try {
      LogThis(log, `START BY user=${req.user.email}`, L1)
      /**
       * On 12/7/23 I was working on the pagination and lookup by keyword
       * This function won't work without page beein provided by the client, the keyword is optional.
       */
      const pageSize = 10
      const superSurveyId = req.params.id
      const superSurveyShortName = req.query.superSurveyShortName
      const page = Number(req.query.pageNumber) || 1
      const keyword = req.query.keyword
      //const regex = new RegExp(keyword, "i");
      const conditions = []
      let condition = {}
      //let fields = null;

      // const keyword = req.query.keyword
      //   ? {
      //       GENINFO_Nombre: {
      //         $regex: req.query.keyword,
      //         $options: "i",
      //       },
      //     }
      //   : {};

      LogThis(
         log,
         `superSurveyId=${superSurveyId};  superSurveyShortName=${JSON.stringify(
            superSurveyShortName,
         )}`,
         L2,
      )
      const outputLayouts = await SurveySuperiorOutputLayout.find({
         surveySuperiorId: superSurveyId,
      }).lean()

      let x = 0
      x = x + 1
      LogThis(log, `x=${x}; outputLayouts=${JSON.stringify(outputLayouts)}`, L3)
      let y = 0
      y = y + 1
      LogThis(log, `y=${y}`, L3)

      if (outputLayouts && outputLayouts.length > 0) {
         //fields = Object.keys(outputLayouts[0]);
         //LogThis(log, `fields=${JSON.stringify(fields)}`, L1);
         //const condition = {};
         outputLayouts.forEach(field => {
            if (field.showInSurveyOutputScreen) {
               condition[field.fieldName] = { $regex: new RegExp(keyword, 'i') }
               conditions.push(condition)
               condition = {}
            }
         })

         //conditions.push(condition);
      }

      LogThis(log, `conditions=${JSON.stringify(conditions, null, 1)}`, L3)
      y = y + 1
      LogThis(log, `Before surveyOutputCollectionName y=${y}`, L3)
      const surveyOutputCollectionName = `surveyOutputs_${superSurveyShortName}`
      y = y + 1
      LogThis(log, `about to call loadOneDynamicModel... y=${y}`)
      let surveyOutputCollectionFound = await loadOneDynamicModelFromDB(
         surveyOutputCollectionName,
      )
      y = y + 1
      LogThis(log, `After calling loadOneDynamic y=${y}`, L3)
      y = y + 1
      LogThis(log, `About to call surveyOutputCollectionFound y=${y}`, L3)
      // const outputValuesFound = await surveyOutputCollectionFound
      //   .find({
      //     $or: [
      //       { GENINFO_Nombre: new RegExp(keyword, "i") },
      //       { GENINFO_Sexo: new RegExp(keyword, "i") },
      //     ],
      //   })
      //   .exec();
      const count = await surveyOutputCollectionFound.countDocuments({
         $or: conditions,
      })

      const outputValuesFound = await surveyOutputCollectionFound
         .find({
            $or: conditions,
         })
         .sort({ SCOLINFO_respondent_id: -1 })
         .limit(pageSize)
         .skip(pageSize * (page - 1))
         .lean()

      // y = y + 1;
      // LogThis(log, `Called surveyOutputCollectionFound y=${y}`, L3);

      // LogThis(
      //   log,
      //   `typeof surveyOutputCollectionFound=${typeof surveyOutputCollectionFound}; surveyOutputCollectionFound=${JSON.stringify(
      //     Object.entries(surveyOutputCollectionFound)
      //   )} `,
      //   L3
      // );
      // LogThis(
      //   log,
      //   `XdynamicModelMap=${JSON.stringify(Object.entries(dynamicModelsMap))}`,
      //   L3
      // );
      // const outputValuesFound = await dynamicModelsMap[
      //   "surveyoutputs_talentos_2020"
      // ].find({
      //   /*$or: conditions */
      // });

      LogThis(log, `outputValuesFound=${JSON.stringify(outputValuesFound)}`, L3)
      // let surveyOutputCollection = mongoose.connection.collection(
      //   surveyOutputCollectionName.toLocaleLowerCase()
      // );

      // const findAsync = util.promisify(
      //   surveyOutputCollection.find.bind(surveyOutputCollection)
      // );

      // const countDocumentsAsync = util.promisify(
      //   surveyOutputCollection.countDocuments.bind(surveyOutputCollection)
      // );

      // // const count = await countDocumentsAsync({})
      // // LogThis(log, `countDocuments count=${JSON.stringify(count)}`)

      // const queryoutputValues = await findAsync({ $or: conditions });
      // const outputValues = await queryoutputValues.toArray();
      // const count = outputValues.length;

      // findAsync;

      x = x + 1
      LogThis(log, `outputValues=${JSON.stringify(outputValuesFound)}`, L3)
      LogThis(
         log,
         `page=${page}; count=${count}; pages=${Math.ceil(count / pageSize)}`,
         L3,
      )
      res.status(200).json({
         outputsInfo: {
            outputLayouts: outputLayouts,
            outputValues: outputValuesFound,
            page,
            pages: Math.ceil(count / pageSize),
         },
      })
   } catch (error) {
      res.status(404)
      LogThis(log, `error=${error.message}`, L1)
      throw new Error(`Survey Output Error: ${error.message}`)
   }
})

const superSurveyDeleteOutputValues = asyncHandler(async (req, res) => {
   const functionName = 'superSurveyDeleteOutputValues'
   const log = new LoggerSettings(srcFileName, functionName)
   try {
      const superSurveyId = req.params.id

      LogThis(log, `superSurveyId=${superSurveyId}`, L3)
      LogThis(log, `Deleting 0`, L3)
      const surveySuperiors = await SurveySuperior.find({
         _id: superSurveyId,
      }).lean()

      const surveyOutputCollectionName = `surveyOutputs_${surveySuperiors[0].surveyShortName}`
      LogThis(log, `Deleting 1`, L3)
      let surveyOutputCollection = mongoose.connection.collection(
         surveyOutputCollectionName.toLocaleLowerCase(),
      )
      LogThis(log, `Deleting 2`, L3)
      await surveyOutputCollection.deleteMany()
      LogThis(log, `Deleting 3`, L3)
      res.status(204).end()
   } catch (error) {
      LogThis(
         log,
         `Error deleting output values survey=${surveySuperiors[0].surveyShortName}; error=${error.message}`,
      )
      res.status(404)
      throw new Error(
         `Error deleting output values survey=${surveySuperiors[0].surveyShortName}; error=${error.message}`,
      )
   }
})

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyGetRespondentIds = asyncHandler(async (req, res) => {
   const functionName = 'superSurveyGetRespondentIds'
   const log = new LoggerSettings(srcFileName, functionName)
   try {
      LogThis(log, `START BY user=${req.user.email}`, L1)
      /**
       * On 12/7/23 I was working on the pagination and lookup by keyword
       * This function won't work without page beein provided by the client, the keyword is optional.
       */
      const superSurveyShortName = req.params.id
      //const superSurveyShortName = req.query.superSurveyShortName;

      LogThis(log, `superSurveyShortName=${superSurveyShortName}`, L0)
      const surveyOutputCollectionName = `surveyOutputs_${superSurveyShortName}`

      let surveyOutputCollectionFound = await loadOneDynamicModelFromDB(
         surveyOutputCollectionName,
      )
      // LogThis(
      //   log,
      //   `surveyOutputCollectionFound=${surveyOutputCollectionFound}`,
      //   L0
      // );
      //await surveyOutputCollectionFound.deleteMany({});
      const respondentIdsInfo = await surveyOutputCollectionFound
         .find({})
         .select(
            'SCOLINFO_respondent_id SCOLINFO_date_created SCOLINFO_date_modified',
         )
         .sort({ SCOLINFO_respondent_id: -1 })
         .lean()
      //LogThis(log, `respondentIdsInfo=${JSON.stringify(respondentIdsInfo)}`, L0);
      res.status(200).json({
         respondentIdsInfo: respondentIdsInfo,
      })
   } catch (error) {
      LogThis(
         log,
         `Error getting respondent ids error=${JSON.stringify(error)}`,
         L0,
      )
      res.status(404).json({ message: 'Error getting respondent ids error' })
      throw new Error(`Error getting respondent ids error=${error.message}`)
   }
})

// const surveyMonkeyUpdateResponses = asyncHandler(async (req, res) => {
//   const functionName = "surveyMonkeyUpdateResponses";
//   const log = new LoggerSettings(srcFileName, functionName);
//   try {
//     //LogThis(log, `START BY user=${req.user.email}`, L1);
//     /**
//      * On 12/7/23 I was working on the pagination and lookup by keyword
//      * This function won't work without page beein provided by the client, the keyword is optional.
//      */
//     const surveyShortName = req.params.id;
//     const superSurveysList = await SurveySuperior.findOne({
//       surveyShortName: surveyShortName,
//     }).lean();

//     const newRespondents = await SurveyMonkeyNewResponse.find({
//       $and: [
//         { surveyMonkeyId: superSurveysList.surveyMonkeyId },
//         {
//           $or: [
//             { process_status: SURVEY_PROCESS_STATUS.NEW },
//             { process_status: SURVEY_PROCESS_STATUS.UPDATED },
//           ],
//         },
//       ],
//     }).lean();
//     LogThis(log, `newRespondents=${j(newRespondents)}`, L3);

//     if (!newRespondents) {
//       res.status(200).json({ message: "No responses to process" });
//     }

//     const superSurveysArray = [superSurveysList];

//     let superSurveysConfigs = await getSuperSurveysConfigs(superSurveysArray);

//     const monkeyResponses = await getMonkeyResponses(newRespondents);

//     //const surveyRows = [];
//     const rowsValue = [];
//     const rowsReal = [];
//     const rowsScore = [];

//     monkeyResponses.forEach((monkeyResponse) => {
//       let rowValue = [];
//       let rowReal = [];
//       let rowScore = [];
//       addResponseInfo(rowValue, monkeyResponse);
//       addResponseInfo(rowReal, monkeyResponse);
//       LogThis(log, `line 1`, L3);
//       rowValue.forEach((r) => rowScore.push(0));
//       LogThis(log, `line 2`, L3);
//       let monkeySurveys = monkeyResponse.pages;
//       const superSurvey = superSurveysConfigs[0];

//       LogThis(log, `line 3, superSurveysConfigs=${j(superSurvey)}`, L3);

//       superSurvey.surveys.forEach((surveyConfig) => {
//         LogThis(log, `line 4`, L3);
//         let monkeySurvey = monkeySurveys.find((monkeySurvey) => {
//           LogThis(
//             log,
//             `THIS monkeySurvey.id=${
//               monkeySurvey.id
//             }; surveyConfig.surveyMonkeyId=${
//               surveyConfig.surveyMonkeyId
//             } condition: ${monkeySurvey.id == surveyConfig.surveyMonkeyId}`,
//             L3
//           );
//           return monkeySurvey.id == surveyConfig.surveyMonkeyId;
//         });
//         if (!monkeySurvey) {
//           throw new Error(`Survey Monkey response is missing a survey`);
//         }
//         let x = 0;

//         LogThis(log, `Here ${x++}`, L3);
//         surveyConfig.questions.forEach((surveyQuestion) => {
//           let monkeyQuestions = monkeySurvey.questions;

//           let monkeyQuestion = null;
//           let monkeyAnswerObject = null;
//           let monkeyAnswer = null;
//           //LogThis(log, `question family=${surveyQuestion.surveyMonkeyFamily}`)
//           if (
//             surveyQuestion.surveyMonkeyFamily == "matrix" &&
//             surveyQuestion.surveyMonkeySubType == "rating"
//           ) {
//             if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//               LogThis(
//                 log,
//                 `matrix rating monkeyQuestions=${j(monkeyQuestions)}`,
//                 L3
//               );
//               LogThis(
//                 log,
//                 `matrix rating surveyQuestion=${j(surveyQuestion)}`,
//                 L3
//               );
//             }
//             monkeyQuestion = monkeyQuestions[0].answers.find(
//               (monkeyQuestion) =>
//                 monkeyQuestion.row_id == surveyQuestion.surveyMonkeyId
//             );
//             LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);

//             if (monkeyQuestion) {
//               monkeyAnswer =
//                 monkeyQuestion[surveyQuestion.surveyMonkeyAnswers.answerField];
//             } else {
//               monkeyAnswer = "";
//             }
//             if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//               LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);
//               LogThis(log, `monkeyAnswer=${monkeyAnswer}`, L3);
//             }
//           } else if (
//             surveyQuestion.surveyMonkeyFamily == "multiple_choice" &&
//             surveyQuestion.surveyMonkeySubType == "vertical"
//           ) {
//             LogThis(log, `monkeyQuestions=${j(monkeyQuestions)}`, L3);
//             LogThis(log, `surveyQuestion=${j(surveyQuestion)}`, L3);

//             monkeyQuestion = monkeyQuestions[
//               surveyQuestion.surveyMonkeyPosition - 1
//             ].answers.find(
//               (monkeyQuestion) =>
//                 monkeyQuestion.choice_id == surveyQuestion.surveyMonkeyId
//             );

//             LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);
//             if (surveyQuestion.fieldName == "ESTRES_1") {
//               LogThis(
//                 log,
//                 `ESTRES_1 finding answer: values=${j({
//                   surveyQuestion: surveyQuestion,
//                   monkeyQuestions: monkeyQuestions,
//                   monkeyQuestion: monkeyQuestion,
//                   //monkeyAnswer: monkeyAnswer,
//                 })}`,
//                 L0
//               );
//             }
//             if (
//               monkeyQuestion &&
//               monkeyQuestion.answers &&
//               monkeyQuestion.answers.length > 0 &&
//               monkeyQuestion.answers[0]
//             ) {
//               monkeyAnswer =
//                 monkeyQuestion.answers[0][
//                   surveyQuestion.surveyMonkeyAnswers.answerField
//                 ];
//             } else {
//               monkeyAnswer = "";
//             }
//             if (surveyQuestion.fieldName == "ESTRES_1") {
//               LogThis(
//                 log,
//                 `ESTRES_1 finding answer: values=${j({
//                   surveyQuestion: surveyQuestion,
//                   monkeyQuestions: monkeyQuestions,
//                   monkeyQuestion: monkeyQuestion,
//                   monkeyAnswer: monkeyAnswer,
//                 })}`,
//                 L0
//               );
//             }
//           } else {
//             LogThis(
//               log,
//               `monkeyQuestion is not matrix nor multiple_choice: surveyQuestion=${j(
//                 surveyQuestion
//               )}`,
//               L3
//             );
//             monkeyQuestion = monkeyQuestions.find(
//               (monkeyQuestion) =>
//                 monkeyQuestion.id == surveyQuestion.surveyMonkeyId
//             );
//             LogThis(
//               log,
//               `not matrix before answer: monkeyQuestion=${j(monkeyQuestion)}`,
//               L3
//             );
//             if (monkeyQuestion) {
//               monkeyAnswerObject = monkeyQuestion.answers[0];
//               LogThis(log, `not matrix after answer`, L3);
//               monkeyAnswer =
//                 monkeyAnswerObject[
//                   surveyQuestion.surveyMonkeyAnswers.answerField
//                 ];
//             } else {
//               monkeyAnswer = "";
//             }
//           }

//           let value = null;
//           let realValue = null;
//           let score = null;

//           let questionType =
//             surveyQuestion.surveyMonkeyFamily +
//             "_" +
//             surveyQuestion.surveyMonkeySubType;
//           if (monkeyAnswer != "") {
//             switch (questionType) {
//               case "open_ended_single":
//                 value = monkeyAnswer;
//                 realValue = monkeyAnswer;
//                 score = "";
//                 break;
//               case "single_choice_menu":
//                 //questionMonkeyPosition = questionItem.surveyMonkeyPosition;
//                 if (surveyQuestion.surveyMonkeyPosition.answerType == "other") {
//                   if (monkeyAnswer) {
//                     value = monkeyAnswer;
//                     realValue = monkeyAnswer.trim();
//                     score = "";
//                   } else {
//                     value = "";
//                     realValue = "";
//                     score = "";
//                   }
//                 } else if (
//                   surveyQuestion.surveyMonkeyPosition.answerType == "noother"
//                 ) {
//                   let surveyChoice =
//                     surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
//                       (choice) => choice.id == monkeyAnswer
//                     );
//                   value = surveyChoice.value;
//                   realValue = surveyChoice.realValue.trim();
//                   score = surveyChoice.score;
//                 } else {
//                   LogThis(
//                     log,
//                     `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`,
//                     L1
//                   );
//                   throw new Error(
//                     `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`
//                   );
//                 }
//                 break;
//               case "single_choice_vertical":
//                 //questionMonkeyPosition = questionItem.surveyMonkeyPosition;
//                 if (surveyQuestion.surveyMonkeyPosition.answerType == "other") {
//                   if (monkeyAnswer) {
//                     value = monkeyAnswer;
//                     realValue = monkeyAnswer.trim();
//                     score = "";
//                   } else {
//                     value = "";
//                     realValue = "";
//                     score = "";
//                   }
//                 } else if (
//                   surveyQuestion.surveyMonkeyPosition.answerType == "noother"
//                 ) {
//                   let surveyChoice =
//                     surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
//                       (choice) => choice.id == monkeyAnswer
//                     );
//                   value = surveyChoice.value;
//                   realValue = surveyChoice.realValue.trim();
//                   score = surveyChoice.score;
//                 } else {
//                   LogThis(
//                     log,
//                     `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`,
//                     L1
//                   );
//                   throw new Error(
//                     `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`
//                   );
//                 }
//                 break;
//               case "matrix_rating": //for updating responses from survey monkey
//                 {
//                   let surveyChoice =
//                     surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
//                       (choice) => choice.id == monkeyAnswer
//                     );
//                   if (!surveyChoice) {
//                     LogThis(log, `Choice not found for ${monkeyAnswer}`, L1);
//                     throw new Error(`Choice not found for ${monkeyAnswer}`);
//                   }
//                   value = surveyChoice.score; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
//                   let realValueFromMonkey = surveyChoice.realValue.trim();
//                   realValue =
//                     realValueFromMonkey == ""
//                       ? surveyChoice.score
//                       : realValueFromMonkey;
//                   score = surveyChoice.score;
//                   if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//                     LogThis(
//                       log,
//                       `matrix values found: monkeyAnswer=${monkeyAnswer}; surveyQuestion=${j(
//                         surveyQuestion
//                       )}; surveyChoice=${j(surveyChoice)}; finalValues=${j({
//                         value: value,
//                         realValue: realValue,
//                         score: score,
//                       })}`,
//                       L3
//                     );
//                   }
//                 }
//                 break;
//               case "multiple_choice_vertical": //for updating responses from survey monkey
//                 {
//                   if (surveyQuestion.fieldName == "ESTRES_4") {
//                     LogThis(
//                       log,
//                       `ESTRES_4 multiple choice value inputs=${j({
//                         surveyQuestion: surveyQuestion,
//                         monkeyAnswer: monkeyAnswer,
//                       })}; `,
//                       L0
//                     );
//                   }
//                   let surveyChoice =
//                     surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
//                       (choice) => {
//                         if (surveyQuestion.fieldName == "ESTRES_5") {
//                           LogThis(
//                             log,
//                             `finding choice values =${j({
//                               choice: choice,
//                               choiceId: choice.id.toString().trim(),
//                               monkeyAnswer: monkeyAnswer.toString().trim(),
//                               condition:
//                                 choice.id.toString().trim() ==
//                                 monkeyAnswer.toString().trim(),
//                             })}`,
//                             L0
//                           );
//                         }
//                         return (
//                           choice.id.toString().trim() ==
//                           monkeyAnswer.toString().trim()
//                         );
//                       }
//                     );
//                   if (surveyQuestion.fieldName == "ESTRES_5") {
//                     LogThis(
//                       log,
//                       `found surveyChoice = ${j({
//                         surveyChoice: surveyChoice,
//                         negatedSurveyChoice: !surveyChoice,
//                       })}`,
//                       L0
//                     );
//                   }
//                   if (!surveyChoice) {
//                     LogThis(
//                       log,
//                       `Log Choice not found for ${monkeyAnswer} surveyChoice=${j(
//                         surveyChoice
//                       )}; question field: ${surveyQuestion.fieldName}`,
//                       L0
//                     );
//                     throw new Error(
//                       `Error Choice not found for ${monkeyAnswer}`
//                     );
//                   }
//                   value = surveyChoice.value; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
//                   realValue = surveyChoice.realValue.trim(); //Triming because Survey Monkey sometimes introduces a non-breaking space character that is an invisible character that looks like a space but is not really a space (ASCII code 32) but an NBSP (ASCII code 160), which causes problems when copying the data into an Excel spreadsheet or CSV files.
//                   score = surveyChoice.score;
//                   if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//                     LogThis(
//                       log,
//                       ` BECK_Nomesientoespecialme multiple_choice_vertical: finalValues=${j(
//                         {
//                           monkeyAnswer: monkeyAnswer,
//                           value: value,
//                           realValue: realValue,
//                           score: score,
//                           surveyChoice: surveyChoice,
//                           surveyQuestion: surveyQuestion,
//                         }
//                       )}`,
//                       L3
//                     );
//                   }
//                 }
//                 break;
//               default:
//                 LogThis(
//                   log,
//                   `Family:${surveyQuestion.surveyMonkeyFamily} and subType=${surveyQuestion.surveyMonkeySubType} combination is not valid.`,
//                   L1
//                 );
//                 throw new Error(
//                   `Family:${family} and subType=${subtype} combination is not valid.`
//                 );
//             }
//           } else {
//             value = ""; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
//             realValue = "";
//             score = "";
//             if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//               LogThis(
//                 log,
//                 ` BECK_Nomesientoespecialme else happened: finalValues=${j({
//                   value: value,
//                   realValue: realValue,
//                   score: score,
//                 })}`,
//                 L3
//               );
//             }
//           }
//           //case end
//           if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//             LogThis(
//               log,
//               ` BECK_Nomesientoespecialme pushing values to rows: finalValues=${j(
//                 {
//                   value: value,
//                   realValue: realValue,
//                   score: score,
//                 }
//               )}`,
//               L0
//             );
//           }
//           rowValue.push(value);
//           LogThis(
//             log,
//             `pushing one more value= "${value}" for surveyQuestion Field = "${surveyQuestion.fieldName}"`,
//             L0
//           );
//           rowReal.push(realValue);
//           rowScore.push(score);
//           if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
//             LogThis(
//               log,
//               ` BECK_Nomesientoespecialme falues after pushing: finalValues=${j(
//                 {
//                   rowValue: rowValue,
//                 }
//               )}`,
//               L0
//             );
//           }
//         });
//       });
//       rowsValue.push(rowValue);
//       rowsReal.push(rowReal);
//       rowsScore.push(rowScore);
//     });
//     res.header("Content-Type", "application/json; charset=utf-8");
//     res.status(200).json({
//       rowsValue: rowsValue,
//       rowsReal: rowsReal,
//       rowsScore: rowsScore,
//       superSurveysConfigs: superSurveysConfigs,
//       monkeyResponses: monkeyResponses,
//     });

//     // await surveySaveOutputHelper(superSurveyId, columnsNames, outputValues);
//     // const superSurveyShortName = req.params.id;
//     // //const superSurveyShortName = req.query.superSurveyShortName;

//     // LogThis(log, `superSurveyShortName=${superSurveyShortName}`, L1);
//     // const surveyOutputCollectionName = `surveyOutputs_${superSurveyShortName}`;

//     // let surveyOutputCollectionFound = await loadOneDynamicModelFromDB(
//     //   surveyOutputCollectionName
//     // );
//     // // LogThis(
//     // //   log,
//     // //   `surveyOutputCollectionFound=${surveyOutputCollectionFound}`,
//     // //   L1
//     // // );
//     // //await surveyOutputCollectionFound.deleteMany({});
//     // const respondentIdsInfo = await surveyOutputCollectionFound
//     //   .find({})
//     //   .select(
//     //     "SCOLINFO_respondent_id SCOLINFO_date_created SCOLINFO_date_modified"
//     //   )
//     //   .sort({ SCOLINFO_respondent_id: -1 })
//     //   .lean();
//     // //LogThis(log, `respondentIdsInfo=${JSON.stringify(respondentIdsInfo)}`, L1);
//     // res.status(200).json({
//     //   newRespondents: newRespondents,
//     // });
//   } catch (error) {
//     LogThis(log, `Error getting respondent ids error=${JSON.stringify(error)}`);
//     res.status(404).json({ message: "Error getting respondent ids error" });
//     throw new Error(`Error getting respondent ids error=${error.message}`);
//   }
// });

const surveyMonkeyUpdateResponses2 = asyncHandler(async (req, res) => {
   const functionName = 'surveyMonkeyUpdateResponses'
   const log = new LoggerSettings(srcFileName, functionName)

   try {
      const DEBUG_SECTION = 'DEBUG_SINGLE_MENU'
      LogDebugSection(DEBUG_SECTION)
      //LogThis(log, `START BY user=${req.user.email}`, L1);
      /**
       * On 12/7/23 I was working on the pagination and lookup by keyword
       * This function won't work without page beein provided by the client, the keyword is optional.
       */
      const surveyShortName = req.params.id
      const superSurveysList = await SurveySuperior.findOne({
         surveyShortName: surveyShortName,
      }).lean()

      HasDataException(
         superSurveysList,
         `Invalid super survey short name ${surveyShortName}`,
         log,
      )

      const newRespondents = await SurveyMonkeyNewResponse.find({
         $and: [
            { surveyMonkeyId: superSurveysList.surveyMonkeyId },
            {
               $or: [
                  { process_status: SURVEY_PROCESS_STATUS.NEW },
                  { process_status: SURVEY_PROCESS_STATUS.UPDATED },
               ],
            },
         ],
      }).lean()
      LogThis(log, `newRespondents=${j(newRespondents)}`, L3)

      if (!(newRespondents && newRespondents.length > 0)) {
         res.status(200).json({ message: 'No responses to process' })
      }

      // const superSurveysArray = [superSurveysList];

      //let superSurveysConfigs = await getSuperSurveysConfigs(superSurveysArray);

      const monkeyResponses = await getMonkeyResponses(newRespondents)

      HasDataException(
         monkeyResponses,
         `Couldn't get responses from Survey Monkey ${surveyShortName}`,
         log,
      )

      if (monkeyResponses.length != newRespondents.length) {
         throw new Error(
            `Number of responses from Survey Monkey are different from the count of new responses expected`,
         )
      }

      const surveyMonkeyConfigs = await SurveyMonkeyConfig.findOne({
         surveyMonkeyId: superSurveysList.surveyMonkeyId,
      }).lean()

      //const surveyRows = [];
      const rowValue = []
      const rowReal = []
      const rowScore = []
      let colsValue = []
      let colsReal = []
      let colsScore = []

      monkeyResponses.forEach(r => {
         rowValue.push([])
         rowReal.push([])
         rowScore.push([])
      })

      ValidateMonkeyConfigs(surveyMonkeyConfigs, log)

      const monkeySurveyConf = surveyMonkeyConfigs.survey
      const monkeyPagesConf = monkeySurveyConf.pages

      for (
         let monkeyPageIndex = 0;
         monkeyPageIndex < monkeyPagesConf.length;
         //monkeyPageIndex < 19;
         monkeyPageIndex++
      ) {
         let monkeyPageConf = monkeyPagesConf[monkeyPageIndex]
         LogThis(log, `page=${monkeyPageConf.title}`, DEBUG_SECTION)
         let monkeyQuestionsConf = monkeyPageConf.questions

         for (
            let monkeyQuestionIndex = 0;
            monkeyQuestionIndex < monkeyQuestionsConf.length;
            monkeyQuestionIndex++
         ) {
            let monkeyQuestionConf = monkeyQuestionsConf[monkeyQuestionIndex]
            LogThis(log, `questions=${monkeyQuestionConf.id}`, DEBUG_SECTION)
            for (
               let respIndex = 0;
               respIndex < monkeyResponses.length;
               respIndex++
            ) {
               LogThis(log, `repIndex=${respIndex}`, L0)
               colsValue = rowValue[respIndex]
               colsReal = rowReal[respIndex]
               colsScore = rowScore[respIndex]

               let monkeyResponse = monkeyResponses[respIndex]

               //Only for the first page and first question the Response info will be added.
               if (monkeyPageIndex == 0 && monkeyQuestionIndex == 0) {
                  addResponseInfoAll(
                     colsValue,
                     colsReal,
                     colsScore,
                     monkeyResponse,
                  )
               }

               let monkeyResponsePage = monkeyResponse.pages.find(
                  responsePage => responsePage.id == monkeyPageConf.id,
               )
               // //if(!monkeyResponsePage){
               // if (!monkeyResponsePage) {
               //   const blankPageFill = PushBlankPage(
               //     colsValue,
               //     colsReal,
               //     colsScore,
               //     monkeyPageConf
               //   );
               //   rowValue[respIndex].concat(blankPageFill.colsValue);
               //   rowReal[respIndex].concat(blankPageFill.colsReal);
               //   rowScore[respIndex].concat(blankPageFill.colsScore);
               //   LogThis(log, `monkeyPage not found ${monkeyPageConf}`, L0);
               //   //LogVars(log, L0, `PushBlankPage values`, "rowValue, rowReal, rowScore", blankPageFill.rowValue, blankPageFill.rowReal, blankPageFill.rowScore)
               //   continue;
               // }
               //monkeyResponsePage = null
               let monkeyResponseQuestions = monkeyResponsePage?.questions
               let monkeyResponseQuestion = monkeyResponseQuestions?.find(
                  responseQuestion =>
                     responseQuestion.id == monkeyQuestionConf.id,
               )
               LogThis(
                  log,
                  `Testing ? parameter monkeyResponseQuestion = ${j(
                     monkeyResponseQuestion,
                  )}`,
                  L0,
               )

               if (
                  !(
                     monkeyQuestionConf.details.family == 'presentation' &&
                     monkeyQuestionConf.details.subtype == 'descriptive_text'
                  )
               ) {
                  let responseValues = AnalyzeQuestionResponse(
                     monkeyQuestionConf,
                     monkeyResponseQuestion,
                  )

                  colsValue = colsValue.concat(responseValues.colsValue)
                  colsReal = colsReal.concat(responseValues.colsReal)
                  colsScore = colsScore.concat(responseValues.colsScore)
                  rowValue[respIndex] = colsValue
                  rowReal[respIndex] = colsReal
                  rowScore[respIndex] = colsScore
               }
            }
         }
      }

      res.header('Content-Type', 'application/json; charset=utf-8')
      res.status(200).json({
         rowValue: rowValue,
         rowReal: rowReal,
         rowScore: rowScore,
         surveyMonkeyConfigs: surveyMonkeyConfigs,
         monkeyResponses: monkeyResponses,
      })

      // monkeyResponses.forEach((monkeyResponse) => {
      //   let rowValue = [];
      //   let rowReal = [];
      //   let rowScore = [];
      //   addResponseInfo(rowValue, monkeyResponse);
      //   addResponseInfo(rowReal, monkeyResponse);
      //   LogThis(log, `line 1`, L3);
      //   rowValue.forEach((r) => rowScore.push(0));
      //   LogThis(log, `line 2`, L3);
      //   let monkeySurveys = monkeyResponse.pages;
      //   const superSurvey = superSurveysConfigs[0];

      //   LogThis(log, `line 3, superSurveysConfigs=${j(superSurvey)}`, L3);

      //   superSurvey.surveys.forEach((surveyConfig) => {
      //     LogThis(log, `line 4`, L3);
      //     let monkeySurvey = monkeySurveys.find((monkeySurvey) => {
      //       LogThis(
      //         log,
      //         `THIS monkeySurvey.id=${
      //           monkeySurvey.id
      //         }; surveyConfig.surveyMonkeyId=${
      //           surveyConfig.surveyMonkeyId
      //         } condition: ${monkeySurvey.id == surveyConfig.surveyMonkeyId}`,
      //         L3
      //       );
      //       return monkeySurvey.id == surveyConfig.surveyMonkeyId;
      //     });
      //     if (!monkeySurvey) {
      //       throw new Error(`Survey Monkey response is missing a survey`);
      //     }
      //     let x = 0;

      //     LogThis(log, `Here ${x++}`, L3);
      //     surveyConfig.questions.forEach((surveyQuestion) => {
      //       let monkeyQuestions = monkeySurvey.questions;

      //       let monkeyQuestion = null;
      //       let monkeyAnswerObject = null;
      //       let monkeyAnswer = null;
      //       //LogThis(log, `question family=${surveyQuestion.surveyMonkeyFamily}`)
      //       if (
      //         surveyQuestion.surveyMonkeyFamily == "matrix" &&
      //         surveyQuestion.surveyMonkeySubType == "rating"
      //       ) {
      //         if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //           LogThis(
      //             log,
      //             `matrix rating monkeyQuestions=${j(monkeyQuestions)}`,
      //             L3
      //           );
      //           LogThis(
      //             log,
      //             `matrix rating surveyQuestion=${j(surveyQuestion)}`,
      //             L3
      //           );
      //         }
      //         monkeyQuestion = monkeyQuestions[0].answers.find(
      //           (monkeyQuestion) =>
      //             monkeyQuestion.row_id == surveyQuestion.surveyMonkeyId
      //         );
      //         LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);

      //         if (monkeyQuestion) {
      //           monkeyAnswer =
      //             monkeyQuestion[surveyQuestion.surveyMonkeyAnswers.answerField];
      //         } else {
      //           monkeyAnswer = "";
      //         }
      //         if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //           LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);
      //           LogThis(log, `monkeyAnswer=${monkeyAnswer}`, L3);
      //         }
      //       } else if (
      //         surveyQuestion.surveyMonkeyFamily == "multiple_choice" &&
      //         surveyQuestion.surveyMonkeySubType == "vertical"
      //       ) {
      //         LogThis(log, `monkeyQuestions=${j(monkeyQuestions)}`, L3);
      //         LogThis(log, `surveyQuestion=${j(surveyQuestion)}`, L3);

      //         monkeyQuestion = monkeyQuestions[
      //           surveyQuestion.surveyMonkeyPosition - 1
      //         ].answers.find(
      //           (monkeyQuestion) =>
      //             monkeyQuestion.choice_id == surveyQuestion.surveyMonkeyId
      //         );

      //         LogThis(log, `monkeyQuestionFound=${j(monkeyQuestion)}`, L3);
      //         if (surveyQuestion.fieldName == "ESTRES_1") {
      //           LogThis(
      //             log,
      //             `ESTRES_1 finding answer: values=${j({
      //               surveyQuestion: surveyQuestion,
      //               monkeyQuestions: monkeyQuestions,
      //               monkeyQuestion: monkeyQuestion,
      //               //monkeyAnswer: monkeyAnswer,
      //             })}`,
      //             L0
      //           );
      //         }
      //         if (
      //           monkeyQuestion &&
      //           monkeyQuestion.answers &&
      //           monkeyQuestion.answers.length > 0 &&
      //           monkeyQuestion.answers[0]
      //         ) {
      //           monkeyAnswer =
      //             monkeyQuestion.answers[0][
      //               surveyQuestion.surveyMonkeyAnswers.answerField
      //             ];
      //         } else {
      //           monkeyAnswer = "";
      //         }
      //         if (surveyQuestion.fieldName == "ESTRES_1") {
      //           LogThis(
      //             log,
      //             `ESTRES_1 finding answer: values=${j({
      //               surveyQuestion: surveyQuestion,
      //               monkeyQuestions: monkeyQuestions,
      //               monkeyQuestion: monkeyQuestion,
      //               monkeyAnswer: monkeyAnswer,
      //             })}`,
      //             L0
      //           );
      //         }
      //       } else {
      //         LogThis(
      //           log,
      //           `monkeyQuestion is not matrix nor multiple_choice: surveyQuestion=${j(
      //             surveyQuestion
      //           )}`,
      //           L3
      //         );
      //         monkeyQuestion = monkeyQuestions.find(
      //           (monkeyQuestion) =>
      //             monkeyQuestion.id == surveyQuestion.surveyMonkeyId
      //         );
      //         LogThis(
      //           log,
      //           `not matrix before answer: monkeyQuestion=${j(monkeyQuestion)}`,
      //           L3
      //         );
      //         if (monkeyQuestion) {
      //           monkeyAnswerObject = monkeyQuestion.answers[0];
      //           LogThis(log, `not matrix after answer`, L3);
      //           monkeyAnswer =
      //             monkeyAnswerObject[
      //               surveyQuestion.surveyMonkeyAnswers.answerField
      //             ];
      //         } else {
      //           monkeyAnswer = "";
      //         }
      //       }

      //       let value = null;
      //       let realValue = null;
      //       let score = null;

      //       let questionType =
      //         surveyQuestion.surveyMonkeyFamily +
      //         "_" +
      //         surveyQuestion.surveyMonkeySubType;
      //       if (monkeyAnswer != "") {
      //         switch (questionType) {
      //           case "open_ended_single":
      //             value = monkeyAnswer;
      //             realValue = monkeyAnswer;
      //             score = "";
      //             break;
      //           case "single_choice_menu":
      //             //questionMonkeyPosition = questionItem.surveyMonkeyPosition;
      //             if (surveyQuestion.surveyMonkeyPosition.answerType == "other") {
      //               if (monkeyAnswer) {
      //                 value = monkeyAnswer;
      //                 realValue = monkeyAnswer.trim();
      //                 score = "";
      //               } else {
      //                 value = "";
      //                 realValue = "";
      //                 score = "";
      //               }
      //             } else if (
      //               surveyQuestion.surveyMonkeyPosition.answerType == "noother"
      //             ) {
      //               let surveyChoice =
      //                 surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
      //                   (choice) => choice.id == monkeyAnswer
      //                 );
      //               value = surveyChoice.value;
      //               realValue = surveyChoice.realValue.trim();
      //               score = surveyChoice.score;
      //             } else {
      //               LogThis(
      //                 log,
      //                 `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`,
      //                 L1
      //               );
      //               throw new Error(
      //                 `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`
      //               );
      //             }
      //             break;
      //           case "single_choice_vertical":
      //             //questionMonkeyPosition = questionItem.surveyMonkeyPosition;
      //             if (surveyQuestion.surveyMonkeyPosition.answerType == "other") {
      //               if (monkeyAnswer) {
      //                 value = monkeyAnswer;
      //                 realValue = monkeyAnswer.trim();
      //                 score = "";
      //               } else {
      //                 value = "";
      //                 realValue = "";
      //                 score = "";
      //               }
      //             } else if (
      //               surveyQuestion.surveyMonkeyPosition.answerType == "noother"
      //             ) {
      //               let surveyChoice =
      //                 surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
      //                   (choice) => choice.id == monkeyAnswer
      //                 );
      //               value = surveyChoice.value;
      //               realValue = surveyChoice.realValue.trim();
      //               score = surveyChoice.score;
      //             } else {
      //               LogThis(
      //                 log,
      //                 `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`,
      //                 L1
      //               );
      //               throw new Error(
      //                 `Survey monkey position type ${surveyQuestion.surveyMonkeyPosition.answerType} is not valid.`
      //               );
      //             }
      //             break;
      //           case "matrix_rating": //for updating responses from survey monkey
      //             {
      //               let surveyChoice =
      //                 surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
      //                   (choice) => choice.id == monkeyAnswer
      //                 );
      //               if (!surveyChoice) {
      //                 LogThis(log, `Choice not found for ${monkeyAnswer}`, L1);
      //                 throw new Error(`Choice not found for ${monkeyAnswer}`);
      //               }
      //               value = surveyChoice.score; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
      //               let realValueFromMonkey = surveyChoice.realValue.trim();
      //               realValue =
      //                 realValueFromMonkey == ""
      //                   ? surveyChoice.score
      //                   : realValueFromMonkey;
      //               score = surveyChoice.score;
      //               if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //                 LogThis(
      //                   log,
      //                   `matrix values found: monkeyAnswer=${monkeyAnswer}; surveyQuestion=${j(
      //                     surveyQuestion
      //                   )}; surveyChoice=${j(surveyChoice)}; finalValues=${j({
      //                     value: value,
      //                     realValue: realValue,
      //                     score: score,
      //                   })}`,
      //                   L3
      //                 );
      //               }
      //             }
      //             break;
      //           case "multiple_choice_vertical": //for updating responses from survey monkey
      //             {
      //               if (surveyQuestion.fieldName == "ESTRES_4") {
      //                 LogThis(
      //                   log,
      //                   `ESTRES_4 multiple choice value inputs=${j({
      //                     surveyQuestion: surveyQuestion,
      //                     monkeyAnswer: monkeyAnswer,
      //                   })}; `,
      //                   L0
      //                 );
      //               }
      //               let surveyChoice =
      //                 surveyQuestion.surveyMonkeyAnswers.answerChoices.find(
      //                   (choice) => {
      //                     if (surveyQuestion.fieldName == "ESTRES_5") {
      //                       LogThis(
      //                         log,
      //                         `finding choice values =${j({
      //                           choice: choice,
      //                           choiceId: choice.id.toString().trim(),
      //                           monkeyAnswer: monkeyAnswer.toString().trim(),
      //                           condition:
      //                             choice.id.toString().trim() ==
      //                             monkeyAnswer.toString().trim(),
      //                         })}`,
      //                         L0
      //                       );
      //                     }
      //                     return (
      //                       choice.id.toString().trim() ==
      //                       monkeyAnswer.toString().trim()
      //                     );
      //                   }
      //                 );
      //               if (surveyQuestion.fieldName == "ESTRES_5") {
      //                 LogThis(
      //                   log,
      //                   `found surveyChoice = ${j({
      //                     surveyChoice: surveyChoice,
      //                     negatedSurveyChoice: !surveyChoice,
      //                   })}`,
      //                   L0
      //                 );
      //               }
      //               if (!surveyChoice) {
      //                 LogThis(
      //                   log,
      //                   `Log Choice not found for ${monkeyAnswer} surveyChoice=${j(
      //                     surveyChoice
      //                   )}; question field: ${surveyQuestion.fieldName}`,
      //                   L0
      //                 );
      //                 throw new Error(
      //                   `Error Choice not found for ${monkeyAnswer}`
      //                 );
      //               }
      //               value = surveyChoice.value; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
      //               realValue = surveyChoice.realValue.trim(); //Triming because Survey Monkey sometimes introduces a non-breaking space character that is an invisible character that looks like a space but is not really a space (ASCII code 32) but an NBSP (ASCII code 160), which causes problems when copying the data into an Excel spreadsheet or CSV files.
      //               score = surveyChoice.score;
      //               if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //                 LogThis(
      //                   log,
      //                   ` BECK_Nomesientoespecialme multiple_choice_vertical: finalValues=${j(
      //                     {
      //                       monkeyAnswer: monkeyAnswer,
      //                       value: value,
      //                       realValue: realValue,
      //                       score: score,
      //                       surveyChoice: surveyChoice,
      //                       surveyQuestion: surveyQuestion,
      //                     }
      //                   )}`,
      //                   L3
      //                 );
      //               }
      //             }
      //             break;
      //           default:
      //             LogThis(
      //               log,
      //               `Family:${surveyQuestion.surveyMonkeyFamily} and subType=${surveyQuestion.surveyMonkeySubType} combination is not valid.`,
      //               L1
      //             );
      //             throw new Error(
      //               `Family:${family} and subType=${subtype} combination is not valid.`
      //             );
      //         }
      //       } else {
      //         value = ""; //if file is downloaded from survey monkey it sets the value of as the score instead of the position of the choice for matrix rating type.
      //         realValue = "";
      //         score = "";
      //         if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //           LogThis(
      //             log,
      //             ` BECK_Nomesientoespecialme else happened: finalValues=${j({
      //               value: value,
      //               realValue: realValue,
      //               score: score,
      //             })}`,
      //             L3
      //           );
      //         }
      //       }
      //       //case end
      //       if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //         LogThis(
      //           log,
      //           ` BECK_Nomesientoespecialme pushing values to rows: finalValues=${j(
      //             {
      //               value: value,
      //               realValue: realValue,
      //               score: score,
      //             }
      //           )}`,
      //           L0
      //         );
      //       }
      //       rowValue.push(value);
      //       LogThis(
      //         log,
      //         `pushing one more value= "${value}" for surveyQuestion Field = "${surveyQuestion.fieldName}"`,
      //         L0
      //       );
      //       rowReal.push(realValue);
      //       rowScore.push(score);
      //       if (surveyQuestion.fieldName == "BECK_Nomesientoespecialme") {
      //         LogThis(
      //           log,
      //           ` BECK_Nomesientoespecialme falues after pushing: finalValues=${j(
      //             {
      //               rowValue: rowValue,
      //             }
      //           )}`,
      //           L0
      //         );
      //       }
      //     });
      //   });
      //   rowsValue.push(rowValue);
      //   rowsReal.push(rowReal);
      //   rowsScore.push(rowScore);
      // });
      // res.header("Content-Type", "application/json; charset=utf-8");
      // res.status(200).json({
      //   rowsValue: rowsValue,
      //   rowsReal: rowsReal,
      //   rowsScore: rowsScore,
      //   superSurveysConfigs: superSurveysConfigs,
      //   monkeyResponses: monkeyResponses,
      // });

      // await surveySaveOutputHelper(superSurveyId, columnsNames, outputValues);
      // const superSurveyShortName = req.params.id;
      // //const superSurveyShortName = req.query.superSurveyShortName;

      // LogThis(log, `superSurveyShortName=${superSurveyShortName}`, L1);
      // const surveyOutputCollectionName = `surveyOutputs_${superSurveyShortName}`;

      // let surveyOutputCollectionFound = await loadOneDynamicModelFromDB(
      //   surveyOutputCollectionName
      // );
      // // LogThis(
      // //   log,
      // //   `surveyOutputCollectionFound=${surveyOutputCollectionFound}`,
      // //   L1
      // // );
      // //await surveyOutputCollectionFound.deleteMany({});
      // const respondentIdsInfo = await surveyOutputCollectionFound
      //   .find({})
      //   .select(
      //     "SCOLINFO_respondent_id SCOLINFO_date_created SCOLINFO_date_modified"
      //   )
      //   .sort({ SCOLINFO_respondent_id: -1 })
      //   .lean();
      // //LogThis(log, `respondentIdsInfo=${JSON.stringify(respondentIdsInfo)}`, L1);
      // res.status(200).json({
      //   newRespondents: newRespondents,
      // });
   } catch (error) {
      res.status(404).json({ message: 'Error surveyMonkeyUpdateResponses2' })
      throw new Error(
         `Error surveyMonkeyUpdateResponses2 error=${error.message}`,
      )
   }
})

module.exports = {
   superSurveyUploadAnswers,
   superSurveyCreateConfig,
   superSurveyTests,
   getSuperSurveyConfigs,
   superSurveyGetList,
   superSurveySaveOutput,
   superSurveyDeleteOutputValues,
   superSurveyGetOutputValues,
   superSurveyGetRespondentIds,
   updateSurveyMonkeyConfigs,
   superSurveyCreateConfigIntegratedWithMonkey,
   testSurveyMonkey,
   surveyMonkeyWebhookCreatedEvent,
   surveyMonkeyWebhookCompletedEvent,
   //surveyMonkeyUpdateResponses,
   surveyMonkeyUpdateResponses2,
}
