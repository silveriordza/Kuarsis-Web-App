/** @format */

import axios from "axios";
import JSZip from "jszip";

import { BACKEND_ENDPOINT } from "../constants/enviromentConstants";

import FormData from "form-data";

//import fs from "fs";
import React, { useState, useEffect, useRef } from "react";
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { surveyProcessAnswersAction } from "../actions/surveyActions";
//import { surveysConfigurations } from "../surveysConfigurations";
import { LogThis, LoggerSettings } from "../libs/Logger";

import { saveStringAsCSV } from "../libs/csvProcessingLib";
import {
  zipFile,
  unzipFile,
  unzipStringBase64,
  autoDownloadFileOnClientBrowser,
  autoDownloadTextAsFileOnClientBrowser,
} from "../libs/Functions";
import { SURVEY_PROCESS_ANSWERS_RESET } from "../constants/surveyConstants";

const UploadSurveyAnswers = ({ match, history }) => {
  const srcFileName = "UploadSurveyAnswers";
  const log = new LoggerSettings(srcFileName, "UploadSurveyAnswers");

  const [fileNumeric, setfileNumeric] = useState(null);
  const [fileReal, setfileReal] = useState(null);

  const [uploadingNumeric, setuploadingNumeric] = useState(false);
  const [uploadingReal, setuploadingReal] = useState(false);

  const [uploadingServer, setuploadingServer] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const surveyProcessAnswers = useSelector(
    (state) => state.surveyProcessAnswers
  );
  const {
    loading: surveyLoading,
    error: surveyError,
    success: surveySuccess,
    survey: surveyData,
  } = surveyProcessAnswers;

  // const [nombreDeArchivoDatosReales, setnombreDeArchivoDatosReales] =
  //   useState(false);
  // const [nombreDeArchivo, setnombreDeArchivo] = useState(false);

  //const fileInputRef = useRef("");

  const dispatch = useDispatch();

  const uploadFileRealHandler = async (e) => {
    setuploadingReal(true);
    const objLogSettings = new LoggerSettings(
      srcFileName,
      "uploadFileRealHandler"
    );

    LogThis(objLogSettings, `START`);

    const file = e.target.files[0];
    setfileReal(file);
    // const zippedFile = await zipFile("fileReal.csv", file);
    // autoDownloadFileOnClientBrowser(zippedFile, "Real File 1021 Row.zip");

    setuploadingReal(false);
    LogThis(log, "END");
  };

  const uploadFileNumericHandler = async (e) => {
    const log = new LoggerSettings(srcFileName, "uploadFileHandler");
    LogThis(log, "START");
    setuploadingNumeric(true);
    const file = e.target.files[0];
    setfileNumeric(file);
    // const zippedFile = await zipFile("fileNumeric.csv", file);
    // autoDownloadFileOnClientBrowser(zippedFile, "Numeric File 1021 Row.zip");

    // const unzippedText = await unzipFile(file, "OutputReport.csv");
    // autoDownloadTextAsFileOnClientBrowser(
    //   unzippedText,
    //   "OutputReportUnzipped.csv"
    // );

    setuploadingNumeric(false);
    LogThis(log, "END");
  };

  const uploadToServer = async (e) => {
    e.preventDefault();
    const log = new LoggerSettings(srcFileName, "uploadToServer");
    LogThis(log, "START");
    setuploadingServer(true);

    dispatch(
      surveyProcessAnswersAction({
        surveySuperiorId: "6542afe8f8dbeb38182e234d",
        fileNumeric: fileNumeric,
        fileReal: fileReal,
      })
    );

    //dispatch goes here and have to pass the id of the survey and fileNumeric and fileReal as an object to the dispatch.
    /**
 * 
 * if (fileNumeric && fileReal) {
      const zippedFileNumeric = await zipFile("fileNumeric.csv", fileNumeric);

      const zippedFileReal = await zipFile("fileReal.csv", fileReal);

      const formData = new FormData();

      formData.append("fileNumeric", zippedFileNumeric, {
        contentType: "application/octet-stream",
      });
      formData.append("fileReal", zippedFileReal, {
        contentType: "application/octet-stream",
      });

      LogThis(log, "ABOUT TO CALL AXIOS");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
          responseType: "arraybuffer",
        },
      };

      axios
        .put(
          BACKEND_ENDPOINT + `/surveys/6542afe8f8dbeb38182e234d`,
          formData,
          config
        )
        .then((response) => {
          const unzippedText = unzipFile(response.data, "OutputReport.csv");
          LogThis(log, `unzippedText=${unzippedText}`);
          saveStringAsCSV(unzippedText, "OutputReport.csv");
          uploadingServer(false);
        });
    }
 */
  };

  const testsHandler = async (e) => {
    e.preventDefault();
    const log = new LoggerSettings(srcFileName, "testsHandler");
    LogThis(log, "START");
    setuploadingServer(true);
    LogThis(log, `token=${userInfo.token}`);
    const config = {
      //responseType: "arraybuffer",
      headers: {
        //"Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
        Accept: "application/zip",
      },
    };

    const { data } = await axios.put(
      BACKEND_ENDPOINT + `/surveys/tests`,
      {},
      config
    );
    LogThis(log, `data=${data}`);
    const unzippedText = unzipStringBase64(data, "OutputReport.csv");
    //const text = new TextDecoder().decode(new Uint8Array(data));

    console.log(unzippedText); // Output: "Hello, world!"
    LogThis(log, `text=${unzippedText}`);
    setuploadingServer(false);
  };

  useEffect(() => {
    if (!surveyLoading && surveySuccess && surveyData && uploadingServer) {
      saveStringAsCSV(surveyData, "OutputReport.csv");
      dispatch({ type: SURVEY_PROCESS_ANSWERS_RESET });
      setuploadingServer(false);
    } else if (
      uploadingServer &&
      !surveyLoading &&
      !surveySuccess &&
      surveyError
    ) {
      setuploadingServer(false);
    }
  }, [
    dispatch,
    surveyLoading,
    surveyData,
    surveyError,
    surveySuccess,
    uploadingServer,
    userInfo,
  ]);

  // useEffect(() => {

  //   const objLogSettings = new LoggerSettings(srcFileName, "useEffect");
  //   LogThis(
  //     objLogSettings,
  //     `in useEffect cycle uploading=${uploading}; fileContentsReady=${fileContentsReady}`
  //   );

  //   if (
  //     !uploading &&
  //     fileContentsReady &&
  //     !uploadingReales &&
  //     fileContentsRealesReady
  //   ) {
  //     LogThis(
  //       objLogSettings,
  //       `processing CSV uploading=${uploading}; fileContentsReady=${fileContentsReady}; uploadingReales=${uploadingReales}; fileContentsRealesReady=${fileContentsRealesReady}`
  //     );
  //     // console.log(`setting myCSV to true myCSV=${myCSV}`);
  //     // setmyCSV(true);
  //     // console.log(`setted myCSV to true myCSV=${myCSV}`)(async () => {
  //     //   await processCSVData();
  //     //   setmyCSV(false);
  //     //   console.log(`setted myCSV to false myCSV=${myCSV}`);
  //     // })();
  //     // // processCSVData().then(()=>{
  //     // // console.log(`setting myCSV to false myCSV=${myCSV}`)
  //     // // setmyCSV(false)
  //     // // console.log(`setted myCSV to false myCSV=${myCSV}`)
  //     // // })
  //   }
  // }, [
  //   dispatch,
  //   fileContents,
  //   fileContentsReady,
  //   uploading,
  //   uploadingReales,
  //   fileContentsRealesReady,
  // ]);

  return (
    <>
      {(uploadingNumeric || uploadingReal || uploadingServer) && <Loader />}
      <FormContainer>
        {surveyError && <Message variant="danger">{surveyError}</Message>}
        <h1>Procesar respuestas de encuesta</h1>
        <Form onSubmit={uploadToServer}>
          <Form.Group controlId="nombreDeArchivoNumerico">
            <br />
            <Form.Label>Seleccione archivo de respuestas numéricas:</Form.Label>

            {/* <Form.Control
            type="text"
            placeholder={nombreDeArchivo}
            value={nombreDeArchivo}
            onChange={(e) => setnombreDeArchivo(e.target.value)}
          /> */}
            <Form.Control
              type="file"
              // ref={fileInputRef}
              // className=""
              onChange={uploadFileNumericHandler}
            />
          </Form.Group>
          <Form.Group controlId="nombreDeArchivoReales">
            <Form.Label>Seleccionar el archivo de respuestas reales</Form.Label>
            {/* <Form.Control
              type="text"
              placeholder="Seleccionar el archivo de respuestas reales"
              value={nombreDeArchivoDatosReales}
              onChange={(e) => setnombreDeArchivoDatosReales(e.target.value)}
            ></Form.Control> */}
            <Form.Control
              type="file"
              className=""
              onChange={uploadFileRealHandler}
            ></Form.Control>
            <br />
            <Button variant="primary" onClick={testsHandler}>
              Tests
            </Button>
            <br />
            <br />
            <Button type="submit" variant="primary">
              PROCESAR ARCHIVOS
            </Button>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};

export default UploadSurveyAnswers;
