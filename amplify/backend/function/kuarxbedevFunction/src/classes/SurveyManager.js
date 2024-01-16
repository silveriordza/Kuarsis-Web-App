const TemplateManager = require("./TemplateManager")
let {
    Survey
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyValueInArray } = require("../utils/Functions.js")

const identifierFieldName = "superSurveyShortName"
const sourceFilename = "SurveyManager.js"

class SurveyManager extends TemplateManager {
    constructor(templateList, owner){
        super(    
            templateList,
            Survey,
            identifierFieldName,
            owner,
            )
            
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.preProcessTemplate()
        }
    

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate = () => {
        addPropertyValueInArray(this.templateList, "owner", this.owner)
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyManager