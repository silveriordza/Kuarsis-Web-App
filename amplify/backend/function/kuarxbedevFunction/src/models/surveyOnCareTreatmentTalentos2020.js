/**
 * @prettier
 */

let {
  superSurveyConfig,
  surveyConfig,
  multiSurveyConfig,
  questionConfig,
  superSurveyCollectedConfig,
  surveyResponseConfig,
} = require("./surveyConfigs.js");

const superSurveyConf = new superSurveyConfig(
  "652b0b3e1d61edfd4b8d4e8e",
  "Oncare Treatment Center 2020 Talentos",
  "TALENTOS_2020",
  "Encuesta para Talentos de OnCare Treatment Center para el año 2020"
);

let surveyConf = new surveyConfig(
  "652b0b3e1d61edfd4b8d4e8e",
  "surveyCollectionInformation",
  "SCOLINFO",
  "Informacion de la ecuesta recolectada.",
  ""
);

let questionList = [];
let questionConf = new questionConfig(
  "",
  "respondent_id",
  "respondent_id",
  "respondent_id",
  1,
  1
);

questionList.push(questionConf);

questionConf = new questionConfig(
  "",
  "collector_id",
  "collector_id",
  "collector_id",
  1,
  2
);

questionList.push(questionConf);

surveyConf.questionList = [...questionList];

questionList = [];

const surveyList = [];

surveyList.push(surveyConf);

surveyConf = new surveyConfig(
  "652b0b3e1d61edfd4b8d4e8e",
  "Informacion general de la persona encuestada.",
  "GENINFO",
  "Informacion de la persona encuestada.",
  ""
);

questionConf = new questionConfig(
  "",
  "Nombre completo",
  "NOMBRE",
  "NOMBRE",
  1,
  1
);

questionList.push(questionConf);

questionConf = new questionConfig("", "Edad", "Edad", "EDAD", 1, 2);

questionList.push(questionConf);

surveyConf.questionList = [...questionList];

surveyList.push(surveyConf);

superSurveyConf.surveyList = surveyList;

module.exports = { superSurveyConf };
