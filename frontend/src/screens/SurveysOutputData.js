/** @format */

import axios from "axios";
import JSZip from "jszip";

import { BACKEND_ENDPOINT } from "../constants/enviromentConstants";

import FormData from "form-data";

//import fs from "fs";
import React, { useState, useEffect, useRef } from "react";
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  surveyProcessAnswersAction,
  surveyProcessAnswersAtClientAction,
  surveyDetailsAction,
  surveyGetOutputValuesAction,
} from "../actions/surveyActions";
//import { surveysConfigurations } from "../surveysConfigurations";
import { LogThis, LoggerSettings, L1, L2, L3, L0 } from "../libs/Logger";

import { saveStringAsCSV } from "../libs/csvProcessingLib";
import {
  zipFile,
  unzipFile,
  unzipStringBase64,
  autoDownloadFileOnClientBrowser,
  autoDownloadTextAsFileOnClientBrowser,
  unzipFileFromSubfolder,
} from "../libs/Functions";
import { SURVEY_PROCESS_ANSWERS_RESET } from "../constants/surveyConstants";

const SurveysOutputData = ({ match, history }) => {
  const srcFileName = "SurveysOutputData";
  const log = new LoggerSettings(srcFileName, "SurveysOutputData");

  const [selectedSurveySuperior, setselectedSurveySuperior] = useState(null);
  const [newSelectedSurveySuperior, setnewSelectedSurveySuperior] =
    useState(false);
  const [surveyDetailsDispatched, setsurveyDetailsDispatched] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // const surveyProcessAnswers = useSelector(
  //   (state) => state.surveyProcessAnswers
  // );
  // const {
  //   loading: surveyLoading,
  //   error: surveyError,
  //   success: surveySuccess,
  //   survey: surveyData,
  //   surveyStatusMessage: surveyMessage,
  //   surveyStatusRow: surveyRow,
  // } = surveyProcessAnswers;
  const surveyDetails = useSelector((state) => state.surveyDetails);

  const {
    loading: surveyDetailLoading,
    error: surveyDetailError,
    success: surveyDetailSuccess,
    surveyDetailsInfo: surveyDetailsInfo,
  } = surveyDetails;

  const surveyOutputs = useSelector((state) => state.surveyOutputs);

  const { loading, error, success, surveyOutputsInfo } = surveyOutputs;

  const dispatch = useDispatch();

  const testsHandler = async (e) => {
    e.preventDefault();
    const log = new LoggerSettings(srcFileName, "testsHandler");
    LogThis(log, "START");
  };

  const handleSelectSurveySuperior = async (e) => {
    log.functionName = "handleSelectSurveySuperior";
    const selectedSurvey =
      surveyDetailsInfo.surveySuperiors[e.target.selectedIndex - 1];

    LogThis(
      log,
      `selectedSurvey=${JSON.stringify(selectedSurvey)}; index=${
        e.target.selectedIndex - 1
      }; surveyDetailsInfo=${JSON.stringify(surveyDetailsInfo)}`
    );
    setselectedSurveySuperior(selectedSurvey);
    setnewSelectedSurveySuperior(true);
  };

  useEffect(() => {
    LogThis(log, `UseEffect getoutput`, L1);
    if (!userInfo) {
      LogThis(log, `No userInfo available`, L1);
      history.push("/sign-in");
    } else {
      LogThis(
        log,
        `useEffect newSelectedSurveySuperior=${newSelectedSurveySuperior}, loading=${loading}`,
        L3
      );
      if (newSelectedSurveySuperior && !loading) {
        LogThis(
          log,
          `about to call surveyOutput selectedSurveySuperior=${JSON.stringify(
            selectedSurveySuperior
          )}`,
          L3
        );
        dispatch(
          surveyGetOutputValuesAction({
            surveySuperiorId: selectedSurveySuperior._id,
            surveyShortName: selectedSurveySuperior.surveyShortName,
          })
        );
        setnewSelectedSurveySuperior(false);
      }
    }
    if (surveyOutputsInfo) {
      LogThis(
        log,
        `surveyOutputsInfo useEffect=${JSON.stringify(
          surveyOutputsInfo,
          null,
          2
        )}`,
        L3
      );
      //setShowOutputDetails(true);
    }
  }, [
    dispatch,
    userInfo,
    newSelectedSurveySuperior,
    loading,
    surveyOutputsInfo,
  ]);

  useEffect(() => {
    LogThis(log, `UseEffect details`, L1);
    if (!userInfo) {
      LogThis(log, `No userInfo available`, L1);
      history.push("/sign-in");
    } else {
      LogThis(
        log,
        `Details dispatched surveyDetailsDispatched=${surveyDetailsDispatched}`,
        L1
      );
      if (!surveyDetailsDispatched) {
        dispatch(surveyDetailsAction({}));
        setsurveyDetailsDispatched(true);
      }
    }
  }, [
    dispatch,
    surveyDetailLoading,
    surveyDetailSuccess,
    surveyDetailsInfo,
    surveyDetailError,
  ]);

  return (
    <>
      <FormContainer>
        {LogThis(log, `Rendering`)}
        {(loading || surveyDetailLoading) && <Loader />}
        {error && <Message variant="danger">{error.message}</Message>}

        <h1>Seleccione la encuesta a procesar</h1>
        {LogThis(log, `Rendering`)}
        {!surveyDetailLoading &&
          surveyDetailSuccess &&
          surveyDetailsInfo &&
          surveyDetailsInfo.surveySuperiors && (
            <>
              <Form.Control
                as="select"
                value={selectedSurveySuperior ?? ""}
                onChange={handleSelectSurveySuperior}
              >
                <option value=""> Seleccionar...</option>
                {/* <option value="">
                  {" "}
                  {surveyDetailsInfo.surveySuperiors[0].surveyName}
                </option> */}
                {surveyDetailsInfo.surveySuperiors.map((element, index) => {
                  return (
                    <option key={index} value={element}>
                      {element.surveyName}
                    </option>
                  );
                })}
              </Form.Control>
            </>
          )}
      </FormContainer>
      <br />
      <br />
      <br />
      {!loading &&
        success &&
        surveyOutputsInfo &&
        surveyOutputsInfo.outputLayouts &&
        surveyOutputsInfo.outputValues && (
          <>
            {console.log(
              `surveyOutputsInfo=${JSON.stringify(
                surveyOutputsInfo,
                null,
                1
              )}; loading=${loading}`
            )}
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  {console.log(
                    `Rendering outputLayouts=${JSON.stringify(
                      surveyOutputsInfo
                    )}`
                  )}
                  {surveyOutputsInfo.outputLayouts.map((layout) => {
                    if (layout.showInSurveyOutputScreen) {
                      return <td>{layout.fieldName}</td>;
                    } else {
                      return;
                    }
                  })}
                </tr>
              </thead>
              <tbody>
                {surveyOutputsInfo.outputValues.map((outputValue) => {
                  const keys = Object.keys(outputValue);
                  keys.shift();
                  console.log(`MAP outputValue=${JSON.stringify(outputValue)}`);
                  let outputField = null;
                  let outputValueData = null;
                  return (
                    <tr key={outputValue._id}>
                      {keys.map((key) => {
                        console.log(
                          `outputValueKey=${key}; outputValue=${outputValue[key]}`
                        );
                        outputField = surveyOutputsInfo.outputLayouts.find(
                          (x) => x.fieldName == key
                        );
                        console.log(
                          `outputField=${JSON.stringify(
                            outputField
                          )}; outputField.showInSurveyOutputScreen=${
                            outputField.showInSurveyOutputScreen
                          };`
                        );

                        if (outputField.showInSurveyOutputScreen) {
                          outputValueData = outputValue[key];
                          let encoder = new TextEncoder();
                          let utf8Array = encoder.encode(outputValueData);
                          let utf8String = new TextDecoder().decode(utf8Array);

                          return <td>{utf8String}</td>;
                        } else {
                          return;
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
          </>
        )}
    </>
  );
};

export default SurveysOutputData;
