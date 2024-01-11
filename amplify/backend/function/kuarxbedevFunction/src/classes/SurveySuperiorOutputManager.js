const TemplateManager = require("./TemplateManager")
let {
    SurveySuperiorOutputLayout,
 } = require('../models/surveysModel.js')

class SurveySuperiorOutputManager extends TemplateManager {
    constructor(template){
        super(
            template
            )
    }

   
    //deleteAllExistentTemplates is implemented in the parent class TemplateManager, no override required.

    
}

module.exports = SurveySuperiorOutputManager