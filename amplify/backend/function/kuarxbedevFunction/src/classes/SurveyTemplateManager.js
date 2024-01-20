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

const { LogManager } = require('./LogManager.js')
const SurveyFieldManager = require('./SurveyFieldManager.js')
const SurveyOutputManager = require('./SurveyOutputManager.js')
const SurveyMultiManager = require('./SurveyMultiManager.js')
const MongoDBManager = require('./MongoDBManager.js')

const sourceFile = "SurveyTemplateManager.js"
 class SurveyTemplateManager {
    constructor() {
       this.log = new LoggerSettings(this.sourceFile, "constructor")
       
       this.surveyConfig = null
       this.monkeyManager = new MonkeyManager()
       this.logNew = new LogManager(sourceFile, "constructor")
    }

    activateTemplateSaver(surveyAllTemplates, owner){
      HasDataException(surveyAllTemplates,`surveyTemplate is empty`, this.log)
      HasDataException(owner, `owner is empty`, this.log)
      this.owner = owner
      //surveyTemplate.owner = owner
      this.surveyTemplate = surveyAllTemplates
    }

    async loadTemplate(superSurveyShortName){
      this.logNew.setFunctionName("integrateSurveyWithMonkey")
      
      let result = {}


      this.superSurveyShortName = superSurveyShortName
      this.superSurvey = new SurveyManager('SurveySuperior', 'superSurveyShortName')
      result = await this.superSurvey.load(superSurveyShortName)
      this.superSurveyConfig = {superSurvey: result[0]}

      this.multiSurveys = new SurveyManager('SurveyMulti', 'superSurveyId')
      this.superSurveyId = this.superSurveyConfig.superSurvey._id
      result = await this.multiSurveys.load(this.superSurveyId)
      this.superSurveyConfig.multiSurveys=result

      this.surveys = new SurveyManager('Survey', '_id')
      result= await this.surveys.loadMatchList(this.superSurveyConfig.multiSurveys, 'surveyId')
      this.superSurveyConfig.surveys = result

      this.questions = new SurveyManager('SurveyQuestion', 'surveyId') 
      result = await this.questions.loadMatchList(this.superSurveyConfig.surveys, '_id')
      this.surveys.combineSurveyElements(this.superSurveyConfig.surveys, "_id", "questions", result, "surveyId") 

      this.calculatedFields = new SurveyManager('SurveyCalculatedField', 'surveyId') 
      result = await this.calculatedFields.loadMatchList(this.superSurveyConfig.surveys, '_id')
      this.surveys.combineSurveyElements(this.superSurveyConfig.surveys, "_id", "calculatedFields", result, "surveyId") 

      return this.superSurveyConfig
    }
   
    async integrateSurveyWithMonkey (superSurveyShortName){
      this.logNew.setFunctionName("integrateSurveyWithMonkey")
      
      let result = await this.loadTemplate(superSurveyShortName) 

     
      //return result


       const surveyTemplate = this.superSurveyConfig
       let superSurveyConfig = this.superSurveyConfig
       //const owner = this.owner

        const superSurveyConf = surveyTemplate?.superSurvey
        const multiSurveyConf = surveyTemplate?.multiSurveys
        const surveysConf = surveyTemplate?.surveys
        const questionsConf = surveyTemplate?.surveys.map( 
          survey => survey.questions.map(field => {
            field.surveyPosition = survey.position 
            field.surveyShortName = survey.surveyShortName
            return field
           }
        ))
        const calculatedFieldsConf = surveyTemplate?.surveys.map( 
          survey => survey.calculatedFields.map(field => {
            field.surveyPosition = survey.position 
            field.surveyShortName = survey.surveyShortName
            return field
           }
        ))
        const monkeyManager = new MonkeyManager()

        //const mondoDbManager = new MongoDBManager()

        this.logNew.HasDataMultipeEx("superSurveyConfig,multiSurvey,surveys,questions,calculatedFields",superSurveyConf,multiSurveyConf,surveysConf,questionsConf,calculatedFieldsConf)
//TODO Aqui me quede, sigue create la tabla donde se guardara la encuesta instanciada e integrada con suvery monkey.

      //   const result = await SurveySuperior.deleteOne({
      //    superSurveyShortName: superSurveyConf.superSurveyShortName,
      //    })
   
      //    MongoDBManager.IsDeletedEx(result, `Error deleting SurveySuperior`, log)
      //    // await SurveySuperior.deleteMany({})
      //    // await Survey.deleteMany({})
      //    // await SurveyQuestion.deleteMany({})
      //    // await SurveyMulti.deleteMany({})
      //    // await SurveyCalculatedField.deleteMany({})
      //    // await SurveySuperiorOutputLayout.deleteMany({})
   
      //    //Search in the MonkeyConfigs collection the config corresponding to this SuperSurvey config from the template. The Survey Monkey config must have already been created/updated using the path surveys/surveymonkey/:id where the id is the Survey Monkey Id for this survey in Survey Monkey, make sure to run that one first.
         
         
         const monkeyConfigs =
            await this.monkeyManager.getMonkeyConfigByIdorName(
              superSurveyConf?.monkeyId,
              superSurveyConf.surveyName,
            )
   
            this.logNew.HasDataException(monkeyConfigs,
               `No Survey Monkey config found, run surveys/surveymonkey/:id first to download the corresponding Survey Monkey configs for this survey or verify the id or the name in your template matches in Survey Monkey by superSurveyConfig.id=${superSurveyConf._id} or superSurveyConfig.name=${superSurveyConf.name}`)
         
   
      //    //Save Survey Superior
      //    superSurveyConf.monkeyId = monkeyConfigs.id
      //    const superSurvey = new SurveySuperior({
      //       owner: owner,
      //       surveyName: superSurveyConfig.surveyName,
      //       surveyShortName: superSurveyConfig.surveyShortName,
      //       description: superSurveyConfig.description,
      //       monkeyInfo: { monkeyId: superSurveyConf.monkeyId}
      //    })
   
      //    const createdSurveySuperior = MongoDBManager.saveWithCheckEx(superSurvey, log)
   
      //    let surveysCreated = []
      //    let surveyCreated = null
      //    let questions = []
      //    let calculatedFields = []
      //    let questionItem = null

      //    //TODO: 1/10/2024 0040 Aqui me quede

         

      //    let surveyResponse = superSurveyConfig.surveyList[0]
      //    let responseInfo = new Survey({
      //       superSurveyId: createdSurveySuperior._id,
      //       surveyName: surveyResponse.surveyName,
      //       surveyShortName: surveyResponse.surveyShortName,
      //       description: surveyResponse.description,
      //       instructions: surveyResponse.instructions,
      //       monkeyPosition: surveyResponse.monkeyPosition,
      //    })
      //    const responseInfoCreated = await responseInfo.save()
   

      //    surveyResponse.questionList.forEach(
      //       question => (question.surveyId = responseInfoCreated._id),
      //    )
   
      //    const responseInfoQuestionsSaved = await SurveyQuestion.insertMany(
      //       surveyResponse.questionList,
      //    )
   
      //    for (let i = 1; i < superSurveyConfig.surveyList.length; i++) {
      //       let surveyItem = superSurveyConfig.surveyList[i]
      //       LogThis(
      //          log,
      //          `position=${
      //             surveyItem.monkeyPosition - 1
      //          }; surveyItem=${JSON.stringify(surveyItem, null, 1)}`,
      //          L3,
      //       )
      //       let monkeyItem =
      //          monkeyConfigs.survey.pages[
      //             surveyItem.monkeyPosition - 1
      //          ]
   
      //       let survey = new Survey({
      //          superSurveyId: createdSurveySuperior._id,
      //          surveyName: surveyItem.surveyName,
      //          surveyShortName: surveyItem.surveyShortName,
      //          description: surveyItem.description,
      //          instructions: surveyItem.instructions,
      //          monkeyId: monkeyItem.id,
      //          monkeyPosition: surveyItem.monkeyPosition,
      //       })
      //       surveyCreated = await survey.save()
   
      //       surveysCreated.push(surveyCreated)
   
      //       let monkeyQuestions = monkeyItem.questions
      //       LogThis(
      //          log,
      //          `monkeyQuestions=${JSON.stringify(
      //             monkeyQuestions,
      //             null,
      //             1,
      //          )}`,
      //          L3,
      //       )
   
      //       for (let x = 0; x < surveyItem.questionList.length; x++) {
      //          questionItem = surveyItem.questionList[x]
      //          LogThis(
      //             log,
      //             `questionItem.monkeyPosition.position=${questionItem.monkeyPosition.position}`,
      //             L3,
      //          )
   
      //          let monkeyQuestionItem = monkeyQuestions.find(question => {
      //             LogThis(
      //                log,
      //                `questio.position=${question.position}; monkeyPosition=${
      //                   questionItem.monkeyPosition.position
      //                }; condition=${
      //                   question.position ==
      //                   questionItem.monkeyPosition.position
      //                }`,
      //                L3,
      //             )
   
      //             return (
      //                question.position ==
      //                questionItem.monkeyPosition.position
      //             )
      //          })
      //          LogThis(
      //             log,
      //             `monkeyQuestionItem=${JSON.stringify(
      //                monkeyQuestionItem,
      //                null,
      //                1,
      //             )}`,
      //             L3,
      //          )
      //          if (!monkeyQuestionItem) {
      //             throw new Error(
      //                `Monkey Question Item not found for questionItem=${j(
      //                   questionItem,
      //                )}`,
      //             )
      //          }
      //          let monkeyQuestionDetails = monkeyQuestionItem.details
      //          let monkeyQuestionId = monkeyQuestionItem.id
      //          let family = monkeyQuestionDetails.family
      //          let subtype = monkeyQuestionDetails.subtype
      //          let monkeyQuestionAnswers = null
      //          let questionMonkeyPosition = null
      //          switch (family + '_' + subtype) {
      //             case 'open_ended_single':
      //                monkeyQuestionAnswers = {
      //                   answerField: 'text',
      //                   answerChoices: null,
      //                }
      //                break
      //             case 'single_choice_menu':
      //                questionMonkeyPosition = questionItem.monkeyPosition
      //                if (questionMonkeyPosition.answerType == 'other') {
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'text',
      //                      answerChoices: {
      //                         id: monkeyQuestionDetails.answers.other.id,
      //                         value: monkeyQuestionDetails.answers.other.position,
      //                         realValue: '',
      //                         score: null,
      //                      },
      //                   }
      //                } else if (questionMonkeyPosition.answerType == 'noother') {
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'choice_id',
      //                      answerChoices:
      //                         monkeyQuestionDetails.answers.choices.map(choice => {
      //                            return {
      //                               id: choice.id,
      //                               value: choice.position,
      //                               realValue: choice.text.trim(),
      //                               score: choice.quiz_options.score,
      //                            }
      //                         }),
      //                   }
      //                } else {
      //                   LogThis(
      //                      log,
      //                      `Survey monkey position answer type ${questionMonkeyPosition.answerType} is not valid.`,
      //                      L3,
      //                   )
      //                   throw new Error(
      //                      `Survey monkey position answer type ${questionMonkeyPosition.answerType} is not valid.`,
      //                   )
      //                }
      //                break
      //             case 'single_choice_vertical':
      //                questionMonkeyPosition = questionItem.monkeyPosition
      //                if (questionMonkeyPosition.answerType == 'other') {
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'text',
      //                      answerChoices: {
      //                         id: monkeyQuestionDetails.answers.other.id,
      //                         value: monkeyQuestionDetails.answers.other.position,
      //                         realValue: '',
      //                         score: null,
      //                      },
      //                   }
      //                } else if (questionMonkeyPosition.answerType == 'noother') {
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'choice_id',
      //                      answerChoices:
      //                         monkeyQuestionDetails.answers.choices.map(choice => {
      //                            return {
      //                               id: choice.id,
      //                               value: choice.position,
      //                               realValue: choice.text.trim(),
      //                               score: choice.quiz_options.score,
      //                            }
      //                         }),
      //                   }
      //                } else {
      //                   LogThis(
      //                      log,
      //                      `Survey monkey position type ${questionMonkeyPosition.answerType} is not valid.`,
      //                      L3,
      //                   )
      //                   throw new Error(
      //                      `Survey monkey position type ${questionMonkeyPosition.answerType} is not valid.`,
      //                   )
      //                }
      //                break
      //             case 'matrix_rating': // for creating survey from survey monkey
      //                {
      //                   let monkeyQuestion =
      //                      monkeyQuestionDetails.answers.rows.find(
      //                         monkeyQuestion =>
      //                            questionItem.monkeyPosition.subPosition ==
      //                            monkeyQuestion.position,
      //                      )
   
      //                   if (!monkeyQuestion) {
      //                      LogThis(
      //                         log,
      //                         `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
      //                      )
      //                      throw new Error(
      //                         `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
      //                      )
      //                   }
   
      //                   monkeyQuestionId = monkeyQuestion.id
   
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'choice_id',
      //                      answerChoices:
      //                         monkeyQuestionDetails.answers.choices.map(choice => {
      //                            return {
      //                               id: choice.id,
      //                               value: choice.position,
      //                               realValue: choice.text.trim(),
      //                               score: choice.weight,
      //                            }
      //                         }),
      //                   }
      //                }
      //                break
   
      //             case 'multiple_choice_vertical': // for creating survey from survey monkey
      //                {
      //                   let monkeyQuestion =
      //                      monkeyQuestionDetails.answers.choices.find(
      //                         monkeyQuestion =>
      //                            questionItem.monkeyPosition.subPosition ==
      //                            monkeyQuestion.position,
      //                      )
   
      //                   if (!monkeyQuestion) {
      //                      LogThis(
      //                         log,
      //                         `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
      //                      )
      //                      throw new Error(
      //                         `Question for field ${questionItem.fieldName} not found in Survey Monkey configs`,
      //                      )
      //                   }
   
      //                   monkeyQuestionId = monkeyQuestion.id
   
      //                   monkeyQuestionAnswers = {
      //                      answerField: 'choice_id',
      //                      answerChoices: [
      //                         {
      //                            id: monkeyQuestion.id,
      //                            value: monkeyQuestion.position,
      //                            realValue: monkeyQuestion.text.trim(),
      //                            score: monkeyQuestion.quiz_options.score,
      //                         },
      //                      ],
      //                   }
      //                }
      //                break
      //             default:
      //                LogThis(
      //                   log,
      //                   `Family:${family} and subType=${subtype} combination is not valid.`,
      //                   L3,
      //                )
      //                throw new Error(
      //                   `Family:${family} and subType=${subtype} combination is not valid.`,
      //                )
      //          }
   
      //          let newQuestion = {
      //             surveyId: surveyCreated._id,
      //             question: questionItem.question,
      //             questionShort: questionItem.questionShort,
      //             fieldName: questionItem.fieldName,
      //             weightType: questionItem.weightType,
      //             weights: questionItem.weights,
      //             position: questionItem.position,
      //             superSurveyCol: questionItem.superSurveyCol,
      //             monkeyId: monkeyQuestionId,
      //             monkeyPosition: questionItem.monkeyPosition,
      //             monkeyFamily: monkeyQuestionItem.details.family,
      //             monkeySubType: monkeyQuestionItem.details.subtype,
      //             monkeyAnswers: monkeyQuestionAnswers,
      //          }
   
      //          // let monkeyQuestion = monkeyQuestions[x];
      //          // LogThis(
      //          //   log,
      //          //   `questionItem.question=${JSON.stringify(
      //          //     questionItem.question
      //          //   )}; monkeyQuestion.heading=${
      //          //     monkeyQuestion.heading
      //          //   };monkeyQuestion=${JSON.stringify(monkeyQuestion)}`,
      //          //   L3
      //          // );
      //          // newQuestion.monkeyId = monkeyQuestion.id;
      //          // newQuestion.monkeyPosition = monkeyQuestion.position;
   
      //          // let monkeyQuestionsDetailsResult = await axios.get(
      //          //   `https://api.surveymonkey.com/v3/surveys/${createdSurveySuperior.monkeyId}/pages/${surveyItem.monkeyId}/questions/${monkeyQuestion.id}`,
      //          //   configMonkey
      //          // );
      //          // let monkeyQuestionsDetails =
      //          //   monkeyQuestionsDetailsResult.data;
   
      //          // LogThis(
      //          //   log,
      //          //   `monkeyQuestionsDetails=${JSON.stringify(
      //          //     monkeyQuestionsDetails
      //          //   )}`,
      //          //   L3
      //          // );
      //          // newQuestion.monkeyFamily = monkeyQuestionsDetails.family;
      //          // newQuestion.monkeySubType = monkeyQuestionsDetails.subtype;
   
      //          // switch (monkeyQuestionsDetails.family) {
      //          //   case "open_ended":
      //          //     break;
      //          //   case "single_choice":
      //          //     switch (monkeyQuestionsDetails.subtype) {
      //          //       case "menu":
      //          //         if (monkeyQuestionsDetails.answers.choices ?? false) {
      //          //           let choices = monkeyQuestionsDetails.answers.choices;
      //          //           LogThis(log, `choices=${JSON.stringify(choices)}`, L3);
   
      //          //           let choicesFields = choices.map((choice) => {
      //          //             return {
      //          //               id: choice.id,
      //          //               value: choice.position,
      //          //               realValue: choice.text,
      //          //               weightedValue: choice.quiz_options.score,
      //          //             };
      //          //           });
      //          //           LogThis(
      //          //             log,
      //          //             `choicesFields=${JSON.stringify(choicesFields)}`,
      //          //             L3
      //          //           );
      //          //           newQuestion.monkeyAnswers = { choices: choicesFields };
      //          //         }
   
      //          //         if (monkeyQuestionsDetails.answers.other ?? false) {
      //          //           newQuestion.monkeyAnswers.other = {
      //          //             id: monkeyQuestionsDetails.answers.other.id,
      //          //             value: monkeyQuestionsDetails.answers.other.position,
      //          //             questionText:
      //          //               monkeyQuestionsDetails.answers.other.text,
      //          //           };
      //          //         }
   
      //          //         LogThis(
      //          //           log,
      //          //           `newQuestion.monkeyAnswers=${JSON.stringify(
      //          //             newQuestion.monkeyAnswers
      //          //           )}`,
      //          //           L3
      //          //         );
      //          //         break;
      //          //       default:
      //          //         break;
      //          //     }
      //          //   default:
      //          //     break;
      //          // }
   
      //          questions.push(newQuestion)
      //          LogThis(log, `questions=${JSON.stringify(questions, null, 2)}`, L3)
      //       }
   
      //       for (
      //          let x = 0;
      //          surveyItem.calculatedFieldList &&
      //          x < surveyItem.calculatedFieldList.length;
      //          x++
      //       ) {
      //          calculatedFieldItem = surveyItem.calculatedFieldList[x]
      //          calculatedFields
      //          calculatedFields.push({
      //             surveyId: surveyCreated._id,
      //             description: calculatedFieldItem.description,
      //             shortDescription: calculatedFieldItem.shortDescription,
      //             fieldName: calculatedFieldItem.fieldName,
      //             calculationType: calculatedFieldItem.calculationType,
      //             criteria: calculatedFieldItem.criteria ?? null,
      //             group: calculatedFieldItem.group,
      //             position: calculatedFieldItem.position,
      //          })
      //       }
      //       questionsCreated = await SurveyQuestion.insertMany(questions)
      //       questions = []
      //       if (calculatedFields.length > 0) {
      //          calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
      //             calculatedFields,
      //          )
      //          calculatedFields = []
      //       }
      //    } //CLOSE SURVEY LOOP HERE
   
      //    let outputLayouts = superSurveyConfig.surveySuperiorOutputLayout.sort(
      //       (a, b) => a.position - b.position,
      //    )
      //    LogThis(log, `outputLayouts = ${JSON.stringify(outputLayouts)}`, L3)
      //    let outputLayoutFields = []
      //    for (let i = 0; i < outputLayouts.length; i++) {
      //       outputLayout = outputLayouts[i]
      //       outputLayoutFields.push({
      //          surveySuperiorId: createdSurveySuperior._id,
      //          surveyShortName: outputLayout.surveyShortName,
      //          fieldName: outputLayout.fieldName,
      //          outputAsReal: outputLayout.outputAsReal,
      //          showInOutputScreen: outputLayout.showInOutputScreen,
      //          position: outputLayout.position,
      //       })
      //    }
      //    LogThis(
      //       log,
      //       `outputLayoutFields = ${JSON.stringify(outputLayoutFields)}`,
      //       L3,
      //    )
      //    const createdOutputLayout = await SurveySuperiorOutputLayout.insertMany(
      //       outputLayoutFields,
      //    )
   
      //    //Start Output Collection
   
      //    const surveyOutputCollectionName =
      //       `surveyOutputs_${superSurveyConfig.surveyShortName}`.toLocaleLowerCase()
      //    // LogThis(
      //    //    log,
      //    //    `x=${x}; surveyOutputCollectionName=${surveyOutputCollectionName}`,
      //    //    L3,
      //    // )
      //    const collections = await mongoose.connection.db
      //       .listCollections({ name: surveyOutputCollectionName })
      //       .toArray()
      //    const collInfo = collections.find(
      //       collection => collection.name === surveyOutputCollectionName,
      //    )
      //    if (collInfo) {
      //       LogThis(log, `dropping surveyOutputCollectionName`, L3)
      //       let surveyOutputCollection = await mongoose.connection.collection(
      //          surveyOutputCollectionName,
      //       )
   
      //       await surveyOutputCollection.drop()
   
      //       LogThis(log, `dropped surveyOutputCollectionName`, L3)
   
      //       delete mongoose.models[surveyOutputCollectionName]
      //       LogThis(log, `deleted models`, L3)
      //    }
   
      //    let surveyOutputColumns = {}
   
      //    outputLayoutFields.forEach(column => {
      //       LogThis(
      //          log,
      //          `output Layout Field column=${JSON.stringify(column)}`,
      //          L3,
      //       )
      //       switch (column.fieldName) {
      //          case 'SCOLINFO_date_created':
      //             surveyOutputColumns[column.fieldName] =
      //                mongoose.Schema.Types.Date
      //             break
      //          case 'SCOLINFO_date_modified':
      //             surveyOutputColumns[column.fieldName] =
      //                mongoose.Schema.Types.Date
      //             break
      //          default:
      //             surveyOutputColumns[column.fieldName] =
      //                mongoose.Schema.Types.String
      //       }
      //    })
      //    LogThis(
      //       log,
      //       `surveyOutputColumns=${j(Object.entries(surveyOutputColumns))}`,
      //       L3,
      //    )
   
      //    const surveyOutputCollectionSchema = new Schema(surveyOutputColumns)
      //    const surveyOutputCollection = mongoose.model(
      //       surveyOutputCollectionName,
      //       surveyOutputCollectionSchema,
      //    )
   
      //    saveDynamicModelToDB(surveyOutputCollectionName, surveyOutputColumns)
              return result
         
    }

    saveTemplate = async () => {
 
      const superSurveyConfig = this.surveyTemplate
      const owner = this.owner

      const surveySuperior = new SurveyManager('SurveySuperior', 'superSurveyShortName')
      const surveySuperiorResult = await surveySuperior.save(superSurveyConfig.surveySuperiors.surveySuperiorList, "owner", owner)
      this.surveySuperior = surveySuperior

      const surveys = new SurveyManager('Survey', 'surveyShortName')
      const surveysResult = await surveys.save(superSurveyConfig.surveys,"owner", owner)
      this.surveys = surveys
      
      surveySuperiorResult.surveysResult=surveysResult

      const questions = new SurveyFieldManager ('SurveyQuestion', 'fieldName', 'surveyShortName', "surveyId", 'Survey', "_id" )
      const questionsResult = await questions.save(superSurveyConfig.questions, surveysResult)
      this.questions = questions

      surveySuperiorResult.questionsResult=questionsResult

      const calculatedFields = new SurveyFieldManager ('SurveyCalculatedField', 'fieldName', 'surveyShortName', "surveyId", 'Survey', "_id" )
      const calculatedFieldsResult = await calculatedFields.save(superSurveyConfig.calculatedFields, surveysResult)
      this.calculatedFields = calculatedFields
      surveySuperiorResult.calculatedFieldsResult=calculatedFieldsResult

      const outputLayouts = new SurveyOutputManager ('SurveySuperiorOutputLayout', 'fieldName')
      const outputLayoutsResult = await outputLayouts.save(superSurveyConfig.surveySuperiors.outputLayout,"surveySuperiorId", surveySuperiorResult)
      this.outputLayouts = outputLayouts
      surveySuperiorResult.outputLayoutsResult=outputLayoutsResult

      const surveyMulti = new SurveyMultiManager ('SurveyMulti', 'surveyShortName', 'surveyShortName', "surveyId", 'Survey', "_id" )
      const surveyMultiResult = await surveyMulti.save(superSurveyConfig.surveySuperiors.multiSurveys.surveys, surveysResult, "superSurveyId", surveySuperiorResult)
      this.surveyMulti = surveyMulti
      surveySuperiorResult.surveyMultiResult=surveyMultiResult

      return surveySuperiorResult
   
    }
}

module.exports = SurveyTemplateManager