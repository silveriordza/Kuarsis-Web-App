/** @format */

import {
  CONFIGS_ADDRESS_STATES_REQUEST,
  CONFIGS_ADDRESS_STATES_SUCCESS,
  CONFIGS_ADDRESS_STATES_FAILED,
  CONFIGS_ADDRESS_STATES_RESET,
} from "../constants/configsConstants";

import { LogThisLegacy } from "../libs/Logger";
let logSettings = { sourceFilename: "configsReducer", sourceFunction: "" };

export const configsAddressStatesReducer = (state = {}, action) => {
  logSettings.sourceFunction = "configsAddressStatesReducer";

  switch (action.type) {
    case CONFIGS_ADDRESS_STATES_REQUEST:
      LogThisLegacy(
        logSettings,
        `CONFIGS_ADDRESS_STATES_REQUEST, loading=true`
      );
      return { ...state, loading: true };
    case CONFIGS_ADDRESS_STATES_SUCCESS:
      LogThisLegacy(
        logSettings,
        `CONFIGS_ADDRESS_STATES_SUCCESS, loading=false, action.payload=${JSON.stringify(
          action.payload
        )}`
      );
      return { loading: false, addressStates: action.payload };
    case CONFIGS_ADDRESS_STATES_FAILED:
      LogThisLegacy(
        logSettings,
        `CONFIGS_ADDRESS_STATES_FAILED, loading=false, action.payload=${JSON.stringify(
          action.payload
        )}`
      );
      return { loading: false, error: action.payload };
    case CONFIGS_ADDRESS_STATES_RESET:
      LogThisLegacy(logSettings, `CONFIGS_ADDRESS_STATES_RESET, {}`);
      return {};
    default:
      return state;
  }
};
