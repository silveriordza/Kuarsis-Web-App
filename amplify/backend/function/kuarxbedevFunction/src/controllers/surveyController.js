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
let { LogThis } = require("../utils/Logger.js");

//let onCareSuperSurvey = require("../models/surveyOnCareTreatmentTalentos2020.json");

// @desc    Update a product
// @route   POST /api/surveys/
// @access  Private/Admin
const createSurveyConfiguration = asyncHandler(async (req, res) => {
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
  let ownerId = "652b0b3e1d61edfd4b8d4e8e";
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

// @desc    Update a product
// @route   PUT /api/surveys/:id
// @access  Private/Admin
const surveyProcessing = asyncHandler(async (req, res) => {
  // const {
  //   name,
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
  // } = req.body
  const fieldName = "1";
  const Surveys = await MultiSurvey.find({ fieldName: fieldName }).exec();

  LogThis(`surveyController, surveyProcessing`);

  if (Surveys) {
    //   product.name = name
    //   product.price = price
    //   product.description = description
    //   product.image = image
    //   product.brand = brand
    //   product.isShippable = isShippable
    //   product.isDownloadable = isDownloadable
    //   product.isImageProtected = isImageProtected
    //   product.isBookable = isBookable
    //   product.category = category
    //   product.countInStock = countInStock
    //   product.isCreated = isCreated
    //   LogThis(`productController, updateProduct, product=${product}`)
    //   const updatedProduct = await product.save()
    //   LogThis(`productController, updateProduct, updatedProduct=${updatedProduct}`)
    //res.json(updatedProduct)
    res.status(200);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  surveyProcessing,
  createSurveyConfiguration,
};
