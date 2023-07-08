import axios from 'axios'
import {
    SCHEDULE_DETAILS_REQUEST,
    SCHEDULE_DETAILS_SUCCESS,
    SCHEDULE_DETAILS_FAIL,
    } from '../constants/schedulerConstants'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import {LogThis, initLogSettings} from '../libs/Logger'

const logSettings = initLogSettings('schedulerActions')

export const getScheduleDetails = (providerId) => async (dispatch, getState) => {
    try {
        logSettings.sourceFunction='getScheduleDetails'
        LogThis(logSettings, `Entering: providerId=${providerId}`)
        dispatch({
            type: SCHEDULE_DETAILS_REQUEST,
        })
    
        const {
            userLogin: { userInfo },
        } = getState()
    
        const config = {
            headers: {
            Authorization: `Bearer ${userInfo.token}`,
            },
        }
        LogThis(logSettings, `Before axios get: providerId=${providerId}; userInfo._id=${userInfo._id}`)
        const {data} = await axios.get(BACKEND_ENDPOINT + `/scheduler?providerid=${providerId}&clientid=${userInfo._id}`, config)
        LogThis(logSettings, `After axios get, result: data=${JSON.stringify(data)}`)
        dispatch({
            type: SCHEDULE_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SCHEDULE_DETAILS_FAIL,
            payload:
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
  }

  export const updateScheduleDetails = (schedule) => async (dispatch, getState) => { 
    try {
        logSettings.sourceFunction='updateScheduleDetails'
        LogThis(logSettings, `Entering: schedule=${JSON.stringify(schedule)}`)
        dispatch({
            type: SCHEDULE_DETAILS_REQUEST,
        })
    
        const {
            userLogin: { userInfo }, 
        } = getState()
    
        const config = {
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
            },
        }
        LogThis(logSettings, `Before axios put: schedule=${JSON.stringify(schedule)}; userInfo._id=${userInfo._id}`)
        const {data} = await axios.put(
            BACKEND_ENDPOINT + `/scheduler`, 
            {scheduleRequestUpdate: schedule},
            config
            )
        LogThis(logSettings, `After axios put, result: data=${JSON.stringify(data)}`)
        dispatch({
            type: SCHEDULE_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SCHEDULE_DETAILS_FAIL,
            payload:
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
  }