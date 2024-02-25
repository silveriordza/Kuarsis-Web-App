/**
 * @prettier
 */

let mongoose = require("mongoose");

const surveySuperiorModel = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    surveyName: { type: String, required: true },
    surveyShortName: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const SurveySuperior = mongoose.model("SurveySuperior", surveySuperiorModel);

const surveyModel = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    surveyName: { type: String, required: true },
    surveyShortName: { type: String, required: true },
    description: { type: String, required: false },
    instructions: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const Survey = mongoose.model("Survey", surveyModel);

const surveyQuestionModel = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Survey",
    },
    question: { type: String, required: true },
    questionShort: { type: String, required: true },
    fieldName: { type: String, required: true },
    weightType: { type: String, required: true },
    weights: { type: mongoose.Schema.Types.Mixed },
    surveyCol: { type: Number, required: true },
    superSurveyCol: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SurveyQuestion = mongoose.model("SurveyQuestion", surveyQuestionModel);

const surveyMultiModel = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    superSurveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SuperSurvey",
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Survey",
    },
    sequence: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SurveyMulti = mongoose.model("SurveyMulti", surveyMultiModel);

const surveyCollectedModel = mongoose.Schema(
  {
    superSurveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SuperSurvey",
    },
    respondentId: { type: Number, required: true },
    collectorId: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    dateModified: { type: Date, required: true },
    ipAddress: { type: String, required: true },
    emailAddress: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    custom1: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const SurveyCollected = mongoose.model("SurveyCollected", surveyCollectedModel);

const surveySuperiorOutputLayoutModel = mongoose.Schema(
  {
    surveySuperiorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SurveySuperior",
    },
    surveyShortName: { type: String, required: true },
    fieldName: { type: String, required: true },
    outputAsReal: { type: Boolean, required: true },
    sequence: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const SurveySuperiorOutputLayout = mongoose.model(
  "SurveySuperiorOutputLayout",
  surveySuperiorOutputLayoutModel
);

const surveyResponseModel = mongoose.Schema(
  {
    // surveyCollectedId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "SuperSurveyCollected",
    // },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SurveyQuestion",
    },
    respondentId: { type: String, required: true },
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    response: { type: String, required: false, default: "" },
    responseReal: { type: String, required: false, default: "" },
    weightedResponse: { type: String, required: false, default: "" },
    isWeighted: { type: Boolean, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseModel);

const surveyCalculatedFieldModel = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Survey",
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fieldName: { type: String, required: true },
    calculationType: { type: String, required: true },
    criteria: { type: mongoose.Schema.Types.Mixed, required: false },
    group: { type: mongoose.Schema.Types.Mixed, required: false },
    sequence: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SurveyCalculatedField = mongoose.model(
  "SurveyCalculatedField",
  surveyCalculatedFieldModel
);

const surveyCalculatedValueModel = mongoose.Schema(
  {
    // surveyCollectedId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "SuperSurveyCollected",
    // },
    calculatedFieldId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SurveyCalculatedField",
    },
    respondentId: { type: String, required: true },
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  }
);
const SurveyCalculatedValue = mongoose.model(
  "SurveyCalculatedValue",
  surveyCalculatedValueModel
);

// const surveyOutputReportHeadersModel = mongoose.Schema(
//   {
//     // surveyCollectedId: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   required: true,
//     //   ref: "SuperSurveyCollected",
//     // },
//     surveySuperiorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "SurveySuperior",
//     },
//     surveyName: { type: String, required: true },
//     surveyField: { type: String, required: true },
//     surveyIsCalculatedField: { type: Boolean, required: true },
//     col: { type: Number, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// const SurveyOutputReport = mongoose.model(
//   "SurveyOutputReport",
//   surveyOutputReportModel
// );

module.exports = {
  SurveySuperior,
  Survey,
  SurveyMulti,
  SurveyQuestion,
  SurveyCollected,
  SurveySuperiorOutputLayout,
  SurveyResponse,
  SurveyCalculatedField,
  SurveyCalculatedValue,
};
