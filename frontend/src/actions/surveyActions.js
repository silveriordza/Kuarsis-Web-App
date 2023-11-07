/** @format */

import {
  SURVEY_PROCESS_ANSWERS_REQUEST,
  SURVEY_PROCESS_ANSWERS_SUCCESS,
  SURVEY_PROCESS_ANSWERS_FAIL,
  SURVEY_PROCESS_ANSWERS_STATUS,
  SURVEY_DETAILS_REQUEST,
  SURVEY_DETAILS_SUCCESS,
  SURVEY_DETAILS_FAIL,
  SURVEY_DETAILS_RESET,
} from "../constants/surveyConstants";
import { zipFile, unzipFile, unzipStringBase64 } from "../libs/Functions";

import { LogThis, LoggerSettings, L0, L1, L2, L3 } from "../libs/Logger";

import { rowCleaner2 } from "../libs/csvProcessingLib";

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
        LogThis(log, `unzippedText=${JSON.stringify(unzippedText, null, 2)}`);
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

export const surveyProcessAnswersAtClientAction =
  (survey) => async (dispatch, getState) => {
    try {
      const log = new LoggerSettings(srcFileName, "surveyProcessAnswers");

      dispatch({
        type: SURVEY_PROCESS_ANSWERS_REQUEST,
      });

      await new Promise((resolve) => setTimeout(resolve, 1));
      dispatch({
        type: SURVEY_PROCESS_ANSWERS_STATUS,
        payload: { message: "Survey Process started", row: 0 },
      });
      await new Promise((resolve) => setTimeout(resolve, 1));

      const fileNumeric = survey.fileNumeric;
      const fileReal = survey.fileReal;

      const surveySuperiorId = survey.surveySuperiorId;
      LogThis(log, `surveySuperiorId selected =${surveySuperiorId}`, L0);
      if (fileNumeric && fileReal) {
        const {
          userLogin: { userInfo },
        } = getState();

        LogThis(log, "ABOUT TO CALL AXIOS");
        const config = {
          //responseType: "arraybuffer",
          headers: {
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
            //Accept: "application/zip",
          },
        };
        // dispatch({
        //   type: SURVEY_PROCESS_ANSWERS_STATUS,
        //   payload: {
        //     message: "Obteniendo configuraciones de encuestas.",
        //     row: 0,
        //   },
        // });
        dispatch({
          type: SURVEY_PROCESS_ANSWERS_STATUS,
          payload: {
            message: "Obteniendo configuracion de encuestas.",
            row: 0,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 1));
        const { data } = await axios.get(
          BACKEND_ENDPOINT + `/surveys/${surveySuperiorId}/configs`,
          config
        );
        LogThis(log, `data=${JSON.stringify(data, null, 2)}`, L1);
        dispatch({
          type: SURVEY_PROCESS_ANSWERS_STATUS,
          payload: { message: "Configuracion de encuestas obtenido.", row: 0 },
        });
        await new Promise((resolve) => setTimeout(resolve, 1));

        const answersData = fileNumeric;

        LogThis(log, `answersData=${JSON.stringify(answersData, null, 2)}`);

        const answersDataReal = fileReal;
        LogThis(
          log,
          `answersDataReal=${JSON.stringify(answersDataReal, null, 2)}`
        );

        let answersRows = answersData.replace(/\r/g, "").split("\n");
        answersRows.shift();
        answersRows.shift();
        LogThis(log, `answersRows=${JSON.stringify(answersRows, null, 2)}`);

        let answersRealRows = answersDataReal.replace(/\r/g, "").split("\n");
        answersRealRows.shift();
        answersRealRows.shift();

        console.log(`Getting multi surveys`);
        //GET MULTI SURVEY DATA HERE AND ASSIGN TO let multiSurveys
        let multiSurvey = data.multiSurveys; // replace this with value from multiSurveys coming from response.
        const surveyIdsList = data.surveyIdsList;

        //GET QUESTIONS FROM RESPONSE

        const questions = data.questions; // replace with value from questions coming from response.

        //GET calculatedFields response
        const calculatedFields = data.calculatedFields;

        LogThis(log, `surveyIdsList=${surveyIdsList}`);

        const surveyResponses = [];

        const calculatedValues = [];

        let allSurveyQuestions = [];
        let allCalculatedFields = [];
        console.log(`Getting questions per survey`);
        // dispatch({
        //   type: SURVEY_PROCESS_ANSWERS_STATUS,
        //   payload: {
        //     message: "Mapeando las preguntas para cada sub encuesta",
        //     row: 0,
        //   },
        // });
        dispatch({
          type: SURVEY_PROCESS_ANSWERS_STATUS,
          payload: {
            message: "Mapeando las preguntas a las encuenstas.",
            row: 0,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 1));
        surveyIdsList.map((surveyId) => {
          let surveyQuestions = questions
            .filter(
              (question) =>
                question.surveyId._id.toString() === surveyId.toString()
            )
            .sort((a, b) => a.superSurveyCol - b.superSurveyCol);

          allSurveyQuestions = [...allSurveyQuestions, ...surveyQuestions];

          let surveyCalculatedFields = calculatedFields
            .filter(
              (calculatedField) =>
                calculatedField.surveyId._id.toString() === surveyId.toString()
            )
            .sort((a, b) => a.sequence - b.sequence);

          allCalculatedFields = [
            ...allCalculatedFields,
            ...surveyCalculatedFields,
          ];
        });

        LogThis(
          log,
          `calculatedFields=${JSON.stringify(allSurveyQuestions, null, 2)};`
        );

        LogThis(
          log,
          `Filtered calculated fields allCalculatedFields=${JSON.stringify(
            allCalculatedFields,
            null,
            2
          )};`
        );

        let questionDesc = "";
        let questionShortDesc = "";
        let csv = "";
        console.log(`Mapping Questions`);

        questions.map((q) => {
          questionDesc = questionDesc + q.question + ",";
          questionShortDesc = questionShortDesc + q.questionShort + ",";
        });

        allCalculatedFields.map((c) => {
          questionDesc = questionDesc + c.description + ",";
          questionShortDesc = questionShortDesc + c.shortDescription + ",";
        });
        questionDesc = questionDesc.slice(0, -1);
        questionShortDesc = questionShortDesc.slice(0, -1);
        questionDesc = questionDesc + "\n";
        questionShortDesc = questionShortDesc + "\n";

        csv = csv + questionDesc + questionShortDesc;

        let rowClean = "";
        let answers = [];
        let respondentId = "";

        let rowRealClean = "";
        let answersReal = [];
        console.log(`Processing rows`);

        for (let r = 0; r < answersRows.length; r++) {
          if (r % 10 === 0) {
            dispatch({
              type: SURVEY_PROCESS_ANSWERS_STATUS,
              payload: { message: "Processing rows", row: r + 1 },
            });
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
          //console.log(`Processing row ${r + 1}`);
          LogThis(
            log,
            `Processing Row r=${r}; allSurveyQuestions length=${allSurveyQuestions.length}`
          );
          rowClean = rowCleaner2(answersRows[r]);
          answers = rowClean.split(",");

          rowRealClean = rowCleaner2(answersRealRows[r]);
          answersReal = rowRealClean.split(",");

          LogThis(log, `answers=${answers}`);
          if (answers[0] == "" || answers[0].trim() == "") {
            break;
          }

          respondentId = answers[0].trim();
          let row = r + 1;
          for (let a = 0; a < allSurveyQuestions.length; a++) {
            LogThis(log, `processing question a=${a}`);
            // LogThis(
            //   log,
            //   `row=${row}; allSurveyQuestions[a]._id=${allSurveyQuestions[a]._id}; answers[a]=${answers[a]}`
            // );
            let surveyQuestion = allSurveyQuestions[a];
            let superSurveyQuestionCol = surveyQuestion.superSurveyCol - 1;
            //transform the question answer value into the weighted answer for that Survey.
            let weightedResponse = null;
            let response = null;
            let isWeighted = null;
            // LogThis(
            //   log,
            //   `surveyQuestion=${JSON.stringify(
            //     surveyQuestion
            //   )};surveyQuestion.weights=${JSON.stringify(surveyQuestion.weights)}`
            // );

            if (
              surveyQuestion.weights &&
              Object.keys(surveyQuestion.weights).length >
                0 /*&& surveyQuestion.weights.length > 0*/
            ) {
              // LogThis(
              //   log,
              //   `weighting: answers[${a}]=${
              //     answers[a]
              //   };surveyQuestion.weights=${JSON.stringify(
              //     surveyQuestion.weights
              //   )}; weightedValue=${
              //     surveyQuestion.weights[
              //       answers[a].toString().trim().replace(/'\n'/g, "")
              //     ]
              //   }`
              // );
              let answerA = answers[superSurveyQuestionCol]
                .toString()
                .trim()
                .replace(/'\n'/g, "");
              // if (answerA == "") {
              //   answerA = "";
              // }

              weightedResponse = surveyQuestion.weights[answerA];
              LogThis(
                log,
                `question weights=${JSON.stringify(surveyQuestion.weights)}`
              );
              LogThis(
                log,
                `BEFORE col=${superSurveyQuestionCol}; fieldName=${surveyQuestion.fieldName}; isWeighted=${isWeighted}; answerA=${answerA}; weightedResponse=${weightedResponse}`,
                L3
              );
              if (weightedResponse === undefined) {
                weightedResponse = answerA;
                isWeighted = false;
              } else {
                isWeighted = true;
              }
              response = answerA;
              answers[superSurveyQuestionCol] = weightedResponse;
              LogThis(
                log,
                `AFTER col=${superSurveyQuestionCol}; fieldName=${surveyQuestion.fieldName}; isWeighted=${isWeighted}; answerA=${answerA}; weightedResponse=${weightedResponse}`,
                L3
              );
              //LogThis(log, `final weight: answer=${weightedResponse}`);
            } else {
              let answerA = answers[superSurveyQuestionCol];
              // if (answerA == "") {
              //   answerA = "0";
              // }
              response = answerA;
              weightedResponse = answerA;
              isWeighted = false;
              LogThis(log, `no weighted: answer=${weightedResponse}`);
            }

            surveyResponses.push({
              questionId: surveyQuestion._id,
              respondentId: respondentId,
              row: row,
              col: a + 1,
              response: response,
              responseReal: answersReal[superSurveyQuestionCol],
              weightedResponse: weightedResponse,
              isWeighted: isWeighted,
            });

            if (isWeighted) {
              LogThis(
                log,
                `Adding csv weighted answer: weightedResponse=${weightedResponse}`
              );
              weightedResponse = weightedResponse ?? "";
              csv = csv + weightedResponse.toString() + ",";
            } else {
              csv = csv + response.toString() + ",";
            }
          }

          LogThis(
            log,
            `surveyResponses=${JSON.stringify(surveyResponses, null, 2)}`
          );
          //console.log(`surveyResponses=${surveyResponses}`);

          for (let a = 0; a < allCalculatedFields.length; a++) {
            // LogThis(
            //   log,
            //   `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}; answers[a]=${answers[a]}`
            // );
            LogThis(
              log,
              `row=${row}; allCalculatedFields[a]._id=${allCalculatedFields[a]._id}}`
            );
            //let col = a + 1
            let allCalculatedField = allCalculatedFields[a];
            let value = null;
            if (allCalculatedField.isCriteria) {
              let criteria = allCalculatedField.criteria;
              LogThis(
                log,
                `Criteria in Question: criteria=${JSON.stringify(
                  criteria,
                  null,
                  2
                )}`
              );
              let fieldNameValue = allCalculatedFields.find((calField) => {
                LogThis(log, `calField=${JSON.stringify(calField, null, 2)}`);
                return calField.fieldName == criteria.fieldNameValue[0];
              });
              LogThis(
                log,
                `fieldNameValue1=${JSON.stringify(fieldNameValue, null, 2)}`
              );
              let sequence = fieldNameValue.sequence;
              let calValue = calculatedValues.find(
                (value) => value.col == sequence && value.row == row
              );
              LogThis(
                log,
                `About to get into case > calValue=${JSON.stringify(
                  calValue,
                  null,
                  2
                )}; criteria.operator=${JSON.stringify(
                  criteria.operator,
                  null,
                  2
                )}`
              );
              switch (criteria.operator) {
                case ">":
                  LogThis(
                    log,
                    `Inside case: calValue.value=${calValue.value};criteria.value=${criteria.value};criteria.resultIfTrue=${criteria.resultIfTrue}`
                  );
                  if (calValue.value > criteria.value) {
                    value = criteria.resultIfTrue;
                    LogThis(log, `Creteria is true: value=${value}`);
                  } else {
                    value = criteria.resultIfFalse;
                    LogThis(log, `Creteria is false: value=${value}`);
                  }
                  break;
                default:
                  value = null;
                  LogThis(log, `Case entered default: value${value}`);
              }
            } else {
              // LogThis(
              //   log,
              //   `Field is not criteria: allCalculatedField=${JSON.stringify(
              //     allCalculatedField
              //   )}`
              // );

              let groups = allCalculatedField.group;
              groups.map((group) => {
                // LogThis(
                //   log,
                //   ` row=${row}; col=${a + 1}; group=${group} answers[group]=${
                //     answers[group]
                //   }; parseInt(answers[group])=${parseInt(answers[group])}`
                // );

                value = value + parseInt(answers[group]);
              });
            }
            LogThis(
              log,
              `Pushing value: calculatedFieldId=${
                allCalculatedFields[a]._id
              }; row=${row};col=${a + 1}; value=${value}; `
            );
            if (typeof value != "number" || value == null || isNaN(value)) {
              value = 0;
            }
            calculatedValues.push({
              calculatedFieldId: allCalculatedFields[a]._id,
              respondentId: respondentId,
              row: row,
              col: a + 1,
              value: value,
            });
            csv = csv + value.toString() + ",";
          }
          csv = csv.slice(0, -1);
          csv = csv + "\n";
        } //This bracket
        LogThis(
          log,
          `calculatedValues=${JSON.stringify(calculatedValues, null, 2)}`
        );
        //get outputLayout from response

        const outputLayout = data.outputLayout;

        LogThis(log, `outputLayouts=${JSON.stringify(outputLayout, null, 2)}`);

        dispatch({
          type: SURVEY_PROCESS_ANSWERS_STATUS,
          payload: { message: "Generando el archivo CSV", row: 0 },
        });
        await new Promise((resolve) => setTimeout(resolve, 1));

        let csvLayout = "";
        let layout = null;
        for (let o = 0; o < outputLayout.length - 1; o++) {
          layout = outputLayout[o];
          csvLayout = csvLayout + layout.description + ",";
        }
        layout = outputLayout[outputLayout.length - 1];
        csvLayout = csvLayout + layout.description + "\n";

        for (let o = 0; o < outputLayout.length - 1; o++) {
          layout = outputLayout[o];
          csvLayout = csvLayout + layout.shortDescription + ",";
        }
        layout = outputLayout[outputLayout.length - 1];
        csvLayout = csvLayout + layout.shortDescription + "\n";

        const cols = [];
        console.log(`Mapping columns to Layout`);

        for (let o = 0; o < outputLayout.length; o++) {
          layout = outputLayout[o];
          LogThis(
            log,
            `layout.fieldId=${layout.fieldId}; layout.isCalculated=${layout.isCalculated}`
          );
          if (layout.isCalculated) {
            LogThis(log, `layout.isCalculated=${layout.isCalculated}`);
            cols.push(
              calculatedValues
                .filter((val) => val.calculatedFieldId == layout.fieldId)
                .sort((a, b) => a.row - b.row)
            );
          } else {
            let responses = surveyResponses.filter(
              (val) => val.questionId == layout.fieldId
            );
            //LogThis(log, `responsesFound = ${JSON.stringify(responses)}`);
            responses = responses.sort((a, b) => a.row - b.row);
            //LogThis(log, `responsesSorted = ${JSON.stringify(responses)}`);
            cols.push(responses);
          }
        }
        LogThis(
          log,
          `cols=${JSON.stringify(cols, null, 2)}; outputLayout=${JSON.stringify(
            outputLayout,
            null,
            2
          )}`
        );

        //console.log(`cols=${JSON.stringify(cols)}`);
        let value = null;
        LogThis(
          log,
          `cols Length=${cols.length}; rows length=${cols[0].length}; outputLayout Length=${outputLayout.length}`
        );
        console.log(`Getting values for the columns in the layout`);
        for (let r = 0; r < cols[0].length; r++) {
          if (r % 10 === 0) {
            dispatch({
              type: SURVEY_PROCESS_ANSWERS_STATUS,
              payload: {
                message: "Agregando encuesta al archivo CSV.",
                row: r + 1,
              },
            });
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
          //LogThis(log, `Current Row length=${cols[r].length}`);
          for (let c = 0; c < cols.length - 1; c++) {
            layout = outputLayout[c];
            LogThis(log, `Processing Col=${c}; row=${r}`);
            //console.log(`Processing Col=${c}; row=${r}`);
            value = cols[c][r];
            LogThis(log, `value cycle=${JSON.stringify(value, null, 2)}`);
            if (layout.outputAsReal) {
              value = value.responseReal;
            } else {
              if ("isWeighted" in value) {
                if (value.isWeighted) {
                  value = value.weightedResponse;
                } else {
                  value = value.response;
                }
              } else {
                value = value.value;
              }
            }

            if (value == null || value == undefined) {
              value = "";
            }
            LogThis(log, `value=${value}`);
            csvLayout = csvLayout + value + ",";
          }
          LogThis(
            log,
            `Processing Last Col=${outputLayout.length - 1}; row=${r}`
          );
          value = cols[outputLayout.length - 1][r];

          if (layout.outputAsReal) {
            value = value.responseReal;
          } else {
            if ("isWeighted" in value) {
              if (value.isWeighted) {
                value = value.weightedResponse;
              } else {
                value = value.response;
              }
            } else {
              value = value.value;
            }
          }

          if (value == null || value == undefined) {
            value = "";
          }
          LogThis(log, `value=${value}`);
          csvLayout = csvLayout + value + "\n";
        }
        console.log(`Output layout is ready`);
        //const csvLayout = "hola mundo!";
        dispatch({
          type: SURVEY_PROCESS_ANSWERS_STATUS,
          payload: { message: "Archivo CSV Terminado.", row: 0 },
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (csvLayout && csvLayout.length > 0) {
          dispatch({
            type: SURVEY_PROCESS_ANSWERS_SUCCESS,
            payload: csvLayout,
          });
        } else {
          throw Error("No CSV data generated.");
        }
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

export const surveyDetailsAction = () => async (dispatch, getState) => {
  try {
    const log = new LoggerSettings(srcFileName, "surveyDetailsAction");
    dispatch({
      type: SURVEY_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    LogThis(log, "ABOUT TO CALL AXIOS");
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(BACKEND_ENDPOINT + `/surveys`, config);
    LogThis(log, `data=${JSON.stringify(data)}`, L0);
    dispatch({
      type: SURVEY_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SURVEY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
