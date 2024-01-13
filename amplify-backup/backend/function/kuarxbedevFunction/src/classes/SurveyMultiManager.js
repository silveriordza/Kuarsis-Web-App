const TemplateManager = require("./TemplateManager")
let {
    SurveyMulti
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyMatchingValueInArray, addPropertyValueInArray } = require("../utils/Functions.js")


 const identifierFieldName = "surveyShortName"
 const templateLinkField = "surveyShortName"
 const referenceField = "surveyId"
 const externalIdField = "_id"

const sourceFilename = "SurveyMultiManager.js"

class SurveyMultiManager extends TemplateManager {
    constructor(templateList, superSurveyId, templateListToLink){
        super(    
            templateList,
            SurveyMulti,
            identifierFieldName
            )
            this.logChild = new LogManager (sourceFilename, "constructor")
            this.logChild.LogThis(`START`, L3)
            this.logChild.HasDataException(templateListToLink)
            this.templateListToLink = templateListToLink
            this.superSurveyId = superSurveyId
            //this.templateListToLinkLean = templateListToLink.map(template => (template.toObject({ virtuals: true, getters: true })))
                        
            this.preProcessTemplate()
        }
        

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate = () => {
        
        addPropertyValueInArray(this.templateList, "superSurveyId", this.superSurveyId)
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

module.exports = SurveyMultiManager