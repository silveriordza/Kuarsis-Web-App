/** @format */

let asyncHandler = require("express-async-handler");
let {
  superSurveyConf,
} = require("../models/surveyOnCareTreatmentTalentos2020.js");

let {
  SurveySuperior,
  Survey,
  SurveyQuestion,
  SurveyCalculatedField,
  SurveyCalculatedValue,
  SurveyMulti,
  SurveySuperiorOutputLayout,
  SurveyResponse,
} = require("../models/surveysModel.js");
let { LogThis, LoggerSettings } = require("../utils/Logger.js");

let { rowCleaner } = require("../utils/csvProcessingLib.js");
const srcFileName = "surveyController.js";

const fs = require("fs");

const { buildOutputHeaders } = require("../utils/surveysLib.js");

//let onCareSuperSurvey = require("../models/surveyOnCareTreatmentTalentos2020.json");

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyCreateConfig = asyncHandler(async (req, res) => {
  const { superSurveyConfig } = req.body;
  let ownerId = req.user._id;

  await SurveySuperior.deleteMany({});
  await Survey.deleteMany({});
  await SurveyQuestion.deleteMany({});
  await SurveyMulti.deleteMany({});
  await SurveyCalculatedField.deleteMany({});
  await SurveySuperiorOutputLayout.deleteMany({});

  console.log("superSurveyConfig INPUT values are:");
  console.log(superSurveyConfig);
  console.log("Survey Configuration Values STRINGIFIED:");

  let superSurveyConfigTest = superSurveyConfig;
  const superSurvey = new SurveySuperior({
    owner: ownerId,
    surveyName: superSurveyConfigTest.surveyName,
    surveyShortName: superSurveyConfigTest.surveyShortName,
    description: superSurveyConfigTest.description,
  });

  const createdSurveySuperior = await superSurvey.save();

  let surveysCreated = [];
  let questionsCreated = [];
  let calculatedFieldsCreated = [];
  let surveyCreated = null;
  let questions = [];
  let calculatedFields = [];
  let questionItem = null;
  for (let i = 0; i < superSurveyConfigTest.surveyList.length; i++) {
    let surveyItem = superSurveyConfigTest.surveyList[i];
    let survey = new Survey({
      owner: ownerId,
      surveyName: surveyItem.surveyName,
      surveyShortName: surveyItem.surveyShortName,
      description: surveyItem.description,
      instructions: surveyItem.instructions,
    });
    surveyCreated = await survey.save();
    let multiSurvey = new SurveyMulti({
      owner: ownerId,
      superSurveyId: createdSurveySuperior._id,
      surveyId: surveyCreated._id,
      sequence: i + 1,
    });
    let multiSurveyCreated = await multiSurvey.save();

    surveysCreated.push(surveyCreated);

    for (let x = 0; x < surveyItem.questionList.length; x++) {
      questionItem = surveyItem.questionList[x];
      questions.push({
        surveyId: surveyCreated._id,
        question: questionItem.question,
        questionShort: questionItem.questionShort,
        fieldName: questionItem.fieldName,
        weights: questionItem.weights,
        surveyCol: questionItem.surveyCol,
        superSurveyCol: questionItem.superSurveyCol,
      });
    }

    for (
      let x = 0;
      surveyItem.calculatedFieldList &&
      x < surveyItem.calculatedFieldList.length;
      x++
    ) {
      calculatedFieldItem = surveyItem.calculatedFieldList[x];
      calculatedFields;
      calculatedFields.push({
        surveyId: surveyCreated._id,
        description: calculatedFieldItem.description,
        shortDescription: calculatedFieldItem.shortDescription,
        fieldName: calculatedFieldItem.fieldName,
        isCriteria: calculatedFieldItem.isCriteria,
        criteria: calculatedFieldItem.criteria,
        group: calculatedFieldItem.group,
        sequence: calculatedFieldItem.sequence,
      });
    }
    console.log("About to insert many");
    console.log(JSON.stringify(questions));
    questionsCreated = await SurveyQuestion.insertMany(questions);
    questions = [];
    console.log(JSON.stringify(calculatedFields));
    if (calculatedFields.length > 0) {
      calculatedFieldsCreated = await SurveyCalculatedField.insertMany(
        calculatedFields
      );
      calculatedFields = [];
    }
  }

  let outputLayouts = superSurveyConfigTest.surveySuperiorOutputLayout.sort(
    (a, b) => a.sequence - b.sequence
  );
  let outputLayoutFields = [];
  for (let i = 0; i < outputLayouts.length; i++) {
    outputLayout = outputLayouts[i];
    outputLayoutFields.push({
      surveySuperiorId: createdSurveySuperior._id,
      surveyShortName: outputLayout.surveyShortName,
      fieldName: outputLayout.fieldName,
      sequence: outputLayout.sequence,
    });
  }

  const createdOutputLayout = await SurveySuperiorOutputLayout.insertMany(
    outputLayoutFields
  );

  console.log("about to respond");
  res.status(201).json({
    surveysCreated: surveysCreated,
    questionsCreated: questionsCreated,
    createdOutputLayout: createdOutputLayout,
    createdSurveySuperior: createdSurveySuperior,
  });
});

