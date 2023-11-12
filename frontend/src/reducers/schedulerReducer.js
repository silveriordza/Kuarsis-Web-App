/** @format */

import {
  SCHEDULE_DETAILS_REQUEST,
  SCHEDULE_DETAILS_SUCCESS,
  SCHEDULE_DETAILS_FAIL,
  SCHEDULE_UPDATE_REQUEST,
  SCHEDULE_UPDATE_SUCCESS,
  SCHEDULE_UPDATE_FAIL,
} from "../constants/schedulerConstants";

import { LogThisLegacy, initLogSettings } from "../libs/Logger";
const logSettings = initLogSettings("SchedulerReducer", "schedulerReducer.js");

export const schedulerDetailsReducer = (state = { loading: true }, action) => {
  logSettings.sourceFunction = "schedulerDetailsReducer";

  LogThisLegacy(logSettings, `Entering the switch`);
  switch (action.type) {
    case SCHEDULE_DETAILS_REQUEST:
      LogThisLegacy(logSettings, "SCHEDULE_DETAILS_REQUEST");
      return {
        ...state,
        loading: true,
      };
    case SCHEDULE_DETAILS_SUCCESS:
      LogThisLegacy(
        logSettings,
        `SCHEDULE_DETAILS_SUCCESS: action.payload=${JSON.stringify(
          action.payload
        )}`
      );
      return {
        loading: false,
        schedule: action.payload,
      };
    case SCHEDULE_DETAILS_FAIL:
      LogThisLegacy(logSettings, "SCHEDULE_DETAILS_FAIL");
      return {
        loading: false,
        error: action.payload,
      };
    default:
      LogThisLegacy(logSettings, "default");
      return state;
  }
};

export const schedulerUpdateReducer = (state = { loading: true }, action) => {
  logSettings.sourceFunction = "schedulerUpdateReducer";

  LogThisLegacy(logSettings, `Entering the switch`);
  switch (action.type) {
    case SCHEDULE_UPDATE_REQUEST:
      LogThisLegacy(logSettings, "SCHEDULE_UPDATE_REQUEST");
      return {
        ...state,
        loading: true,
      };
    case SCHEDULE_UPDATE_SUCCESS:
      LogThisLegacy(
        logSettings,
        `SCHEDULE_UPDATE_SUCCESS: action.payload=${JSON.stringify(
          action.payload
        )}`
      );
      return {
        loading: false,
        schedule: action.payload,
      };
    case SCHEDULE_UPDATE_FAIL:
      LogThisLegacy(logSettings, "SCHEDULE_UPDATE_FAIL");
      return {
        loading: false,
        error: action.payload,
      };
    default:
      LogThisLegacy(logSettings, "default");
      return state;
  }
};
