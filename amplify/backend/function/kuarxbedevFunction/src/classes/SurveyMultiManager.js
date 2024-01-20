const SurveyFieldManager = require("./SurveyFieldManager")
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyMatchingValueInArray } = require("../utils/Functions.js")

const sourceFilename = "SurveyMultiManager.js"

class SurveyMultiManager extends SurveyFieldManager {
    constructor(collectionName, identifierFieldName, templateFieldToLink, referencedLinkField, linkedCollection, externalLinkField){
        super(     
            collectionName, identifierFieldName, templateFieldToLink, referencedLinkField, linkedCollection, externalLinkField
            )
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.preProcessTemplate = this.preProcessTemplate.bind(this); // Bind A to 
        }
        
        
     //Updates the namesList in the parent TemplateMangaer based on specific function for the type of template.
    preProcessTemplate ()  {
        this.setOneToManyConstantLink(this.linkField, this.linkValue)
        this.prepareOneToManyConstantTemplate()
    }

    async save(templateList, collectionToLInk, linkField, linkValue){
        this.log.setFunctionName('save')
        this.templateList=templateList
        this.linkField=linkField 
        this.linkValue=linkValue[0][this.externalLinkField]
        this.collectionToLink=collectionToLInk
        
        SurveyMultiManager.prototype.preProcessTemplate.call(this);
        return await super.save(this.templateList, this.collectionToLink)
    }
    
}

module.exports = SurveyMultiManager