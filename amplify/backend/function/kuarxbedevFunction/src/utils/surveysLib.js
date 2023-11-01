/** @format */
let { LogThis, LoggerSettings } = require("../utils/Logger.js");
const srcFileName = "surveysLib.js";

const buildOutputHeaders = (fields, calculatedfields, outputLayout) => {
  const log = new LoggerSettings(srcFileName, "buildOutputHeaders");
  let isCalculated = false;
  let outputFields = [];
  for (let i = 0; i < outputLayout.length; i++) {
    isCalculated = false;
    layout = outputLayout[i];
    let field = fields.find(
      (field) =>
        field.surveyId.surveyShortName == layout.surveyShortName &&
        field.fieldName == layout.fieldName
    );
    if (!field) {
      field = calculatedfields.find(
        (field) =>
          field.surveyId.surveyShortName == layout.surveyShortName &&
          field.fieldName == layout.fieldName
      );
      isCalculated = true;
    }
    if (!field) {
      throw new Error(
        `Error output layout field not found: ${JSON.stringify(layout)}`
      );
    }

    outputFields = [
      ...outputFields,
      {
        fieldId: field._id,
        surveyShortName: field.surveyId.surveyShortName,
        description: isCalculated ? field.description : field.question,
        shortDescription: isCalculated
          ? field.shortDescription
          : field.questionShort,
        fieldName: field.fieldName,
        outputSequence: layout.sequence,
        valuePosition: isCalculated ? field.sequence : field.superSurveyCol,
        isCalculated: isCalculated,
        outputAsReal: layout.outputAsReal,
        field: field,
      },
    ];
    //LogThis(log, `Field found=${JSON.stringify(field)}`);
    // layout.fieldFound = field;
    // outputLayout[i] = layout;
    // LogThis(log, `outputLayoutWithField=${JSON.stringify(outputLayout[i])}`);
  }
  LogThis(log, `outputFields=${JSON.stringify(outputFields)}`);
  return outputFields;
};

module.exports = {
  buildOutputHeaders,
};
