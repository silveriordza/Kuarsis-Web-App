const TemplateManager = require("./TemplateManager")
let {
    SurveySuperior, L3
 } = require('../models/surveysModel.js')
const { LogManager } = require("./LogManager.js")

const identifierFieldName = "superSurveyShortName"
const sourceFilename = "SurveSuperiorManager.js"

class SurveySuperiorManager extends TemplateManager {
    constructor(template, owner){
        super(    
            template,
            SurveySuperior,
            identifierFieldName,
            owner,
            )
            
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
        }
    }

module.exports = SurveySuperiorManager