let {
    SurveySuperior,
    Survey,
    SurveyQuestion,
    SurveyCalculatedField,
    SurveyMulti,
    MonkeyConfig,
    MonkeyNewResponse,
    SurveySuperiorOutputLayout,
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
const SurveyTemplateManager = require('./SurveyTemplateManager.js')

const { LogManager } = require('./LogManager.js')
const SurveyFieldManager = require('./SurveyFieldManager.js')
const SurveyOutputManager = require('./SurveyOutputManager.js')
const SurveyMultiTemplateManager = require('./SurveyMultiTemplateManager.js')
//const MongoDBManager = require('./MongoDBManager.js')
const SurveySuperiorManager = require('./SurveySuperiorManager.js')
const SurveyMultiManager = require('./SurveyMultiManager.js')
const SurveyManager = require('./SurveyManager.js')
const SurveyQuestionManager = require('./SurveyQuestionManager.js')
const SurveyCalculatedFieldManager = require('./SurveyCalculatedFieldManager.js')
const SurveyMonkeyIntegratedManager = require('./SurveyMonkeyIntegratedManager.js')
const SurveySuperiorOutputLayoutManager = require('./SurveySuperiorOutputLayoutManager.js')

const sourceFile = "SurveyProcessManager.js"
 class SurveyProcessManager {
    constructor() {
       this.log = new LoggerSettings(this.sourceFile, "constructor")
       
       this.superSurveyConfig = null
       this.monkeyManager = new MonkeyManager()
       this.logNew = new LogManager(sourceFile, "constructor")
       this.superSurvey = null
       this.multiSurveys=null
       this.surveys = null
       this.questions = null
       this.calculatedFields = null
       this.outputs = null
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
      
      let result = null
      this.superSurveyObjects = {}

      this.superSurvey = new SurveySuperiorManager ()
      result = await this.superSurvey.load(superSurveyShortName)  
      this.superSurveyConfig = {superSurvey: result}
      this.superSurveyObjects.superSurvey = this.superSurvey

      this.multiSurveys = new SurveyMultiManager()
      this.superSurveyId = this.superSurveyConfig.superSurvey._id
      result = await this.multiSurveys.load(this.superSurveyId)
      this.superSurveyConfig.multiSurveys=result
      this.superSurveyObjects.multiSurveys = this.multiSurveys

      this.surveys = new SurveyManager ()
      result = await this.surveys.loadMatchList(this.superSurveyConfig.multiSurveys, 'surveyId')
      this.superSurveyConfig.surveys = result
      this.superSurveyObjects.surveys = this.surveys

      this.multiSurveys.combineSurveys(this.surveys)

      this.surveys.setConfigsCombo(this.multiSurveys.getSurveysCombo())

      this.questions = new SurveyQuestionManager()  
      
      result = await this.questions.loadMatchList(this.superSurveyConfig.surveys)
      this.superSurveyConfig.questions=result
      this.surveys.combineQuestionsConfig(result) 
      this.superSurveyObjects.questions = this.questions

      this.calculatedFields = new SurveyCalculatedFieldManager() 
 
      result = await this.calculatedFields.loadMatchList(this.superSurveyConfig.surveys)
      this.superSurveyConfig.calculatedFields=result
      this.surveys.combineCalculatedFieldsConfig(result) 
      this.superSurveyObjects.calculatedFields = this.calculatedFields
      //this.multiSurvey.combineSurveys(this.surveys)
      //this.superSurvey.combineMultiSurvey(this.multiSurveys, this.surveys)

      //this.superSurvey.combineSurveysConfig(this.surveys)

      this.surveySuperiorOutputLayout = new SurveySuperiorOutputLayoutManager()
      result = await this.surveySuperiorOutputLayout.loadSortedAsc(this.superSurveyId)
      this.superSurveyConfig.outputLayouts=result
      this.superSurveyObjects.surveySuperiorOutputLayout = this.surveySuperiorOutputLayout

      result = this.superSurvey.getConfigsCombo()
      result[0].surveys=this.surveys.getConfigsCombo()
      result[0].outputLayouts=this.surveySuperiorOutputLayout.getConfigsCombo()


      this.superSurveyConfig.configsCombo = this.superSurvey.getConfigsCombo()
      
      return this.superSurveyConfig
    }
   
    async integrateSurveyWithMonkey (superSurveyShortName){
      this.logNew.setFunctionName("integrateSurveyWithMonkey")
      
      await this.loadTemplate(superSurveyShortName) 

     
      //return this.superSurveyConfig


      //  const surveyTemplate = this.superSurveyConfig
      //  let superSurveyConfig = this.superSurveyConfig
      //  //const owner = this.owner
      //  const superSurveyElements = this.superSurveyElements


      //   const superSurveyConf = superSurveyElements.superSurvey.getConfigs()
      //   const multiSurveyConf = surveyTemplate?.multiSurveys
      //   const surveysConf = surveyTemplate?.surveys
      //   const questionsConf = surveyTemplate?.surveys.map( 
      //    survey => survey.questions.map(field => {
      //      field.surveyPosition = survey.position 
      //      field.surveyShortName = survey.surveyShortName
      //      return field
      //     }
      //  ))
      //   const calculatedFieldsConf = surveyTemplate?.surveys.map( 
      //     survey => survey.calculatedFields.map(field => {
      //       field.surveyPosition = survey.position 
      //       field.surveyShortName = survey.surveyShortName
      //       return field
      //      }
      //   ))
        //const monkeyManager = new MonkeyManager()

        //const mondoDbManager = new MongoDBManager()

      //   this.logNew.HasDataMultipeEx("superSurveyConfig,multiSurvey,surveys,questions,calculatedFields",superSurveyConf,multiSurveyConf,surveysConf,questionsConf,calculatedFieldsConf)
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
         
         let superSurveyConf = this.superSurveyConfig.configsCombo[0]
         const monkeyConfigs =
            await this.monkeyManager.getMonkeyConfigByIdorName(
              superSurveyConf?.monkeyId,
              superSurveyConf?.surveyName,
            )

         this.surveyMonkeyIntegratedConfig = new SurveyMonkeyIntegratedManager()

         const surveyMonkeyIntegratedConfig = this.surveyMonkeyIntegratedConfig


         const result = await surveyMonkeyIntegratedConfig.integrateConfigs(this.superSurveyConfig.configsCombo, monkeyConfigs)
         return result
         
    }

    saveTemplate = async () => {
 
      const superSurveyConfig = this.surveyTemplate
      const owner = this.owner

      const surveySuperior = new SurveyTemplateManager('SurveySuperior', 'superSurveyShortName')
      const surveySuperiorResult = await surveySuperior.save(superSurveyConfig.surveySuperiors.surveySuperiorList, "owner", owner)
      this.surveySuperior = surveySuperior

      const surveys = new SurveyTemplateManager('Survey', 'surveyShortName')
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

      const surveyMulti = new SurveyMultiTemplateManager ('SurveyMulti', 'surveyShortName', 'surveyShortName', "surveyId", 'Survey', "_id" )
      const surveyMultiResult = await surveyMulti.save(superSurveyConfig.surveySuperiors.multiSurveys, surveysResult, "superSurveyId", surveySuperiorResult)
      this.surveyMulti = surveyMulti
      surveySuperiorResult.surveyMultiResult=surveyMultiResult

      return surveySuperiorResult
   
    }
}

module.exports = SurveyProcessManager