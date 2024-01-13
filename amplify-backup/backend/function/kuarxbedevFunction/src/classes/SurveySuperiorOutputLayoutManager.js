const TemplateManager = require("./TemplateManager")
let {
    SurveySuperiorOutputLayout
 } = require('../models/surveysModel.js')
const { LogManager, L3} = require("./LogManager.js")
const { addPropertyValueInArray } = require("../utils/Functions.js")

const identifierFieldName = "fieldName"
const sourceFilename = "SurveySuperiorOutputLayoutManager.js"

class SurveySuperiorOutputLayoutManager extends TemplateManager {
    constructor(templateList, surveySuperiorId){
        super(    
            templateList,
            SurveySuperiorOutputLayout,
            identifierFieldName,
            )
    
            this.log = new LogManager (sourceFilename, "constructor")
            this.log.LogThis(`START`, L3)
            this.surveySuperiorId = surveySuperiorId
            this.preProcessTemplate()
        }
        preProcessTemplate = () => 
        {
            addPropertyValueInArray(this.templateList, "surveySuperiorId", this.surveySuperiorId)
        }
        
    }

module.exports = SurveySuperiorOutputLayoutManager