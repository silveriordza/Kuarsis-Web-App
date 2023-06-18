import axios from 'axios'
import {
CONFIGS_ADDRESS_STATES_REQUEST,
CONFIGS_ADDRESS_STATES_SUCCESS,
CONFIGS_ADDRESS_STATES_FAILED,
//CONFIGS_ADDRESS_STATES_RESET
} from '../constants/configsConstants'

import {BACKEND_ENDPOINT} from '../constants/enviromentConstants'

import { LogThis } from '../libs/Logger'

let logSettings = {sourceFilename: 'configsActions', sourceFunction: ''}

export const configsGetAddressStates = () => async (dispatch) => {
  try {
    logSettings.sourceFunction = 'configsGetAddressStates'

    dispatch({
      type: CONFIGS_ADDRESS_STATES_REQUEST,
    })
    LogThis(logSettings, `before axios.get for addressstates`)
    const { data } = await axios.get(BACKEND_ENDPOINT + `/configs/addressstates`)
    LogThis(logSettings, `after axios.get: ${JSON.stringify(data)}`)
    dispatch({
      type: CONFIGS_ADDRESS_STATES_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CONFIGS_ADDRESS_STATES_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
