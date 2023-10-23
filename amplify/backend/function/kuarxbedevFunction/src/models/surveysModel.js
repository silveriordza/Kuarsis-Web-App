/**
 * @prettier
 */

let mongoose = require("mongoose");

const superSurveyModel = mongoose.Schema(
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
const SuperSurvey = mongoose.model("SuperSurvey", superSurveyModel);

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

const questionModel = mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Survey",
    },
    question: { type: String, required: true },
    questionShort: { type: String, required: true },
    fieldName: { type: String, required: true },
    subScale: { type: Number, required: true },
    sequence: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionModel);

const multiSurveyModel = mongoose.Schema(
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

const MultiSurvey = mongoose.model("MultiSurvey", multiSurveyModel);

const superSurveyCollectedModel = mongoose.Schema(
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

const SuperSurveyCollected = mongoose.model(
  "SuperSurveyCollected",
  superSurveyCollectedModel
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
      ref: "Question",
    },
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    response: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  }
);

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseModel);

module.exports = {
  SuperSurvey,
  Survey,
  MultiSurvey,
  Question,
  SuperSurveyCollected,
  SurveyResponse,
};
// const onCareTreatmentCenter2020 = mongoose.Schema(
//   {
//     questionId,
//     questionDescription,
//     fieldName: { type: String, required: true, },
//       type: { type: String, required: true, },
//       surveyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Survey',
//       },
//       subSurveyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'subSurveyId',
//       },
//       //subSurveyFieldSequence
//       //surveyId: { type: String, required: true, },
//       //RESULTS CGS
//       CGS_RESULT_NUM_1: { type: ref, required: false, },
//       CGS_RESULT_NUM_2: { type: Number, required: false, },
//       CGS_RESULT_NUM_3: { type: Number, required: false, },
//       CGS_RESULT_NUM_4: { type: Number, required: false, },
//       CGS_RESULT_NUM_5: { type: Number, required: false, },
//       CGS_RESULT_NUM_6: { type: Number, required: false, },

//     },

//         { timestamps: true,
//         }
// )

