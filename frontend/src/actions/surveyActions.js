/** @format */

import {
  SURVEY_PROCESS_ANSWERS_REQUEST,
  SURVEY_PROCESS_ANSWERS_SUCCESS,
  SURVEY_PROCESS_ANSWERS_FAIL,
} from "../constants/surveyConstants";
import { zipFile, unzipFile, unzipStringBase64 } from "../libs/Functions";

import { LogThis, LoggerSettings } from "../libs/Logger";

import { BACKEND_ENDPOINT } from "../constants/enviromentConstants";

import axios from "axios";
const srcFileName = "surveyActions.js";
export const surveyProcessAnswersAction =
  (survey) => async (dispatch, getState) => {
    try {
      const log = new LoggerSettings(srcFileName, "surveyProcessAnswers");

      dispatch({
        type: SURVEY_PROCESS_ANSWERS_REQUEST,
      });

      const fileNumeric = survey.fileNumeric;
      const fileReal = survey.fileReal;
      const surveySuperiorId = survey.surveySuperiorId;

      if (fileNumeric && fileReal) {
        const zippedFileNumeric = await zipFile("fileNumeric.csv", fileNumeric);

        const zippedFileReal = await zipFile("fileReal.csv", fileReal);

        const formData = new FormData();

        formData.append("fileNumeric", zippedFileNumeric);
        formData.append("fileReal", zippedFileReal);

        const {
          userLogin: { userInfo },
        } = getState();

        LogThis(log, "ABOUT TO CALL AXIOS");
        const config = {
          //responseType: "arraybuffer",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
            Accept: "application/zip",
          },
        };

        const { data } = await axios.put(
          BACKEND_ENDPOINT + `/surveys/${surveySuperiorId}`,
          formData,
          config
        );
        LogThis(log, `data=${data}`);
        //const data2 = Buffer.from(data, "base64").toString("binary");
        //const arrayBuffer = new Uint8Array(data2).buffer;
        // const blob = new Blob([data2], {
        //   type: "application/octet-stream",
        // });

        // LogThis(log, `About to log data arraybuffer as Text`);
        // const text = new TextDecoder().decode(data2);
        //LogThis(log, `data=${data2}`);

        const unzippedText = await unzipStringBase64(data, "OutputReport.csv");
        // LogThis(log, `unzippedText=${JSON.stringify(data)}`);
        LogThis(log, `unzippedText=${JSON.stringify(unzippedText)}`);
        dispatch({
          type: SURVEY_PROCESS_ANSWERS_SUCCESS,
          payload: unzippedText,
        });
      } else {
        throw Error("Survey response files were not provided as expected.");
      }
    } catch (error) {
      dispatch({
        type: SURVEY_PROCESS_ANSWERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const testsAction = (survey) => async (dispatch, getState) => {
  try {
    const log = new LoggerSettings(srcFileName, "testsAction");
    dispatch({
      type: SURVEY_PROCESS_ANSWERS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    LogThis(log, "ABOUT TO CALL AXIOS");
    const config = {
      //responseType: "arraybuffer",
      headers: {
        //"Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
        Accept: "application/octet-stream",
      },
    };

    const { data } = await axios.put(
      BACKEND_ENDPOINT + `/surveys/tests`,
      config
    );
    const unzippedText = data;
    dispatch({
      type: SURVEY_PROCESS_ANSWERS_SUCCESS,
      payload: unzippedText,
    });
  } catch (error) {
    dispatch({
      type: SURVEY_PROCESS_ANSWERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