// @desc    Upload Answers to a Super Survey
// @route   PUT /api/surveys/:id
// @access  Private/Admin
const superSurveyUploadAnswers = asyncHandler(async (req, res) => {
  const functionName = "superSurveyUploadAnswers";
  const log = new LoggerSettings(srcFileName, functionName);

  LogThis(log, `START`);

  await SurveyResponse.deleteMany({});
  await SurveyCalculatedValue.deleteMany({});

  const superSurveyId = req.params.id;
  const user = req.user;
  const owner = req.user._id;

  // Access the uploaded file
  const fileData = req.file;

  const answersData = fileData.buffer.toString("utf8");
  //console.log(answersData);
  let answersRows = answersData.replace(/\r/g, "").split("\n");
  answersRows.shift();
  answersRows.shift();

  //STARTING LOGIC TO SAVE ANSWERS TO DATABASE
  /**
   * Get the Super Survey and the list of its Surveys
   */
  LogThis(log, `answerRows=${answersRows}`);

  let multiSurveys = await SurveyMulti.find({
    superSurveyId: superSurveyId,
    owner: owner,
  })
    .select("surveyId sequence")
    .sort({ sequence: 1 })
    .lean();

  if (!multiSurveys) {
    res.status(404);
    throw new Error("Multi Surveys not found");
  }

  const surveyIdsList = [];

  multiSurveys.map((multiSurveyItem) => {
    surveyIdsList.push(multiSurveyItem.surveyId);
  });

  LogThis(log, `surveyIdsList=${surveyIdsList}`);

  const questions = await SurveyQuestion.find({
    surveyId: { $in: surveyIdsList },
  })
    .populate("surveyId")
    .sort({ superSurveyCol: 1 })
    .lean();

  LogThis(log, `resultset questions=${JSON.stringify(questions)}`);

  const calculatedFields = await SurveyCalculatedField.find({
    surveyId: { $in: surveyIdsList },
  })
    .populate("surveyId")
    .lean();

  LogThis(
    log,
    `Calculated Fields Found: calculatedFields=${JSON.stringify(
      calculatedFields
    )};`
  );

  const surveyResponses = [];

  const calculatedValues = [];

  let allSurveyQuestions = [];
  let allCalculatedFields = [];
  surveyIdsList.map((surveyId) => {
    let surveyQuestions = questions
      .filter(
        (question) => question.surveyId._id.toString() === surveyId.toString()
      )
      .sort((a, b) => a.superSurveyCol - b.superSurveyCol);

    allSurveyQuestions = [...allSurveyQuestions, ...surveyQuestions];

    let surveyCalculatedFields = calculatedFields
      .filter(
        (calculatedField) =>
          calculatedField.surveyId._id.toString() === surveyId.toString()
      )
      .sort((a, b) => a.sequence - b.sequence);

    allCalculatedFields = [...allCalculatedFields, ...surveyCalculatedFields];
  });

  LogThis(log, `allSurveyQuestions=${JSON.stringify(allSurveyQuestions)};`);

  LogThis(
    log,
    `Filtered calculated fields allCalculatedFields=${JSON.stringify(
      allCalculatedFields
    )};`
  );

  let questionDesc = "";
  let questionShortDesc = "";
  let csv = "";
  questions.map((q) => {
    questionDesc = questionDesc + q.question + ",";
    questionShortDesc = questionShortDesc + q.questionShort + ",";
  });

  allCalculatedFields.map((c) => {
    questionDesc = questionDesc + c.description + ",";
    questionShortDesc = questionShortDesc + c.shortDescription + ",";
  });
  questionDesc = questionDesc.slice(0, -1);
  questionShortDesc = questionShortDesc.slice(0, -1);
  questionDesc = questionDesc + "\n";
  questionShortDesc = questionShortDesc + "\n";

  csv = csv + questionDesc + questionShortDesc;

  let rowClean = "";
  let answers = [];
  let respondentId = "";

  for (let r = 0; r < answersRows.length; r++) {
    LogThis(
      log,
      `Processing Row r=${r}; allSurveyQuestions length=${allSurveyQuestions.length}`
    );
    rowClean = rowCleaner(answersRows[r]);
    answers = rowClean.split(",");

    LogThis(log, `answers=${answers}`);
    if (answers[0] == "" || answers[0].trim() == "") {
      break;
    }
    respondentId = answers[0].trim();
    let row = r + 1;
    for (let a = 0; a < allSurveyQuestions.length; a++) {
      LogThis(log, `processing question a=${a}`);
      // LogThis(
      //   log,
      //   `row=${row}; allSurveyQuestions[a]._id=${allSurveyQuestions[a]._id}; answers[a]=${answers[a]}`
      // );
      let surveyQuestion = allSurveyQuestions[a];
      //transform the question answer value into the weighted answer for that Survey.
      let weightedResponse = null;
      let response = null;
      let isWeighted = null;
      // LogThis(
      //   log,
      //   `surveyQuestion=${JSON.stringify(
      //     surveyQuestion
      //   )};surveyQuestion.weights=${JSON.stringify(surveyQuestion.weights)}`
      // );

      if (
        surveyQuestion.weights &&
        Object.keys(surveyQuestion.weights).length >
          0 /*&& surveyQuestion.weights.length > 0*/
      ) {
        // LogThis(
        //   log,
        //   `weighting: answers[${a}]=${
        //     answers[a]
        //   };surveyQuestion.weights=${JSON.stringify(
        //     surveyQuestion.weights
        //   )}; weightedValue=${
        //     surveyQuestion.weights[
        //       answers[a].toString().trim().replace(/'\n'/g, "")
        //     ]
        //   }`
        // );
        let answerA = answers[a].toString().trim().replace(/'\n'/g, "");
        if (answerA == "") {
          answerA = "0";
        }
        weightedResponse = surveyQuestion.weights[answerA];
        if (!weightedResponse) {
          weightedResponse = "0";
        }
        response = answerA;
        answers[a] = weightedResponse;
        isWeighted = true;
        LogThis(log, `final weight: answer=${weightedResponse}`);
      } else {
        let answerA = answers[a];
        if (answerA == "") {
          answerA = "0";
        }
        response = answerA;
        weightedResponse = answerA;
        isWeighted = false;
        LogThis(log, `no weighted: answer=${weightedResponse}`);
      }

      surveyResponses.push({
        questionId: surveyQuestion._id,
        respondentId: respondentId,
        row: row,
        col: a + 1,
        response: response,
        weightedResponse: weightedResponse,
        isWeighted: isWeighted,
      });

      //LogThis(log, `surveyResponse cycle=${JSON.stringify(surveyResponses)}`);
      if (isWeighted) {
        LogThis(
          log,
          `Adding csv weighted answer: weightedResponse=${weightedResponse}`
        );
        weightedResponse = weightedResponse ?? "";
        csv = csv + weightedResponse.toString() + ",";
      } else {
        csv = csv + response.toString() + ",";
      }
    }

    for (let a = 0; a < allCalculatedFields.length; a++) {
      // LogThis(
      //   log,
      //   `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}; answers[a]=${answers[a]}`
      // );
      LogThis(
        log,
        `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}}`
      );
      //let col = a + 1
      allCalculatedField = allCalculatedFields[a];
      let value = null;
      if (allCalculatedField.isCriteria) {
        let criteria = allCalculatedField.criteria;
        LogThis(
          log,
          `Criteria in Question: criteria=${JSON.stringify(criteria)}`
        );
        let fieldNameValue = allCalculatedFields.find((calField) => {
          LogThis(log, `calField=${JSON.stringify(calField)}`);
          return calField.fieldName == criteria.fieldNameValue[0];
        });
        LogThis(log, `fieldNameValue1=${JSON.stringify(fieldNameValue)}`);
        let sequence = fieldNameValue.sequence;
        calValue = calculatedValues.find(
          (value) => value.col == sequence && value.row == row
        );
        LogThis(
          log,
          `About to get into case > calValue=${JSON.stringify(
            calValue
          )}; criteria.operator=${JSON.stringify(criteria.operator)}`
        );
        switch (criteria.operator) {
          case ">":
            LogThis(
              log,
              `Inside case: calValue.value=${calValue.value};criteria.value=${criteria.value};criteria.resultIfTrue=${criteria.resultIfTrue}`
            );
            if (calValue.value > criteria.value) {
              value = criteria.resultIfTrue;
              LogThis(log, `Creteria is true: value=${value}`);
            } else {
              value = criteria.resultIfFalse;
              LogThis(log, `Creteria is false: value=${value}`);
            }
            break;
          default:
            value = null;
            LogThis(log, `Case entered default: value${value}`);
        }
      } else {
        // LogThis(
        //   log,
        //   `Field is not criteria: allCalculatedField=${JSON.stringify(
        //     allCalculatedField
        //   )}`
        // );

        let groups = allCalculatedField.group;
        groups.map((group) => {
          // LogThis(
          //   log,
          //   ` row=${row}; col=${a + 1}; group=${group} answers[group]=${
          //     answers[group]
          //   }; parseInt(answers[group])=${parseInt(answers[group])}`
          // );

          value = value + parseInt(answers[group]);
        });
      }
      LogThis(
        log,
        `Pushing value: calculatedFieldId=${
          allCalculatedFields[a]._id
        }; row=${row};col=${a + 1}; value=${value}; `
      );
      if (typeof value != "number" || value == null || isNaN(value)) {
        value = -1000;
      }
      calculatedValues.push({
        calculatedFieldId: allCalculatedFields[a]._id,
        respondentId: respondentId,
        row: row,
        col: a + 1,
        value: value,
      });
      csv = csv + value.toString() + ",";
    }
    csv = csv.slice(0, -1);
    csv = csv + "\n";
  } //This bracket

  //LogThis(log, `surveyResponses=${JSON.stringify(surveyResponses)}`);
  LogThis(log, `Inserting responses`);
  const surveyResponseCreated = await SurveyResponse.insertMany(
    surveyResponses
  );

  //LogThis(log, `calculatedValues=${JSON.stringify(calculatedValues)}`);
  LogThis(log, `Inserting calculatedValues`);
  const surveyCalculatedValuesCreated = await SurveyCalculatedValue.insertMany(
    calculatedValues
  );

  const outputLayoutsResult = await SurveySuperiorOutputLayout.find({
    surveySuperiorId: superSurveyId,
  }).sort({ sequence: 1 });

  // // questions;
  // // calculatedFields;
  // // surveyResponses;
  // // calculatedValues;
  //LogThis(log, `outputLayoutsResult=${JSON.stringify(outputLayoutsResult)}`);
  LogThis(log, `buildOutputHeaders`);
  const outputLayout = buildOutputHeaders(
    questions,
    calculatedFields,
    outputLayoutsResult
  );

  LogThis(log, `outputLayouts=${JSON.stringify(outputLayout)}`);

  let csvLayout = "";
  let layout = null;
  for (let o = 0; o < outputLayout.length - 1; o++) {
    layout = outputLayout[o];
    csvLayout = csvLayout + layout.description + ",";
  }
  layout = outputLayout[outputLayout.length - 1];
  csvLayout = csvLayout + layout.description + "\n";

  for (let o = 0; o < outputLayout.length - 1; o++) {
    layout = outputLayout[o];
    csvLayout = csvLayout + layout.shortDescription + ",";
  }
  layout = outputLayout[outputLayout.length - 1];
  csvLayout = csvLayout + layout.shortDescription + "\n";

  const cols = [];
  for (let o = 0; o < outputLayout.length; o++) {
    layout = outputLayout[o];
    LogThis(
      log,
      `layout.fieldId=${layout.fieldId}; layout.fieldId=${layout.isCalculated}`
    );
    if (layout.isCalculated) {
      LogThis(log, `layout.isCalculated=${layout.isCalculated}`);
      cols.push(
        calculatedValues
          .filter((val) => val.calculatedFieldId == layout.fieldId)
          .sort((a, b) => a.row - b.row)
      );
    } else {
      let responses = surveyResponses.filter(
        (val) => val.questionId == layout.fieldId
      );
      //LogThis(log, `responsesFound = ${JSON.stringify(responses)}`);
      responses = responses.sort((a, b) => a.row - b.row);
      //LogThis(log, `responsesSorted = ${JSON.stringify(responses)}`);
      cols.push(responses);
    }
  }
  LogThis(
    log,
    `cols=${JSON.stringify(cols)}; outputLayout=${JSON.stringify(outputLayout)}`
  );

  //console.log(`cols=${JSON.stringify(cols)}`);
  let value = null;
  LogThis(
    log,
    `cols Length=${cols.length}; rows length=${cols[0].length}; outputLayout Length=${outputLayout.length}`
  );
  for (let r = 0; r < cols[0].length; r++) {
    //LogThis(log, `Current Row length=${cols[r].length}`);
    for (let c = 0; c < cols.length - 1; c++) {
      LogThis(log, `Processing Col=${c}; row=${r}`);
      console.log(`Processing Col=${c}; row=${r}`);
      value = cols[c][r];
      LogThis(log, `value cycle=${JSON.stringify(value)}`);
      if ("isWeighted" in value) {
        if (value.isWeighted) {
          value = value.weightedResponse;
        } else {
          value = value.response;
        }
      } else {
        value = value.value;
      }

      if (value == null || value == undefined) {
        value = "";
      }
      LogThis(log, `value=${value}`);
      csvLayout = csvLayout + value + ",";
    }
    LogThis(log, `Processing Last Col=${outputLayout.length - 1}; row=${r}`);
    value = cols[outputLayout.length - 1][r];

    if ("isWeighted" in value) {
      if (value.isWeighted) {
        value = value.weightedResponse;
      } else {
        value = value.response;
      }
    } else {
      value = value.value;
    }

    if (value == null || value == undefined) {
      value = "";
    }
    LogThis(log, `value=${value}`);
    csvLayout = csvLayout + value + "\n";
  }

  if (!questions) {
    res.status(404);
    throw new Error("Questions not found");
  }
  //Form the CSV output file

  //ENDING LOGIC TO SAVE ANSWERS TO DATABASE

  if (answersRows.length > 0) {
    LogThis(log, `END`);
    // res.status(200).json({
    //   // owner: user._id,
    //   // superSurveyId: superSurveyId,
    //   // multiSurveys: multiSurveys,
    //   // surveyIdsList: surveyIdsList,
    //   // allSurveyQuestions: allSurveyQuestions,
    //   // surveyResponseCreated: surveyResponseCreated,
    //   // surveyCalculatedValuesCreated: surveyCalculatedValuesCreated,
    //   // answerRowsLength: answersRows.length,
    //   // //questions: questions,
    //   // answersRows: answersRows,
    //   csv: csv,
    // });
    //console.log(csv);
    console.log(csvLayout);
    // LogThis(
    //   log,
    //   `superSurveyId=${superSurveyId}; surveyFields=${JSON.stringify(
    //     surveyFields
    //   )}`
    // );

    // res.writeHead(200, {
    //   "Content-Type": "text/plain",
    //   "Content-Length": Buffer.byteLength(csv),
    // });
    // res.write(csv);
    // res.end();

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": Buffer.byteLength(csvLayout),
    });
    res.write(csvLayout);
    res.end();
  } else {
    res.status(404);
    throw new Error("Uncought Exception loading answers");
  }
});

module.exports = {
  superSurveyUploadAnswers,
  superSurveyCreateConfig,
};
