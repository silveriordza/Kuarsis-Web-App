/** @format */

//import { LogThis } from "../libs/Logger";

import {
  SURVEY_PROCESS_ANSWERS_REQUEST,
  SURVEY_PROCESS_ANSWERS_SUCCESS,
  SURVEY_PROCESS_ANSWERS_FAIL,
  SURVEY_PROCESS_ANSWERS_RESET,
  SURVEY_PROCESS_ANSWERS_STATUS,
  SURVEY_DETAILS_REQUEST,
  SURVEY_DETAILS_SUCCESS,
  SURVEY_DETAILS_FAIL,
  SURVEY_DETAILS_RESET,
} from "../constants/surveyConstants";

export const surveyProcessAnswersReducer = (state = { survey: {} }, action) => {
  switch (action.type) {
    case SURVEY_PROCESS_ANSWERS_REQUEST:
      return { loading: true };
    case SURVEY_PROCESS_ANSWERS_STATUS:
      return {
        loading: true,
        surveyStatusMessage: action.payload.message,
        surveyStatusRow: action.payload.row,
      };
    case SURVEY_PROCESS_ANSWERS_SUCCESS:
      // LogThisLegacy(
      //   `surveyReducer.js, surveyProcessAnswersReducer, PRODUCT_UDPATE_SUCCESS, action.payload=${JSON.stringify(
      //     action.payload
      //   )}`
      // );
      return { loading: false, success: true, survey: action.payload };

    case SURVEY_PROCESS_ANSWERS_FAIL:
      return { loading: false, error: action.payload };
    case SURVEY_PROCESS_ANSWERS_RESET:
      return { survey: {} };
    default:
      return state;
  }
};

export const surveyDetailsReducer = (
  state = { surveyDetailsInfo: {} },
  action
) => {
  switch (action.type) {
    case SURVEY_DETAILS_REQUEST:
      return { loading: true };
    case SURVEY_DETAILS_SUCCESS:
      return {
        loading: false,
        success: true,
        surveyDetailsInfo: action.payload,
      };

    case SURVEY_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case SURVEY_DETAILS_RESET:
      return { surveyDetailsInfo: {} };
    default:
      return state;
  }
};
