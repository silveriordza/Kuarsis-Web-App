let {
    SurveySuperior,
    Survey,
    SurveyQuestion,
    SurveyCalculatedField,
    SurveyMulti,
    MonkeyConfig,
    MonkeyNewResponse,
 } = require('../models/surveysModel.js')

 let {
   saveDynamicModelToDB,
   loadOneDynamicModelFromDB,
   dynamicModelsMap,
} = require('../utils/mongoDbHelper.js')


const {
    HasDataException,
    LoggerSettings,
    LogThis,
    j,
    HasData,
    HasDataMultipeEx,
    L0,
    L1,
    L2,
    L3,
 } = require('../utils/Logger.js')
 const MonkeyManager = require('../classes/MonkeyManager.js')
const SurveyManager = require('./SurveyManager.js')
const SurveySuperiorManager = require('./SurveySuperiorManager.js')
const SurveyQuestionManager = require('./SurveyQuestionManager.js')
const SurveyCalculatedFieldManager = require('./SurveyCalculatedFieldManager.js')
const SurveySuperiorOutputLayoutManager = require('./SurveySuperiorOutputLayoutManager.js')
const SurveyMultiManager = require('./SurveyMultiManager.js')
 
 class SurveyTemplateManager {
    constructor(surveyAllTemplates, owner) {
       this.log = new LoggerSettings(this.sourceFile, "constructor")
       HasDataException(surveyAllTemplates,`surveyTemplate is empty`, this.log)
       HasDataException(owner, `owner is empty`, this.log)
       this.owner = owner
       //surveyTemplate.owner = owner
       this.surveyTemplate = surveyAllTemplates
       this.surveyConfig = null
       this.monkeyManager = new MonkeyManager()
    }

    integrateSurveyWithMonkey = async () => {
      this.log.functionName="integrateSurveyWithMonkey"
      const log = this.log
      const surveyTemplate = this.surveyTemplate
      const owner = this.owner

        const superSurveyConf = surveyTemplate?.superSurvey
        const multiSurveyConf = surveyTemplate?.multiSurvey
        const surveysConf = surveyTemplate?.surveys
        const questionsConf = surveyTemplate?.questions
        const calculatedFieldsConf = surveyTemplate?.calculatedFields
        
        const monkeyManager = new MonkeyManager()

        const MongoDBManager = new MongoDBManager()
        HasDataMultipeEx(log,"superSurveyConfig,multiSurvey,surveys,questions,calculatedFields",superSurveyConf,multiSurveyConf,surveysConf,questionsConf,calculatedFieldsConf)


        const result = await SurveySuperior.deleteOne({
         superSurveyShortName: superSurveyConf.superSurveyShortName,
         })
   
         MongoDBManager.IsDeletedEx(result, `Error deleting SurveySuperior`, log)
         // await SurveySuperior.deleteMany({})
         // await Survey.deleteMany({})
         // await SurveyQuestion.deleteMany({})
         // await SurveyMulti.deleteMany({})
         // await SurveyCalculatedField.deleteMany({})
         // await SurveySuperiorOutputLayout.deleteMany({})
   
         //Search in the MonkeyConfigs collection the config corresponding to this SuperSurvey config from the template. The Survey Monkey config must have already been created/updated using the path surveys/surveymonkey/:id where the id is the Survey Monkey Id for this survey in Survey Monkey, make sure to run that one first.
         
         
         const monkeyConfigs =
            await monkeyManager.getMonkeyConfigByIdorName(
               superSurveyConfig.monkeyId,
               superSurveyConfig.surveyName,
            )
   
         HasDataException(monkeyConfigs
               `No Survey Monkey config found, run surveys/surveymonkey/:id first to download the corresponding Survey Monkey configs for this survey or verify the id or the name in your template matches in Survey Monkey by superSurveyConfig.id=${superSurveyConfig.id} or superSurveyConfig.name=${superSurveyConfig.name}`,
            this.log)
         
   
         //Save Survey Superior
         superSurveyConf.monkeyId = monkeyConfigs.id
         const superSurvey = new SurveySuperior({
            owner: owner,
            surveyName: superSurveyConfig.surveyName,
            surveyShortName: superSurveyConfig.surveyShortName,
            description: superSurveyConfig.description,
            monkeyInfo: { monkeyId: superSurveyConf.monkeyId}
         })
   
         const createdSurveySuperior = MongoDBManager.saveWithCheckEx(superSurvey, log)
   
         let surveysCreated = []
         let surveyCreated = null
         let questions = []
         let calculatedFields = []
         let questionItem = null

         //TODO: 1/10/2024 0040 Aqui me quede

         

         let surveyResponse = superSurveyConfig.surveyList[0]
         let responseInfo = new Survey({
            superSurveyId: createdSurveySuperior._id,
            surveyName: surveyResponse.surveyName,
            surveyShortName: surveyResponse.surveyShortName,
            description: surveyResponse.description,
            instructions: surveyResponse.instructions,
            monkeyPosition: surveyResponse.monkeyPosition,
         })
         const responseInfoCreated = await responseInfo.save()
   

         surveyResponse.questionList.forEach(
            question => (question.surveyId = responseInfoCreated._id),
         )
   
         const responseInfoQuestionsSaved = await SurveyQuestion.insertMany(
            surveyResponse.questionList,
         )
   
         for (let i = 1; i < superSurveyConfig.surveyList.length; i++) {
            let surveyItem = superSurveyConfig.surveyList[i]
            LogThis(
               log,
               `position=${
                  surveyItem.monkeyPosition - 1
               }; surveyItem=${JSON.stringify(surveyItem, null, 1)}`,
               L3,
            )
            let monkeyItem =
               monkeyConfigs.survey.pages[
                  surveyItem.monkeyPosition - 1
               ]
   
            let survey = new Survey({
               superSurveyId: createdSurveySuperior._id,
               surveyName: surveyItem.surveyName,
               surveyShortName: surveyItem.surveyShortName,
               description: surveyItem.description,
               instructions: surveyItem.instructions,
               monkeyId: monkeyItem.id,
               monkeyPosition: surveyItem.monkeyPosition,
            })
            surveyCreated = await survey.save()
   
            surveysCreated.push(surveyCreated)
   
            let monkeyQuestions = monkeyItem.questions
            LogThis(
               log,
               `monkeyQuestions=${JSON.stringify(
                  monkeyQuestions,
                  null,
                  1,
               )}`,
               L3,
            )
   
            for (let x = 0; x < surveyItem.questionList.length; x++) {
               questionItem = surveyItem.questionList[x]
               LogThis(
                  log,
                  `questionItem.monkeyPosition.position=${questionItem.monkeyPosition.position}`,
                  L3,
               )
   
               let monkeyQuestionItem = monkeyQuestions.find(question => {
                  LogThis(
                     log,
                     `questio.position=${question.position}; monkeyPosition=${
                        questionItem.monkeyPosition.position
                     }; condition=${
                        question.position ==
                        questionItem.monkeyPosition.position
                     }`,
                     L3,
                  )
   
                  return (
                     question.position ==
                     questionItem.monkeyPosition.position
                  )
               })
               LogThis(
                  log,
                  `monkeyQuestionItem=${JSON.stringify(
                     monkeyQuestionItem,
                     null,
                     1,
                  )}`,
                  L3,
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
                     questionMonkeyPosition = questionItem.monkeyPosition
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
                           L3,
                        )
                        throw new Error(
                           `Survey monkey position answer type ${questionMonkeyPosition.answerType} is not valid.`,
                        )
                     }
                     break
                  case 'single_choice_vertical':
                     questionMonkeyPosition = questionItem.monkeyPosition
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
                           L3,
                        )
                        throw new Error(
                           `Survey monkey position type ${questionMonkeyPosition.answerType} is not valid.`,
                        )
                     }
                     break
                  case 'matrix_rating': // for creating survey from survey monkey
                     {
                        let monkeyQuestion =
                           monkeyQuestionDetails.answers.rows.find(
                              monkeyQuestion =>
                                 questionItem.monkeyPosition.subPosition ==
                                 monkeyQuestion.position,
                           )
   
                        if (!monkeyQuestion) {
                           LogThis(
                              log,
                              `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                           )
                           throw new Error(
                              `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                           )
                        }
   
                        monkeyQuestionId = monkeyQuestion.id
   
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
                        let monkeyQuestion =
                           monkeyQuestionDetails.answers.choices.find(
                              monkeyQuestion =>
                                 questionItem.monkeyPosition.subPosition ==
                                 monkeyQuestion.position,
                           )
   
                        if (!monkeyQuestion) {
                           LogThis(
                              log,
                              `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                           )
                           throw new Error(
                              `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
                           )
                        }
   
                        monkeyQuestionId = monkeyQuestion.id
   
                        monkeyQuestionAnswers = {
                           answerField: 'choice_id',
                           answerChoices: [
                              {
                                 id: monkeyQuestion.id,
                                 value: monkeyQuestion.position,
                                 realValue: monkeyQuestion.text.trim(),
                                 score: monkeyQuestion.quiz_options.score,
                              },
                           ],
                        }
                     }
                     break
                  default:
                     LogThis(
                        log,
                        `Family:${family} and subType=${subtype} combination is not valid.`,
                        L3,
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
                  position: questionItem.position,
                  superSurveyCol: questionItem.superSurveyCol,
                  monkeyId: monkeyQuestionId,
                  monkeyPosition: questionItem.monkeyPosition,
                  monkeyFamily: monkeyQuestionItem.details.family,
                  monkeySubType: monkeyQuestionItem.details.subtype,
                  monkeyAnswers: monkeyQuestionAnswers,
               }
   
               // let monkeyQuestion = monkeyQuestions[x];
               // LogThis(
               //   log,
               //   `questionItem.question=${JSON.stringify(
               //     questionItem.question
               //   )}; monkeyQuestion.heading=${
               //     monkeyQuestion.heading
               //   };monkeyQuestion=${JSON.stringify(monkeyQuestion)}`,
               //   L3
               // );
               // newQuestion.monkeyId = monkeyQuestion.id;
               // newQuestion.monkeyPosition = monkeyQuestion.position;
   
               // let monkeyQuestionsDetailsResult = await axios.get(
               //   `https://api.surveymonkey.com/v3/surveys/${createdSurveySuperior.monkeyId}/pages/${surveyItem.monkeyId}/questions/${monkeyQuestion.id}`,
               //   configMonkey
               // );
               // let monkeyQuestionsDetails =
               //   monkeyQuestionsDetailsResult.data;
   
               // LogThis(
               //   log,
               //   `monkeyQuestionsDetails=${JSON.stringify(
               //     monkeyQuestionsDetails
               //   )}`,
               //   L3
               // );
               // newQuestion.monkeyFamily = monkeyQuestionsDetails.family;
               // newQuestion.monkeySubType = monkeyQuestionsDetails.subtype;
   
               // switch (monkeyQuestionsDetails.family) {
               //   case "open_ended":
               //     break;
               //   case "single_choice":
               //     switch (monkeyQuestionsDetails.subtype) {
               //       case "menu":
               //         if (monkeyQuestionsDetails.answers.choices ?? false) {
               //           let choices = monkeyQuestionsDetails.answers.choices;
               //           LogThis(log, `choices=${JSON.stringify(choices)}`, L3);
   
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
               //             L3
               //           );
               //           newQuestion.monkeyAnswers = { choices: choicesFields };
               //         }
   
               //         if (monkeyQuestionsDetails.answers.other ?? false) {
               //           newQuestion.monkeyAnswers.other = {
               //             id: monkeyQuestionsDetails.answers.other.id,
               //             value: monkeyQuestionsDetails.answers.other.position,
               //             questionText:
               //               monkeyQuestionsDetails.answers.other.text,
               //           };
               //         }
   
               //         LogThis(
               //           log,
               //           `newQuestion.monkeyAnswers=${JSON.stringify(
               //             newQuestion.monkeyAnswers
               //           )}`,
               //           L3
               //         );
               //         break;
               //       default:
               //         break;
               //     }
               //   default:
               //     break;
               // }
   
               questions.push(newQuestion)
               LogThis(log, `questions=${JSON.stringify(questions, null, 2)}`, L3)
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
                  position: calculatedFieldItem.position,
               })
            }
            questionsCreated = await SurveyQuestion.insertMany(questions)
            questions = []
            if (calculatedFields.length > 0) {
               calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
                  calculatedFields,
               )
               calculatedFields = []
            }
         } //CLOSE SURVEY LOOP HERE
   
         let outputLayouts = superSurveyConfig.surveySuperiorOutputLayout.sort(
            (a, b) => a.position - b.position,
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
               showInOutputScreen: outputLayout.showInOutputScreen,
               position: outputLayout.position,
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
   
         const surveyOutputCollectionName =
            `surveyOutputs_${superSurveyConfig.surveyShortName}`.toLocaleLowerCase()
         // LogThis(
         //    log,
         //    `x=${x}; surveyOutputCollectionName=${surveyOutputCollectionName}`,
         //    L3,
         // )
         const collections = await mongoose.connection.db
            .listCollections({ name: surveyOutputCollectionName })
            .toArray()
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
   
         let surveyOutputColumns = {}
   
         outputLayoutFields.forEach(column => {
            LogThis(
               log,
               `output Layout Field column=${JSON.stringify(column)}`,
               L3,
            )
            switch (column.fieldName) {
               case 'SCOLINFO_date_created':
                  surveyOutputColumns[column.fieldName] =
                     mongoose.Schema.Types.Date
                  break
               case 'SCOLINFO_date_modified':
                  surveyOutputColumns[column.fieldName] =
                     mongoose.Schema.Types.Date
                  break
               default:
                  surveyOutputColumns[column.fieldName] =
                     mongoose.Schema.Types.String
            }
         })
         LogThis(
            log,
            `surveyOutputColumns=${j(Object.entries(surveyOutputColumns))}`,
            L3,
         )
   
         const surveyOutputCollectionSchema = new Schema(surveyOutputColumns)
         const surveyOutputCollection = mongoose.model(
            surveyOutputCollectionName,
            surveyOutputCollectionSchema,
         )
   
         saveDynamicModelToDB(surveyOutputCollectionName, surveyOutputColumns)
 
         
    }

    

    processTemplate = async () => {
      this.log.functionName="processTemplate"
      const log = this.log
      const surveyConfig = this.surveyConfig
      const superSurveyConfig = this.surveyTemplate
      const owner = this.owner

      const surveySuperior = new SurveySuperiorManager(superSurveyConfig.surveySuperiors, owner)
      const surveySuperiorResult = await surveySuperior.save()

      const surveys = new SurveyManager(superSurveyConfig.surveys, owner)
      const surveysResult = await surveys.save()
      
      surveySuperiorResult.surveysResult=surveysResult

      const questions = new SurveyQuestionManager(superSurveyConfig.questions, surveysResult)
      const questionsResult = await questions.save()
      surveySuperiorResult.questionsResult=questionsResult

      const calculatedFields = new SurveyCalculatedFieldManager(superSurveyConfig.calculatedFields, surveysResult)
      const calculatedFieldsResult = await calculatedFields.save()
      surveySuperiorResult.calculatedFieldsResult=calculatedFieldsResult

      const outputLayouts = new SurveySuperiorOutputLayoutManager(superSurveyConfig.multiSurveys.outputLayout, surveySuperiorResult[0]._id)
      const outputLayoutsResult = await outputLayouts.save()
      surveySuperiorResult.outputLayoutsResult=outputLayoutsResult

      const surveyMulti = new SurveyMultiManager (superSurveyConfig.multiSurveys.surveys, surveySuperiorResult[0]._id, surveysResult)
      const surveyMultiResult = await surveyMulti.save()
      surveySuperiorResult.surveyMultiResult=surveyMultiResult

      return surveySuperiorResult
   //    //let superSurveyConfigTest = superSurveyConfig
   // const superSurvey = new SurveySuperior({
   //    owner: owner,
   //    surveyName: superSurveyConfig.surveyName,
   //    surveyShortName: superSurveyConfig.surveyShortName,
   //    description: superSurveyConfig.description,
   // })

   // const MongoDBManager = new MongoDBManager()
   // const createdSurveySuperior = await MongoDBManager.saveWithCheckEx(superSurvey, log)

   // let surveysCreated = []
   // let questionsCreated = []
   // //let calculatedFieldsCreated = [];
   // let surveyCreated = null
   // let questions = []
   // let calculatedFields = []
   // let questionItem = null
   
   // const surveys = superSurveyConfig.surveys

   // const surveyManager = new SurveyManager(owner, surveys)

   // const surveysShortNames = getSurveyShortNamesList (surveys)

   // const surveyShortNamesList = surveyManager.getTemplatesNamesList()

   // const result = surveyManager.deleteAllExistentTemplates(Survey, "surveyShortName")

   
   

   
   
   // for (let i = 0; i < superSurveyConfig.surveys.length; i++) {
   //    let surveyItem = superSurveyConfig.surveys[i]
   //    let survey = new Survey({
   //       superSurveyId: createdSurveySuperior._id,
   //       surveyName: surveyItem.surveyName,
   //       surveyShortName: surveyItem.surveyShortName,
   //       description: surveyItem.description,
   //       instructions: surveyItem.instructions,
   //    })
   //    surveyCreated = await survey.save()
   //    // let multiSurvey = new SurveyMulti({
   //    //   owner: owner,
   //    //   superSurveyId: createdSurveySuperior._id,
   //    //   surveyId: surveyCreated._id,
   //    //   position: i + 1,
   //    // });
   //    // let multiSurveyCreated = await multiSurvey.save();

   //    surveysCreated.push(surveyCreated)

   //    for (let x = 0; x < surveyItem.questionList.length; x++) {
   //       questionItem = surveyItem.questionList[x]
   //       questions.push({
   //          surveyId: surveyCreated._id,
   //          question: questionItem.question,
   //          questionShort: questionItem.questionShort,
   //          fieldName: questionItem.fieldName,
   //          weightType: questionItem.weightType,
   //          weights: questionItem.weights,
   //          position: questionItem.position,
   //          superSurveyCol: questionItem.superSurveyCol,
   //       })
   //    }

   //    for (
   //       let x = 0;
   //       surveyItem.calculatedFieldList &&
   //       x < surveyItem.calculatedFieldList.length;
   //       x++
   //    ) {
   //       calculatedFieldItem = surveyItem.calculatedFieldList[x]
   //       calculatedFields
   //       calculatedFields.push({
   //          surveyId: surveyCreated._id,
   //          description: calculatedFieldItem.description,
   //          shortDescription: calculatedFieldItem.shortDescription,
   //          fieldName: calculatedFieldItem.fieldName,
   //          calculationType: calculatedFieldItem.calculationType,
   //          criteria: calculatedFieldItem.criteria ?? null,
   //          group: calculatedFieldItem.group,
   //          position: calculatedFieldItem.position,
   //       })
   //    }
   //    LogThis(log, 'About to insert many', L3)
   //    LogThis(log, `questions=${JSON.stringify(questions)}`, L3)
   //    questionsCreated = await SurveyQuestion.insertMany(questions)
   //    questions = []
   //    LogThis(log, `calculatedFields=${JSON.stringify(calculatedFields)}`, L3)
   //    if (calculatedFields.length > 0) {
   //       calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
   //          calculatedFields,
   //       )
   //       calculatedFields = []
   //    }
   // }

   // let outputLayouts = superSurveyConfig.surveySuperiorOutputLayout.sort(
   //    (a, b) => a.position - b.position,
   // )
   // LogThis(log, `outputLayouts = ${JSON.stringify(outputLayouts)}`, L3)
   // let outputLayoutFields = []
   // for (let i = 0; i < outputLayouts.length; i++) {
   //    outputLayout = outputLayouts[i]
   //    outputLayoutFields.push({
   //       surveySuperiorId: createdSurveySuperior._id,
   //       surveyShortName: outputLayout.surveyShortName,
   //       fieldName: outputLayout.fieldName,
   //       outputAsReal: outputLayout.outputAsReal,
   //       showInOutputScreen: outputLayout.showInOutputScreen,
   //       position: outputLayout.position,
   //    })
   // }
   // LogThis(
   //    log,
   //    `outputLayoutFields = ${JSON.stringify(outputLayoutFields)}`,
   //    L3,
   // )
   // const createdOutputLayout = await SurveySuperiorOutputLayout.insertMany(
   //    outputLayoutFields,
   // )

   // //Start Output Collection
   // let x = 0
   // x++
   // const surveyOutputCollectionName =
   //    `surveyOutputs_${superSurveyConfig.surveyShortName}`.toLocaleLowerCase()
   // LogThis(
   //    log,
   //    `x=${x}; surveyOutputCollectionName=${surveyOutputCollectionName}`,
   //    L3,
   // )

   // x = x + 1
   // LogThis(log, `x=${x}`, L3)
   // const collections = await mongoose.connection.db
   //    .listCollections({ name: surveyOutputCollectionName })
   //    .toArray()
   // x = x + 1
   // LogThis(log, `x=${x}`, L3)
   // const collInfo = collections.find(
   //    collection => collection.name === surveyOutputCollectionName,
   // )
   // if (collInfo) {
   //    LogThis(log, `dropping surveyOutputCollectionName`, L3)
   //    let surveyOutputCollection = await mongoose.connection.collection(
   //       surveyOutputCollectionName,
   //    )

   //    await surveyOutputCollection.drop()

   //    LogThis(log, `dropped surveyOutputCollectionName`, L3)

   //    delete mongoose.models[surveyOutputCollectionName]
   //    LogThis(log, `deleted models`, L3)
   // }
   // x = x + 1
   // LogThis(log, `x=${x}`, L3)

   // let surveyOutputColumns = {}

   // outputLayoutFields.forEach(column => {
   //    LogThis(log, `output Layout Field column=${JSON.stringify(column)}`, L3)
   //    surveyOutputColumns[column.fieldName] = mongoose.Schema.Types.String
   // })
   // x = x + 1
   // LogThis(
   //    log,
   //    `x=${x}; surveyOutputColumns=${JSON.stringify(
   //       Object.entries(surveyOutputColumns),
   //    )}`,
   //    L3,
   // )

   // const surveyOutputCollectionSchema = new Schema(surveyOutputColumns)
   // x = x + 1
   // LogThis(log, `x=${x}`, L3)
   // const surveyOutputCollection = mongoose.model(
   //    surveyOutputCollectionName,
   //    surveyOutputCollectionSchema,
   // )

   // saveDynamicModelToDB(surveyOutputCollectionName, surveyOutputColumns)

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

   // x = x + 1
   // LogThis(log, `x=${x}`, L3)

    }
}

module.exports = SurveyTemplateManager