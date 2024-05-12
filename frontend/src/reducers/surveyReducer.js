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
   SURVEY_OUTPUTS_REQUEST,
   SURVEY_OUTPUTS_SUCCESS,
   SURVEY_OUTPUTS_FAIL,
   SURVEY_OUTPUTS_RESET,
   SURVEY_OUTPUTS_EXPORT_FILE_REQUEST,
   SURVEY_OUTPUTS_EXPORT_FILE_SUCCESS,
   SURVEY_OUTPUTS_EXPORT_FILE_FAIL,
   SURVEY_OUTPUTS_EXPORT_FILE_RESET,
   SURVEY_OUTPUTS_EXPORT_FILE_STATUS,
   SURVEY_OUTPUT_SINGLE_RESET,
   SURVEY_OUTPUT_SINGLE_SUCCESS,
} from '../constants/surveyConstants'

export const surveyProcessAnswersReducer = (state = { survey: {} }, action) => {
   switch (action.type) {
      case SURVEY_PROCESS_ANSWERS_REQUEST:
         return { loading: true }
      case SURVEY_PROCESS_ANSWERS_STATUS:
         return {
            loading: true,
            surveyStatusMessage: action.payload.message,
            surveyStatusRow: action.payload.row,
         }
      case SURVEY_PROCESS_ANSWERS_SUCCESS:
         return {
            loading: false,
            success: true,
            survey: action.payload.csvLayout,
            surveySuccessMessage: action.payload.surveySuccessMessage,
         }

      case SURVEY_PROCESS_ANSWERS_FAIL:
         return { loading: false, error: action.payload }
      case SURVEY_PROCESS_ANSWERS_RESET:
         return { survey: {} }
      default:
         return state
   }
}

export const surveyOutputsExportDataReducer = (
   state = { exportedData: {} },
   action,
) => {
   switch (action.type) {
      case SURVEY_OUTPUTS_EXPORT_FILE_REQUEST:
         return { loading: true }
      case SURVEY_OUTPUTS_EXPORT_FILE_STATUS:
         return {
            loading: true,
            message: action.payload.message,
         }
      case SURVEY_OUTPUTS_EXPORT_FILE_SUCCESS:
         return {
            loading: false,
            success: true,
            exportedData: action.payload.exportedData,
            message: action.payload.message,
         }

      case SURVEY_OUTPUTS_EXPORT_FILE_FAIL:
         return { loading: false, success: false, error: action.payload }
      case SURVEY_OUTPUTS_EXPORT_FILE_RESET:
         return { exportedData: {} }
      default:
         return state
   }
}

export const surveyDetailsReducer = (
   state = { surveyDetailsInfo: {} },
   action,
) => {
   switch (action.type) {
      case SURVEY_DETAILS_REQUEST:
         return { loading: true }
      case SURVEY_DETAILS_SUCCESS:
         return {
            loading: false,
            success: true,
            surveyDetailsInfo: action.payload,
         }

      case SURVEY_DETAILS_FAIL:
         return { loading: false, error: action.payload }
      case SURVEY_DETAILS_RESET:
         return { surveyDetailsInfo: {} }
      default:
         return state
   }
}

export const surveyOutputsReducer = (
   state = { surveyOutputsInfo: {} },
   action,
) => {
   switch (action.type) {
      case SURVEY_OUTPUTS_REQUEST:
         return { loading: true }
      case SURVEY_OUTPUTS_SUCCESS:
         return {
            loading: false,
            success: true,
            surveyOutputsInfo: action.payload,
         }

      case SURVEY_OUTPUTS_FAIL:
         return { loading: false, error: action.payload }
      case SURVEY_OUTPUTS_RESET:
         return { surveyOutputsInfo: {} }
      default:
         return state
   }
}

export const surveyOutputSingleReducer = (
   state = { surveyOutputSingleInfo: {} },
   action,
) => {
   switch (action.type) {
      case SURVEY_OUTPUT_SINGLE_SUCCESS:
         return {
            surveyOutputSingleInfo: action.payload,
         }
      case SURVEY_OUTPUT_SINGLE_RESET:
         return { surveyOutputSingleInfo: {} }
      default:
         return state
   }
}
