/** @format */

let asyncHandler = require("express-async-handler");
let {
  superSurveyConf,
} = require("../models/surveyOnCareTreatmentTalentos2020.js");
let {
  SuperSurvey,
  Survey,
  Question,
  MultiSurvey,
  SuperSurveyCollected,
  SurveyResponse,
} = require("../models/surveysModel.js");
let { LogThis, LoggerSettings } = require("../utils/Logger.js");

let { rowCleaner } = require("../utils/csvProcessingLib.js");
const srcFileName = "surveyController.js";

const fs = require("fs");

//let onCareSuperSurvey = require("../models/surveyOnCareTreatmentTalentos2020.json");

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyCreateConfig = asyncHandler(async (req, res) => {
  const { superSurveyConfig } = req.body;
  let ownerId = req.user._id;

  await SuperSurvey.deleteMany({});
  await Survey.deleteMany({});
  await Question.deleteMany({});
  await MultiSurvey.deleteMany({});

  console.log("superSurveyConfig INPUT values are:");
  console.log(superSurveyConfig);
  console.log("Survey Configuration Values STRINGIFIED:");

  let superSurveyConfigTest = superSurveyConfig;
  const superSurvey = new SuperSurvey({
    owner: ownerId,
    surveyName: superSurveyConfigTest.surveyName,
    surveyShortName: superSurveyConfigTest.surveyShortName,
    description: superSurveyConfigTest.description,
  });

  const createdSuperSurvey = await superSurvey.save();

  let surveysCreated = [];
  let questionsCreated = [];
  let surveyCreated = null;
  let questions = [];
  //let question = null;
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
    let multiSurvey = new MultiSurvey({
      owner: ownerId,
      superSurveyId: createdSuperSurvey._id,
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
        subScale: questionItem.subScale,
        sequence: questionItem.sequence,
      });
    }
    console.log("About to insert many");
    console.log(JSON.stringify(questions));
    questionsCreated = await Question.insertMany(questions);
    questions = [];
    console.log("Inserted many");
  }

  console.log("about to respond");
  res.status(201).json({
    surveysCreated: surveysCreated,
    questionsCreated: questionsCreated,
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

  let multiSurveys = await MultiSurvey.find({
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
  const questions = await Question.find({
    surveyId: { $in: surveyIdsList },
  })
    .select("_id surveyId sequence")
    .lean();
  LogThis(log, `resultset questions=${JSON.stringify(questions)}`);
  const surveyResponses = [];
  surveyIdsList.map((surveyId) => {
    let surveyQuestions = questions
      .filter(
        (question) => question.surveyId.toString() === surveyId.toString()
      )
      .sort((a, b) => b.sequence - a.sequence);
    LogThis(
      log,
      `surveyQuestions=${surveyQuestions}; surveyId=${surveyId}; questions=${JSON.stringify(
        questions
      )}`
    );

    let rowClean = "";
    let answers = [];

    for (let r = 0; r < answersRows.length; r++) {
      rowClean = rowCleaner(answersRows[r]);
      answers = rowClean.split(",");
      LogThis(log, `answers=${answers}`);
      let row = r + 1;
      for (let a = 0; a < surveyQuestions.length; a++) {
        LogThis(
          log,
          `row=${row}; surveyQuestions[a]._id=${surveyQuestions[a]._id}; answers[a]=${answers[a]}`
        );
        surveyResponses.push({
          questionId: surveyQuestions[a]._id,
          row: row,
          col: a + 1,
          response: answers[a],
        });
      }
    }
  });
  surveyResponses;
  LogThis(log, `surveyResponses=${JSON.stringify(surveyResponses)}`);

  const surveyResponseCreated = await SurveyResponse.insertMany(
    surveyResponses
  );

  if (!questions) {
    res.status(404);
    throw new Error("Questions not found");
  }
  //ENDING LOGIC TO SAVE ANSWERS TO DATABASE

  if (answersRows.length > 0) {
    LogThis(log, `END`);
    res.status(200).json({
      owner: user._id,
      surveyIdsList: surveyIdsList,
      surveyResponseCreated: surveyResponseCreated,
      superSurveyId: superSurveyId,
      multiSurveys: multiSurveys,
      answerRowsLength: answersRows.length,
      questions: questions,
      answersRows: answersRows,
    });
  } else {
    res.status(404);
    throw new Error("Uncought Exception loading answers");
  }
});

module.exports = {
  superSurveyUploadAnswers,
  superSurveyCreateConfig,
};
