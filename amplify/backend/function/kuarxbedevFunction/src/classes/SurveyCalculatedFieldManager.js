const TemplateManager = require("./TemplateManager")
let {
    SurveyCalculatedField
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyMatchingValueInArray } = require("../utils/Functions.js")


 const identifierFieldName = "fieldName"
 const templateLinkField = "surveyShortName"
 const referenceField = "surveyId"
 const externalReferenceField = "_id"

const sourceFilename = "SurveyCalculatedFieldManager.js"

class SurveyCalculatedFieldManager extends TemplateManager {
    constructor(templateList, templateListToLink){
        super(    
            templateList,
            SurveyCalculatedField,
            identifierFieldName
            )
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.log.HasDataException(templateListToLink)
            this.templateListToLink = templateListToLink
                        
            this.preProcessTemplate()
        }
        

    //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate = () => {
        addPropertyMatchingValueInArray(
            this.templateList,
            referenceField,
            templateLinkField,
            externalReferenceField,
            this.templateListToLink)
            //SurveyQuestionManager.referenceField='hola'
    }
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveyCalculatedFieldManager