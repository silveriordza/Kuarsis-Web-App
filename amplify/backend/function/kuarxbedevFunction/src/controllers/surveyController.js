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
const srcFileName = "surveyController.js";

const fs = require("fs");

//let onCareSuperSurvey = require("../models/surveyOnCareTreatmentTalentos2020.json");

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const superSurveyCreateConfig = asyncHandler(async (req, res) => {
  const {
    superSurveyConfig,
    //   price,
    //   description,
    //   image,
    //   brand,
    //   isShippable,
    //   isDownloadable,
    //   isImageProtected,
    //   isBookable,
    //   category,
    //   countInStock,
    //   isCreated,
  } = req.body;
  let ownerId = req.user._id;
  // const superSurvey = new SuperSuvey({
  //   owner: "652b0b3e1d61edfd4b8d4e8e",
  //   surveyName: "Oncare Treatment Center 2020 Talentos",
  //   surveyShortName: "TALENTOS_2020",
  //   description:
  //     "Encuesta para Talentos de OnCare Treatment Center para el año 2020",
  //   creationDate: Date.now(),
  // });

  await SuperSurvey.deleteMany({});
  await Survey.deleteMany({});
  await Question.deleteMany({});
  await MultiSurvey.deleteMany({});

  console.log("superSurveyConfig INPUT values are:");
  console.log(superSurveyConfig);
  console.log("Survey Configuration Values STRINGIFIED:");
  //console.log(JSON.stringify(onCareSuperSurvey));

  //console.log(onCareSuperSurvey.surveyList[0].questionList);
  //const superSurveyObject = JSON.parse(superSurveyConfig);

  //console.log(JSON.stringify(superSurveyObject));
  //let superSurveyConfigTest = onCareSuperSurvey;

  let superSurveyConfigTest = superSurveyConfig;
  const superSurvey = new SuperSurvey({
    owner: ownerId,
    surveyName: superSurveyConfigTest.surveyName,
    surveyShortName: superSurveyConfigTest.surveyShortName,
    description: superSurveyConfigTest.description,
  });

  const createdSuperSurvey = await superSurvey.save();

  // superSurveyConfigTest.surveyList.forEach(surveyItem => {
  //   let survey = new Survey({
  //     owner: "652b0b3e1d61edfd4b8d4e8e",
  //     surveyName: surveyItem.surveyName,
  //     surveyShortName: surveyItem.surveyShortName,
  //     description: surveyItem.description,
  //     instructions: surveyItem.instructions,
  //   })
  //   let surveyCreated = await survey.save()
  // })
  let surveysCreated = [];
  let questionsCreated = [];
  let surveyCreated = null;
  let questions = [];
  let question = null;
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

      // question = {
      //   surveyId: surveyCreated._id,
      //   question: questionItem.question,
      //   questionShort: questionItem.questionShort,
      //   fieldName: questionItem.fieldName,
      //   subScale: questionItem.subScale,
      //   sequence: questionItem.sequence,
      // };
      questions.push({
        surveyId: surveyCreated._id,
        question: questionItem.question,
        questionShort: questionItem.questionShort,
        fieldName: questionItem.fieldName,
        subScale: questionItem.subScale,
        sequence: questionItem.sequence,
      });
      console.log(`Saving Question ${questionItem.questionShort}`);
      //let questionCreated = await question.save();
      console.log(`Saved Question ${questionItem.questionShort}`);
      //questionsCreated.push(questionCreated);
      // console.log(`Pushed Question Created ${questionCreated.questionShort}`);
    }
    console.log("About to insert many");
    console.log(JSON.stringify(questions));
    //let questionQuery = new Question();
    questionsCreated = await Question.insertMany(questions);
    console.log("Inserted many");
  }

  // const surveys = []

  // superSurveyConfig

  // new Survey ({

  // })

  // const createdSuperSurvey = await superSurvey.save();

  // const survey = new Survey({
  //   owner: "22",
  // });
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

  const superSurveyId = req.params.id;
  const user = req.user;

  // Access the uploaded file
  const fileData = req.file;

  const answersData = fileData.buffer.toString("utf8");
  //console.log(answersData);
  let answersRows = answersData.replace(/\r/g, "").split("\n");

  if (answersRows.length > 0) {
    LogThis(log, `END`);
    res.status(200).json({
      owner: user._id,
      superSurveyId: superSurveyId,
      answerRowsLength: answersRows.length,
      answersRows: answersRows,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  superSurveyUploadAnswers,
  superSurveyCreateConfig,
};
