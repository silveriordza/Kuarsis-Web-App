let {
    SurveySuperior,
    Survey,
    SurveyQuestion,
    SurveyCalculatedField,
    SurveyMulti,
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
 const MonkeyManager = require('../classes/MonkeyManager.js')
 
 class SurveyTemplateManager {
    constructor(surveyTemplate) {
       this.sourceFile = 'SurveyTemplateManager.js'
       this.surveyTemplate = surveyTemplate
       this.monkeyManager = new MonkeyManager()
    }

    process = async () => {

        const superSurveyConfig = this.surveyTemplate.superSurveyConfig
        
        const result = await SurveySuperior.deleteOne({
            surveyShortName: superSurveyConfig.surveyShortName,
         })
   
         if (!result || !result.acknowledged) {
            throw new Error(
               `There was a problem attempting to delete a potentially existing survey for survey name: ${superSurveyConfig.surveyShortName}`,
            )
         }
    }
}

module.exports = SurveyTemplateManager