/** @format */

import { LogThis } from "../libs/Logger";

import {
  SURVEY_PROCESS_ANSWERS_REQUEST,
  SURVEY_PROCESS_ANSWERS_SUCCESS,
  SURVEY_PROCESS_ANSWERS_FAIL,
  SURVEY_PROCESS_ANSWERS_RESET,
} from "../constants/surveyConstants";

export const surveyProcessAnswersReducer = (state = { survey: {} }, action) => {
  switch (action.type) {
    case SURVEY_PROCESS_ANSWERS_REQUEST:
      return { loading: true };
    case SURVEY_PROCESS_ANSWERS_SUCCESS: {
      LogThis(
        `surveyReducer.js, surveyProcessAnswersReducer, PRODUCT_UDPATE_SUCCESS, action.payload=${JSON.stringify(
          action.payload
        )}`
      );
      return { loading: false, success: true, survey: action.payload };
    }
    case SURVEY_PROCESS_ANSWERS_FAIL:
      return { loading: false, error: action.payload };
    case SURVEY_PROCESS_ANSWERS_RESET:
      return { survey: {} };
    default:
      return state;
  }
};
