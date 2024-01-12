const TemplateManager = require("./TemplateManager")
let {
    SurveyQuestion
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyValueInArray } = require("../utils/Functions.js")

const identifierFieldName = "fieldName"
const templateLinkField = "surveyShortName"
const templateReferenceField = "surveyId"

const sourceFilename = "SurveyQuestionManager.js"

class SurveyQuestionManager extends TemplateManager {
    constructor(templateList, tamplateToLink){
        super(    
            templateList,
            SurveyQuestion,
            identifierFieldName,
            owner,
            )
            
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.preProcessTemplate()
        }
    

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate = () => {
        
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyQuestionManager