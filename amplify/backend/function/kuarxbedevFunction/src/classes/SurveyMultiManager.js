const TemplateManager = require("./TemplateManager")
let {
    SurveyMulti,
 } = require('../models/surveysModel.js')

class SurveyMultiManager extends TemplateManager {
    constructor(templateList){
        super(
            new LoggerSettings("SurveySuperiorManager.js", "constructor"),
            templateList,
            )
    }

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    getTemplatesNamesList = () => {
        this.namesList = this.template.map(survey => (survey.surveyShortName))
        return this.namesList
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyMultiManager