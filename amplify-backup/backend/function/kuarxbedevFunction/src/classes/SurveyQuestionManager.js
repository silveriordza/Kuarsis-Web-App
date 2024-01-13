const TemplateManager = require("./TemplateManager")
let {
    SurveyQuestion
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyMatchingValueInArray } = require("../utils/Functions.js")


 const identifierFieldName = "fieldName"
 const templateLinkField = "surveyShortName"
 const referenceField = "surveyId"
 const externalIdField = "_id"

const sourceFilename = "SurveyQuestionManager.js"

class SurveyQuestionManager extends TemplateManager {
    constructor(templateList, templateListToLink){
        super(    
            templateList,
            SurveyQuestion,
            identifierFieldName
            )
            this.logChild = new LogManager (sourceFilename, "constructor")
            this.logChild.LogThis(`START`, L3)
            this.logChild.HasDataException(templateListToLink)
            this.templateListToLink = templateListToLink
            //this.templateListToLinkLean = templateListToLink.map(template => (template.toObject({ virtuals: true, getters: true })))
                        
            this.preProcessTemplate()
        }
        

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate = () => {
        addPropertyMatchingValueInArray(
            this.templateList,
            referenceField,
            templateLinkField,
            externalIdField,
            this.templateListToLink)
            //SurveyQuestionManager.referenceField='hola'
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyQuestionManager