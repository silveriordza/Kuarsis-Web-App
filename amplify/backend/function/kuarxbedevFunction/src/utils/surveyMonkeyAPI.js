/** @format */

const axios = require("axios");
let { LogThis, LoggerSettings, L0 } = require("../utils/Logger.js");
const { j } = require("./Functions.js");

const srcFileName = "surveyMonkeyAPI.js";

const getMonkeyResponses = async (newResponses) => {
  const log = new LoggerSettings(srcFileName, "getMonkeyResponses");
  const surveyMonkeyToken = process.env.KUARSIS_SURVEY_MONKEY_TOKEN;

  if (!surveyMonkeyToken || surveyMonkeyToken == "") {
    throw new Error(`Survey Monkey token not found.`);
  }

  const configSurveyMonkey = {
    //responseType: "arraybuffer",
    headers: {
      //"Content-Type": "multipart/form-data",
      Authorization: `Bearer ${surveyMonkeyToken}`,
      Accept: "application/json",
    },
  };
  const monkeyResponses = [];
  for (let r = 0; r < newResponses.length; r++) {
    let response = newResponses[r];

    let surveyResponseResult = await axios.get(
      `https://api.surveymonkey.com/v3/surveys/${response.surveyMonkeyId}/responses/${response.respondent_id}/details`,
      configSurveyMonkey
    );
    let surveyResponse = surveyResponseResult.data;
    monkeyResponses.push(surveyResponse);
  }
  return monkeyResponses;
};

module.exports = { getMonkeyResponses };
