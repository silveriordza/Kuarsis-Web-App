
const { LogManager, L3} = require("./LogManager.js")
const MongoDBManager = require("./MongoDBManager.js")
const TemplateManager = require("./TemplateManager.js")

const sourceFilename = "SurveyMonkeyIntegratedManager.js"
const collectionName = "SurveyMonkeyIntegrated"
const identifierFieldName = "superSurveyShortName"

class SurveyMonkeyIntegratedManager extends TemplateManager {
    constructor(superSurveyConfigs, monkeyConfigs){
        super(collectionName, identifierFieldName)
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.mongoDBManager = new MongoDBManager(collectionName)
            this.superSurveyConfigs = superSurveyConfigs[0]
            this.monkeyConfigs = monkeyConfigs
        }

        async save (){
            const superSurveyConfig = this.superSurveyConfigs
            const monkeyConfigs = this.monkeyConfigs
            const config = {}
            config.superSurveyId = superSurveyConfig._id
            config.monkeyId = monkeyConfigs.survey.id
            config.superSurveyShortName = superSurveyConfig.superSurveyShortName
            config.surveyConfigs = superSurveyConfig
            const configs = [config]
            this.configs = configs
            return await super.save() 
        }
        
        integrateSuperSurvey(){
            const superSurveyConfig = this.superSurveyConfigs
            const monkeyConfigs = this.monkeyConfigs
            
            //superSurveyConfig.surveyConfigs = superSurveyConfig
            superSurveyConfig.monkeyInfo = {monkeyId: monkeyConfigs.surveyMonkeyId}
            //this.superSurveyConfigs = config
            return this.superSurveyConfigs
        }
       
        integrateSurveys(){
            const superSurveyConfig = this.superSurveyConfigs
            const monkeyConfigs = this.monkeyConfigs

            const surveys = superSurveyConfig.surveys
            const monkeyPages = monkeyConfigs.survey.pages

            const surveysMap = new Map()
            const monkeyPagesMap = new Map()
            
            surveys.forEach(survey => {
                surveysMap.set(survey.monkeyInfo.position, survey)
            })

            monkeyPages.forEach(page => {
                monkeyPagesMap.set(page.position, page)
            })

           
            for(const [position, survey] of surveysMap){
                let monkeyPage = monkeyPagesMap.get(position)

                if(this.log.HasData(monkeyPage)){ 
                survey.monkeyInfo.id=monkeyPage.id
                survey.title = monkeyPage.title
                survey.description = monkeyPage.description
            } else{
                survey.monkeyInfo.id=null
                survey.title = null
                survey.description = null
            }
            }
            this.surveysMap = surveysMap
            this.monkeyPagesMap = monkeyPagesMap

            return this.superSurveyConfigs
        }

        integrateQuestions(){
            const surveysMap = this.surveysMap
            const monkeyPagesMap = this.monkeyPagesMap
           
            const surveyQuestionsMap = new Map()
            const monkeyQuestionsMap = new Map()


            


            surveys.forEach(survey => {
                questionsMap = new Map()
                survey.questions.forEach(question => questionsMap.set(question.monkeyInfo.position, question))

                surveyQuestionsMap.set(survey.surveyShortName, questionsMap)
            })

            monkeyPages.forEach( page => {
                questionsMap = new Map()
                page.questions.forEach(question => questionsMap.set(question.position.position, question))

                surveyQuestionsMap.set(survey.surveyShortName, questionsMap)
            })





            return this.superSurveyConfigs
        }
        
        async integrateConfigs(){
            this.integrateSuperSurvey() 
            this.integrateSurveys()
            return await this.save()
        }
        
        
    }

    

module.exports = SurveyMonkeyIntegratedManager