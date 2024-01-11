const TemplateManager = require("./TemplateManager")
let {
    Survey,
 } = require('../models/surveysModel.js')

class SurveyManager extends TemplateManager {
    constructor(owner, surveyTemplate){
        super(
            new LoggerSettings("SurveyManager.js", "constructor"),
            surveyTemplate,
            owner,
            )
    }

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    getTemplatesNamesList = () => {
        this.namesList = this.template.map(survey => (survey.surveyShortName))
        return this.namesList
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyManager