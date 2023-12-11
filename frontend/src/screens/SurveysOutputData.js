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
import PaginateGeneric from "../components/PaginateGeneric";

import _ from "lodash";

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
import { SURVEY_OUTPUTS_RESET } from "../constants/surveyConstants";

const SurveysOutputData = ({ match, history }) => {
  const srcFileName = "SurveysOutputData";
  const log = new LoggerSettings(srcFileName, "SurveysOutputData");

  const keyword = match.params.keyword || "";
  const pageNumber = match.params.pageNumber || 1;
  const surveySelectedParam = match.params.surveySelected || -1;

  const [selectedPageNumber, setselectedPageNumber] = useState(pageNumber);

  const [selectedSurveySuperior, setselectedSurveySuperior] = useState(null);
  const [newSelectedSurveySuperior, setnewSelectedSurveySuperior] =
    useState(false);
  const [surveyDetailsDispatched, setsurveyDetailsDispatched] = useState(false);

  const [searchKeyword, setsearchKeyword] = useState(keyword);
  const [surveySelected, setsurveySelected] = useState(surveySelectedParam);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const typingTimer = useRef(null);
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

  // const testsHandler = async (e) => {
  //   e.preventDefault();
  //   const log = new LoggerSettings(srcFileName, "testsHandler");
  //   LogThis(log, "START");
  // };

  const handleSelectSurveySuperior = async (e) => {
    log.functionName = "handleSelectSurveySuperior";
    LogThis(log, `START`, L1);
    const index = e.target.selectedIndex - 1;
    if (index < 0) {
      dispatch({
        type: SURVEY_OUTPUTS_RESET,
      });
      setsurveySelected(-1);
      setselectedSurveySuperior(null);
      history.push("/admin/surveyoutput");
    } else {
      const selectedSurvey =
        surveyDetailsInfo.surveySuperiors[e.target.selectedIndex - 1];
      setsurveySelected(e.target.selectedIndex - 1);
      history.push(
        `/admin/surveyoutput/survey/${
          e.target.selectedIndex - 1
        }/page/${selectedPageNumber}`
      );
      // LogThis(
      //   log,
      //   `selectedSurvey=${JSON.stringify(selectedSurvey)}; index=${
      //     e.target.selectedIndex - 1
      //   }; surveyDetailsInfo=${JSON.stringify(surveyDetailsInfo)}`,
      //   L1
      // );
      // setselectedSurveySuperior(selectedSurvey);
      // setnewSelectedSurveySuperior(true);
    }
  };

  const reselectSurveyAfterPagination = async (selectedSurveyIndex) => {
    log.functionName = "reselectSurveyAfterPagination";
    const selectedSurvey =
      surveyDetailsInfo.surveySuperiors[selectedSurveyIndex];
    setsurveySelected(selectedSurveyIndex);

    LogThis(
      log,
      `selectedSurvey=${JSON.stringify(
        selectedSurvey
      )}; index=${selectedSurveyIndex}; surveyDetailsInfo=${JSON.stringify(
        surveyDetailsInfo
      )}`,
      L1
    );
    setselectedSurveySuperior(selectedSurvey);
    setnewSelectedSurveySuperior(true);
  };

  const debouncedKeywordSearch = _.debounce((newKeyword) => {
    log.functionName = "debouncedKeywordSearch";
    LogThis(log, `START newKeyword=${newKeyword}`, L1);
    setsearchKeyword(newKeyword);
    setnewSelectedSurveySuperior(true);
  }, 2000);
  const handleSearchText = async (e) => {
    log.functionName = "handleSearchText";
    //debouncedKeywordSearch(e.target.value);

    if (!typingTimer.current)
      typingTimer.current = setTimeout(() => {
        LogThis(log, `timer executed`, L1);
        setnewSelectedSurveySuperior(true);
        setselectedPageNumber(1);
      }, 2000);
    else {
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        LogThis(log, `timer executed`, L1);
        setnewSelectedSurveySuperior(true);
        setselectedPageNumber(1);
      }, 2000);
    }
    setsearchKeyword(e.target.value);
    LogThis(log, `START text=${e.target.value}`, L1);
  };

  const handlePageChange = (e) => {
    log.functionName = "handlePageChange";

    LogThis(log, `START surveySelectedParam=${surveySelected}`, L1);
    if (surveySelected >= 0) {
      reselectSurveyAfterPagination(surveySelected);
      setnewSelectedSurveySuperior(true);
      setselectedPageNumber(e.target.text);
    }
  };

  useEffect(() => {
    LogThis(
      log,
      `UseEffect getoutput, newSelectedSurveySuperior=${newSelectedSurveySuperior}; loading=${loading}`,
      L1
    );
    if (!userInfo) {
      LogThis(log, `No userInfo available`, L1);
      history.push("/sign-in");
    } else {
      // LogThis(
      //   log,
      //   `useEffect newSelectedSurveySuperior=${newSelectedSurveySuperior}, loading=${loading}`,
      //   L3
      // );
      // if (newSelectedSurveySuperior && !loading) {
      //   LogThis(
      //     log,
      //     `about to call surveyOutput selectedSurveySuperior=${JSON.stringify(
      //       selectedSurveySuperior
      //     )}`,
      //     L3
      //   );
      if (newSelectedSurveySuperior && !loading && selectedSurveySuperior) {
        LogThis(log, `About to dispatch surveyGetOutputValuesAction`, L3);
        LogThis(
          log,
          `dispatching selectedSurvey._id=${selectedSurveySuperior._id}; selectedSurveySuperior.surveyShortName=${selectedSurveySuperior.surveyShortName}; selectedPageNumber=${selectedPageNumber}; searchKeyword=${searchKeyword};`,
          L1
        );
        dispatch(
          surveyGetOutputValuesAction({
            surveySuperiorId: selectedSurveySuperior._id,
            surveyShortName: selectedSurveySuperior.surveyShortName,
            pageNumber: selectedPageNumber,
            keyword: searchKeyword,
          })
        );
        setnewSelectedSurveySuperior(false);
      }
    }
  }, [
    dispatch,
    //userInfo,
    newSelectedSurveySuperior,
    //loading,
    selectedSurveySuperior,
    selectedPageNumber,
    newSelectedSurveySuperior,
    //selectedPageNumber,
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
        LogThis(log, `About to dispatch surveyDetailsAction`, L1);
        dispatch(surveyDetailsAction({}));
        setsurveyDetailsDispatched(true);
      }
    }
  }, [dispatch, surveyDetailsDispatched]);

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
      if (surveySelected > -1) {
        reselectSurveyAfterPagination(surveySelected);
      }
    }
  }, [dispatch, surveySelected]);

  useEffect(() => {
    // Perform cleanup operations when the component is unmounted
    return () => {
      setsurveySelected(-1);
      setselectedSurveySuperior(null);
      dispatch({
        type: SURVEY_OUTPUTS_RESET,
      });
    };
  }, []);

  return (
    <>
      <FormContainer>
        {LogThis(log, `Rendering`)}
        {(loading || surveyDetailLoading) && <Loader />}
        {error && <Message variant="danger">{error.message}</Message>}

        <h1>Seleccione la encuesta a procesar</h1>
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
                <option key={50000} value={"NoSurveySelected"}>
                  {" "}
                  Seleccionar...
                </option>
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
            <div className={"survey-outputs"}>
              <Form.Group controlId="textControl">
                <Form.Label>Search by text:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={handleSearchText}
                ></Form.Control>
              </Form.Group>
              <br />
              <br />
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    {/* {console.log(
                    `Rendering outputLayouts=${JSON.stringify(
                      surveyOutputsInfo
                    )}`
                  )} */}
                    {surveyOutputsInfo.outputLayouts.map((layout, keyVal) => {
                      // console.log(
                      //   `dipslaying headers: layout=${JSON.stringify(
                      //     layout
                      //   )}; layout.showInSurveyOutputScreen = ${
                      //     layout.showInSurveyOutputScreen
                      //   }`
                      // );
                      if (layout.showInSurveyOutputScreen) {
                        // console.log(
                        //   `returning field layout.fieldName=${layout.fieldName}`
                        // );
                        return (
                          <td key={keyVal} style={{ whiteSpace: "nowrap" }}>
                            {layout.fieldName}
                          </td>
                        );
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
                    //console.log(`MAP outputValue=${JSON.stringify(outputValue)}`);
                    let outputField = null;
                    let outputValueData = null;
                    return (
                      <tr key={outputValue._id}>
                        {keys.map((key) => {
                          // console.log(
                          //   `outputValueKey=${key}; outputValue=${outputValue[key]}`
                          // );
                          outputField = surveyOutputsInfo.outputLayouts.find(
                            (x) => x.fieldName == key
                          );
                          // console.log(
                          //   `outputField=${JSON.stringify(
                          //     outputField
                          //   )}; outputField.showInSurveyOutputScreen=${
                          //     outputField.showInSurveyOutputScreen
                          //   };`
                          // );

                          if (outputField.showInSurveyOutputScreen) {
                            outputValueData = outputValue[key];
                            let encoder = new TextEncoder();
                            let utf8Array = encoder.encode(outputValueData);
                            let utf8String = new TextDecoder().decode(
                              utf8Array
                            );

                            return (
                              <td key={key} style={{ whiteSpace: "nowrap" }}>
                                {utf8String}
                              </td>
                            );
                          } else {
                            return;
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <PaginateGeneric
                onClick={handlePageChange}
                selectedSurveyIndex={surveySelected}
                pages={surveyOutputsInfo.pages}
                page={pageNumber}
                keyword={searchKeyword ? searchKeyword : ""}
              />
            </div>
          </>
        )}
    </>
  );
};

export default SurveysOutputData;
