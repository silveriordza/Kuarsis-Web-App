const TemplateManager = require("./TemplateManager")
let {
    SurveySuperior
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyValueInArray } = require("../utils/Functions.js")

const identifierFieldName = "surveyShortName"
const sourceFilename = "SurveSuperiorManager.js"

class SurveySuperiorManager extends TemplateManager {
    constructor(templateList=null, owner=''){
        super(    
            templateList,
            SurveySuperior,
            identifierFieldName,
            owner,
            )
            
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.preProcessTemplate()
        }
        preProcessTemplate = () => 
        {   this.log.HasDataMultipeEx("templateList, owner",
        this.templateList, this.owner)
            addPropertyValueInArray(this.templateList, "owner", this.owner)
        }
        
    }

module.exports = SurveySuperiorManager