// const onCareTreatmentCenter2020 = mongoose.Schema(
//   {
//     Datos_TXT_1: { type: String, required: false },
//     Datos_TXT_2: { type: String, required: false },
//     Datos_TXT_3: { type: String, required: false },
//     Datos_TXT_4: { type: String, required: false },
//     Datos_TXT_5: { type: String, required: false },
//     Datos_TXT_6: { type: String, required: false },
//     Datos_TXT_7: { type: String, required: false },
//     Datos_TXT_8: { type: String, required: false },
//     Datos_TXT_9: { type: String, required: false },
//     Datos_TXT_10: { type: String, required: false },
//     Datos_TXT_11: { type: String, required: false },
//     Datos_TXT_12: { type: String, required: false },
//     Datos_TXT_13: { type: String, required: false },
//     Datos_TXT_14: { type: String, required: false },
//     Datos_TXT_15: { type: String, required: false },
//     Datos_TXT_16: { type: String, required: false },
//     Datos_TXT_17: { type: String, required: false },
//     Datos_TXT_18: { type: String, required: false },
//     Datos_TXT_19: { type: String, required: false },
//     Datos_TXT_20: { type: String, required: false },
//     Datos_TXT_21: { type: String, required: false },
//     Datos_TXT_22: { type: String, required: false },
//     CGS_TXT_1: { type: String, required: false },
//     CGS_TXT_2: { type: String, required: false },
//     CGS_TXT_3: { type: String, required: false },
//     CGS_TXT_4: { type: String, required: false },
//     CGS_TXT_5: { type: String, required: false },
//     CGS_TXT_6: { type: String, required: false },
//     CGS_TXT_7: { type: String, required: false },
//     CGS_TXT_8: { type: String, required: false },
//     CGS_TXT_9: { type: String, required: false },
//     CGS_TXT_10: { type: String, required: false },
//     CGS_TXT_11: { type: String, required: false },
//     CGS_TXT_12: { type: String, required: false },
//     CGS_TXT_13: { type: String, required: false },
//     CGS_TXT_14: { type: String, required: false },
//     CGS_TXT_15: { type: String, required: false },
//     CGS_TXT_16: { type: String, required: false },
//     CGS_TXT_17: { type: String, required: false },
//     CGS_TXT_18: { type: String, required: false },
//     CGS_TXT_19: { type: String, required: false },
//     CGS_TXT_20: { type: String, required: false },
//     CGS_TXT_21: { type: String, required: false },
//     CGS_TXT_22: { type: String, required: false },
//     CGS_TXT_23: { type: String, required: false },
//     CGS_TXT_24: { type: String, required: false },
//     CGS_TXT_25: { type: String, required: false },
//     CGS_TXT_26: { type: String, required: false },
//     CGS_TXT_27: { type: String, required: false },
//     CGS_TXT_28: { type: String, required: false },
//     CGS_TXT_29: { type: String, required: false },
//     CGS_TXT_30: { type: String, required: false },
//     FIAD15_TXT_1: { type: String, required: false },
//     FIAD15_TXT_2: { type: String, required: false },
//     FIAD15_TXT_3: { type: String, required: false },
//     FIAD15_TXT_4: { type: String, required: false },
//     FIAD15_TXT_5: { type: String, required: false },
//     FIAD15_TXT_6: { type: String, required: false },
//     FIAD15_TXT_7: { type: String, required: false },
//     FIAD15_TXT_8: { type: String, required: false },
//     FIAD15_TXT_9: { type: String, required: false },
//     FIAD15_TXT_10: { type: String, required: false },
//     FIAD15_TXT_11: { type: String, required: false },
//     FIAD15_TXT_12: { type: String, required: false },
//     FIAD15_TXT_13: { type: String, required: false },
//     FIAD15_TXT_14: { type: String, required: false },
//     FIAD15_TXT_15: { type: String, required: false },
//     BURNOUT_TXT_1: { type: String, required: false },
//     BURNOUT_TXT_2: { type: String, required: false },
//     BURNOUT_TXT_3: { type: String, required: false },
//     BURNOUT_TXT_4: { type: String, required: false },
//     BURNOUT_TXT_5: { type: String, required: false },
//     BURNOUT_TXT_6: { type: String, required: false },
//     BURNOUT_TXT_7: { type: String, required: false },
//     BURNOUT_TXT_8: { type: String, required: false },
//     BURNOUT_TXT_9: { type: String, required: false },
//     BURNOUT_TXT_10: { type: String, required: false },
//     BURNOUT_TXT_11: { type: String, required: false },
//     BURNOUT_TXT_12: { type: String, required: false },
//     BURNOUT_TXT_13: { type: String, required: false },
//     BURNOUT_TXT_14: { type: String, required: false },
//     BURNOUT_TXT_15: { type: String, required: false },
//     BURNOUT_TXT_16: { type: String, required: false },
//     BURNOUT_TXT_17: { type: String, required: false },
//     BURNOUT_TXT_18: { type: String, required: false },
//     BURNOUT_TXT_19: { type: String, required: false },
//     BURNOUT_TXT_20: { type: String, required: false },
//     BURNOUT_TXT_21: { type: String, required: false },
//     BURNOUT_TXT_22: { type: String, required: false },
//     Datos_NUM_1: { type: String, required: false },
//     Datos_NUM_2: { type: Number, required: false },
//     Datos_NUM_3: { type: Date, required: false },
//     Datos_NUM_4: { type: Date, required: false },
//     Datos_NUM_5: { type: String, required: false },
//     Datos_NUM_6: { type: String, required: false },
//     Datos_NUM_7: { type: String, required: false },
//     Datos_NUM_8: { type: String, required: false },
//     Datos_NUM_9: { type: String, required: false },
//     Datos_NUM_10: { type: String, required: false },
//     Datos_NUM_11: { type: Number, required: false },
//     Datos_NUM_12: { type: Date, required: false },
//     Datos_NUM_13: { type: Number, required: false },
//     Datos_NUM_14: { type: Number, required: false },
//     Datos_NUM_15: { type: Number, required: false },
//     Datos_NUM_16: { type: String, required: false },
//     Datos_NUM_17: { type: String, required: false },
//     Datos_NUM_18: { type: String, required: false },
//     Datos_NUM_19: { type: Number, required: false },
//     Datos_NUM_20: { type: String, required: false },
//     Datos_NUM_21: { type: String, required: false },
//     Datos_NUM_22: { type: String, required: false },
//     CGS_NUM_1: { type: Number, required: false },
//     CGS_NUM_2: { type: String, required: false },
//     CGS_NUM_3: { type: Number, required: false },
//     CGS_NUM_4: { type: String, required: false },
//     CGS_NUM_5: { type: Number, required: false },
//     CGS_NUM_6: { type: Number, required: false },
//     CGS_NUM_7: { type: Number, required: false },
//     CGS_NUM_8: { type: Number, required: false },
//     CGS_NUM_9: { type: Number, required: false },
//     CGS_NUM_10: { type: Number, required: false },
//     CGS_NUM_11: { type: Number, required: false },
//     CGS_NUM_12: { type: Number, required: false },
//     CGS_NUM_13: { type: Number, required: false },
//     CGS_NUM_14: { type: Number, required: false },
//     CGS_NUM_15: { type: Number, required: false },
//     CGS_NUM_16: { type: Number, required: false },
//     CGS_NUM_17: { type: Number, required: false },
//     CGS_NUM_18: { type: Number, required: false },
//     CGS_NUM_19: { type: Number, required: false },
//     CGS_NUM_20: { type: Number, required: false },
//     CGS_NUM_21: { type: Number, required: false },
//     CGS_NUM_22: { type: Number, required: false },
//     CGS_NUM_23: { type: Number, required: false },
//     CGS_NUM_24: { type: Number, required: false },
//     CGS_NUM_25: { type: Number, required: false },
//     CGS_NUM_26: { type: Number, required: false },
//     CGS_NUM_27: { type: Number, required: false },
//     CGS_NUM_28: { type: Number, required: false },
//     CGS_NUM_29: { type: Number, required: false },
//     CGS_NUM_30: { type: Number, required: false },
//     FIAD15_NUM_1: { type: Number, required: false },
//     FIAD15_NUM_2: { type: Number, required: false },
//     FIAD15_NUM_3: { type: Number, required: false },
//     FIAD15_NUM_4: { type: Number, required: false },
//     FIAD15_NUM_5: { type: Number, required: false },
//     FIAD15_NUM_6: { type: Number, required: false },
//     FIAD15_NUM_7: { type: Number, required: false },
//     FIAD15_NUM_8: { type: Number, required: false },
//     FIAD15_NUM_9: { type: Number, required: false },
//     FIAD15_NUM_10: { type: Number, required: false },
//     FIAD15_NUM_11: { type: Number, required: false },
//     FIAD15_NUM_12: { type: Number, required: false },
//     FIAD15_NUM_13: { type: Number, required: false },
//     FIAD15_NUM_14: { type: Number, required: false },
//     FIAD15_NUM_15: { type: Number, required: false },
//     BURNOUT_NUM_1: { type: Number, required: false },
//     BURNOUT_NUM_2: { type: Number, required: false },
//     BURNOUT_NUM_3: { type: Number, required: false },
//     BURNOUT_NUM_4: { type: Number, required: false },
//     BURNOUT_NUM_5: { type: Number, required: false },
//     BURNOUT_NUM_6: { type: Number, required: false },
//     BURNOUT_NUM_7: { type: Number, required: false },
//     BURNOUT_NUM_8: { type: Number, required: false },
//     BURNOUT_NUM_9: { type: Number, required: false },
//     BURNOUT_NUM_10: { type: Number, required: false },
//     BURNOUT_NUM_11: { type: Number, required: false },
//     BURNOUT_NUM_12: { type: Number, required: false },
//     BURNOUT_NUM_13: { type: Number, required: false },
//     BURNOUT_NUM_14: { type: Number, required: false },
//     BURNOUT_NUM_15: { type: Number, required: false },
//     BURNOUT_NUM_16: { type: Number, required: false },
//     BURNOUT_NUM_17: { type: Number, required: false },
//     BURNOUT_NUM_18: { type: Number, required: false },
//     BURNOUT_NUM_19: { type: Number, required: false },
//     BURNOUT_NUM_20: { type: Number, required: false },
//     BURNOUT_NUM_21: { type: Number, required: false },
//     BURNOUT_NUM_22: { type: Number, required: false },
//     //RESULTS CGS
//     CGS_RESULT_NUM_1: { type: Number, required: false },
//     CGS_RESULT_NUM_2: { type: Number, required: false },
//     CGS_RESULT_NUM_3: { type: Number, required: false },
//     CGS_RESULT_NUM_4: { type: Number, required: false },
//     CGS_RESULT_NUM_5: { type: Number, required: false },
//     CGS_RESULT_NUM_6: { type: Number, required: false },
//   },

//   { timestamps: true }
// );
