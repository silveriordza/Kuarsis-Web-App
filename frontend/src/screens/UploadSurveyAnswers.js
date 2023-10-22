/** @format */

import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/enviromentConstants";

import FormData from "form-data";

//import fs from "fs";
import React, { useState, useEffect, useRef } from "react";
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import Message from '../components/Message'
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER,
  SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER,
  SRV_FIRST_ROW_HAS_HEADERS,
  SRV_SECOND_ROW_HAS_HEADERS,
} from "../constants/surveyConstants";

import {
  rowCleaner,
  saveStringAsCSV,
  convertSurveyJsonToCSV,
} from "../libs/csvProcessingLib";
import { surveysConfigurations } from "../surveysConfigurations";
// import { listProductDetails, updateProduct } from '../actions/productActions'
// import { PRODUCT_UPDATE_RESET, PRODUCT_DETAILS_SUCCESS } from '../constants/productConstants'
// import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'
// import { convert } from '../libs/imagesLib'
import { LogThis, LoggerSettings } from "../libs/Logger";

const UploadSurveyAnswers = ({ match, history }) => {
  const srcFileName = "UploadSurveyAnswers";
  const log = new LoggerSettings(srcFileName, "UploadSurveyAnswers");

  LogThis(log, null);

  const [myCSV, setmyCSV] = useState(false);

  const [nombreDeArchivo, setnombreDeArchivo] = useState("");
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [fileContents, setfileContents] = useState(null);
  const [fileContentsReady, setfileContentsReady] = useState(false);

  const [nombreDeArchivoDatosReales, setnombreDeArchivoDatosReales] =
    useState("");

  const [uploadingReales, setuploadingReales] = useState(false);
  const [fileContentsReales, setfileContentsReales] = useState(null);
  const [fileContentsRealesReady, setfileContentsRealesReady] = useState(false);

  const dispatch = useDispatch();

  const processCSVData = () => {
    return new Promise((resolve, reject) => {
      const objLogSettings = new LoggerSettings(srcFileName, "processCSVData");

      LogThis(objLogSettings, `START`);
      if (fileContents) {
        const rows = fileContents.split("\n");
        const rowsReales = fileContentsReales.split("\n");
        rowsReales.shift();
        rowsReales.shift();
        LogThis(
          objLogSettings,
          `rowsReales=${rowsReales}; rowsReales.lenght=${rowsReales.length}`
        );
        let Row1 = rows[0];
        let Row2 = rows[1];
        console.log(Row1);
        console.log(Row2);

        console.log("ROW 1 CLEANUP START");
        const headersRow1 = rowCleaner(Row1).split(",");
        console.log("ROW 1 CLEANUP END");
        console.log("ROW 2 CLEANUP START");
        const headersRow2 = rowCleaner(Row2).split(",");
        console.log("ROW 2 CLEANUP END");
        console.log(headersRow1);
        console.log(headersRow2);
        const finalHeaders = [];

        surveysConfigurations.forEach((survey) => {
          survey.subSurvey.forEach((subSurvey) => {
            subSurvey.headerParserModificators.forEach((hpm) => {
              switch (hpm.modificator) {
                case SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER:
                  {
                    let currentValue = "";
                    let previousNonEmpty = "";

                    for (
                      let col = hpm.startColumn;
                      col <= hpm.endColumn;
                      col++
                    ) {
                      currentValue = headersRow1[col];
                      if (currentValue == "") {
                        if (previousNonEmpty != "") {
                          let concatValue = previousNonEmpty + headersRow2[col];
                          finalHeaders.push(
                            subSurvey.subSurveyName + "_" + concatValue
                          );
                        } else {
                          for (let backCol = col - 1; backCol >= 0; col--) {
                            let backColVal = headersRow1[backCol];
                            if (backColVal != "") {
                              previousNonEmpty = backColVal;
                              break;
                            }
                          }
                          if (previousNonEmpty == "") {
                            throw new Error(
                              `Header incorrect format on column: ${col}`
                            );
                          }
                        }
                      } else {
                        console.log(`previousNonEmpty = ${previousNonEmpty}`);
                        previousNonEmpty = headersRow1[col];
                        finalHeaders.push(
                          subSurvey.subSurveyName + "_" + headersRow1[col]
                        );
                      }
                    }
                  }
                  break;
                case SRV_SECOND_ROW_HAS_HEADERS:
                  for (let col = hpm.startColumn; col <= hpm.endColumn; col++) {
                    finalHeaders.push(
                      subSurvey.subSurveyName + "_" + headersRow2[col]
                    );
                  }
                  break;
                case SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER:
                  {
                    let previousValue = "";

                    if (headersRow1[hpm.startColumn] == "") {
                      throw new Error(
                        `Header incorrect format on column: ${
                          hpm.startColumn
                        }; headersRow1[hpm.startColumn]=${
                          headersRow1[hpm.startColumn]
                        }`
                      );
                    }

                    for (
                      let col = hpm.startColumn;
                      col <= hpm.endColumn;
                      col++
                    ) {
                      if (
                        headersRow1[col] != "" &&
                        headersRow1[col].charCodeAt(0) != 13
                      ) {
                        if (col == 524) {
                          console.log(
                            `PREVIOUS VALUE LAST ROW previousValue=${previousValue}`
                          );
                        }
                        previousValue = headersRow1[col];
                        if (col == 524) {
                          const character = headersRow1[col];
                          const asciiCode = character.charCodeAt(0);
                          console.log(
                            `NEW VALUE LAST ROW previousValue=${previousValue}; headersRow1[col]="${headersRow1[col]}"; asciiCode=${asciiCode}`
                          );
                        }
                      }

                      finalHeaders.push(
                        subSurvey.subSurveyName +
                          "_" +
                          previousValue +
                          " " +
                          headersRow2[col]
                      );
                    }
                  }
                  break;
                case SRV_FIRST_ROW_HAS_HEADERS:
                  {
                    for (
                      let col = hpm.startColumn;
                      col <= hpm.endColumn;
                      col++
                    ) {
                      finalHeaders.push(
                        subSurvey.subSurveyName + "_" + headersRow1[col]
                      );
                    }
                  }
                  break;
              }
            });
          });
        });

        console.log(`final headers`);
        console.log(finalHeaders);
        const results = [];
        for (let i = 2; i < rows.length; i++) {
          const rowData = rows[i].split(",");
          const rowObject = [];

          for (let j = 0; j < finalHeaders.length; j++) {
            console.log(
              `results j=${j}; finalHeaders[j]=${finalHeaders[j]}; rowData[j]=${rowData[j]}`
            );

            rowObject.push({ header: finalHeaders[j], data: rowData[j] });
          }

          results.push(rowObject);
          console.log(`results`);
          console.log(results);
        }

        console.log(`results are`);
        console.log(results);

        const dataRows = [...rows];
        console.log(`rows`);
        console.log(rows);
        console.log(`dataRows`);
        console.log(dataRows);
        dataRows.shift();
        dataRows.shift();
        //dataRows.pop()
        console.log(`dataRows 2nd removed`);
        console.log(dataRows);
        const surveyCSVData = convertSurveyJsonToCSV(
          finalHeaders,
          dataRows,
          rowsReales
        );
        console.log(`surveyCSVData`);
        console.log(surveyCSVData);
        saveStringAsCSV(
          surveyCSVData,
          `${new Date().getTime() / 1000}_data.csv`
        );
      }
      resolve(true);
    });
  };

  const uploadFileRealesHandler = async (e) => {
    //setmyCSV(false)

    const objLogSettings = new LoggerSettings(
      srcFileName,
      "uploadFileRealesHandler"
    );
    LogThis(objLogSettings, `START`);

    const file = e.target.files[0];

    setuploadingReales(true);
    setfileContentsRealesReady(false);
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          LogThis(objLogSettings, `setting file contents`);
          LogThis(objLogSettings, e.target.result);
          setfileContentsReales(e.target.result);
          setfileContentsRealesReady(true);
        };
        reader.readAsText(file);
      }
      setuploadingReales(false);
    } catch (error) {
      console.error(error);
      setuploadingReales(false);
    }
  };

  const uploadFileHandler = async (e) => {
    //setmyCSV(true)

    const file = e.target.files[0];
    // console.log(`uploadFileHandler start`);
    const log = new LoggerSettings(srcFileName, "uploadFileHandler");
    LogThis(log, "START");
    setUploading(true);
    setfileContentsReady(false);
    setmyCSV(true);
    try {
      if (file) {
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //   // console.log(`setting file contents`);
        //   // console.log(e.target.result);
        //   // const config = {
        //   //   headers: {
        //   //     "Content-Type": "application/json",
        //   //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmIwYjNlMWQ2MWVkZmQ0YjhkNGU4ZSIsImlhdCI6MTY5NzMxOTgwMiwiZXhwIjoxNjk5OTExODAyfQ.oxpWL7iwehm91bOkRpYdarYdCdZA-N-icyDvrQqogIo`,
        //   //   },
        //   // };

        // };
        // reader.readAsText(file);
        LogThis(log, `file=${file}; file.name=${file.name};`);
        setnombreDeArchivo(file.name);
        //const answersDataFile = file;
        const formData = new FormData();
        //formData.append("file2", file, file.name);
        formData.append("file", file, {
          contentType: "application/octet-stream",
        });

        LogThis(log, "ABOUT TO CALL AXIOS");
        // axios
        //   .put(
        //     BACKEND_ENDPOINT + `/surveys/6534de82edd78c422c37f91b`,
        //     {
        //       superSurveyId: "6534de82edd78c422c37f91b",
        //       answersData: e.target.result,
        //     },
        //     config
        //   )
        //   .then((response) => {
        //     LogThis(log, `uploadResponse=${response}`);
        //     setfileContents(e.target.result);
        //     setfileContentsReady(true);
        //     setUploading(false);
        //   });
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmIwYjNlMWQ2MWVkZmQ0YjhkNGU4ZSIsImlhdCI6MTY5NzMxOTgwMiwiZXhwIjoxNjk5OTExODAyfQ.oxpWL7iwehm91bOkRpYdarYdCdZA-N-icyDvrQqogIo`,
          },
        };
        axios
          .put(
            BACKEND_ENDPOINT + `/surveys/6534de82edd78c422c37f91b`,
            formData,
            config
          )
          .then((response) => {
            LogThis(log, `uploadResponse=${JSON.stringify(response)}`);
            setfileContents(e.target.result);
            setfileContentsReady(true);
            setUploading(false);
            setmyCSV(false);
            fileInputRef.current.value = "";
          });
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // const uploadFileHandler = async (e) => {
  //   //setmyCSV(true)
  //   const file = e.target.files[0];
  //   console.log(`uploadFileHandler start`);
  //   setUploading(true);
  //   setfileContentsReady(false);
  //   try {
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         console.log(`setting file contents`);
  //         console.log(e.target.result);
  //         setfileContents(e.target.result);
  //         setfileContentsReady(true);
  //       };
  //       reader.readAsText(file);
  //     }
  //     setUploading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setUploading(false);
  //   }
  // };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // LogThis(objLogSettings, `START`);
    // LogThis(
    //   objLogSettings,
    //   `in useEffect cycle uploading=${uploading}; fileContentsReady=${fileContentsReady}`
    // );
    const objLogSettings = new LoggerSettings(srcFileName, "useEffect");
    LogThis(
      objLogSettings,
      `in useEffect cycle uploading=${uploading}; fileContentsReady=${fileContentsReady}`
    );

    if (
      !uploading &&
      fileContentsReady &&
      !uploadingReales &&
      fileContentsRealesReady
    ) {
      LogThis(
        objLogSettings,
        `processing CSV uploading=${uploading}; fileContentsReady=${fileContentsReady}; uploadingReales=${uploadingReales}; fileContentsRealesReady=${fileContentsRealesReady}`
      );
      // console.log(`setting myCSV to true myCSV=${myCSV}`);
      // setmyCSV(true);
      // console.log(`setted myCSV to true myCSV=${myCSV}`)(async () => {
      //   await processCSVData();
      //   setmyCSV(false);
      //   console.log(`setted myCSV to false myCSV=${myCSV}`);
      // })();
      // // processCSVData().then(()=>{
      // // console.log(`setting myCSV to false myCSV=${myCSV}`)
      // // setmyCSV(false)
      // // console.log(`setted myCSV to false myCSV=${myCSV}`)
      // // })
    }
  }, [
    dispatch,
    fileContents,
    fileContentsReady,
    uploading,
    uploadingReales,
    fileContentsRealesReady,
  ]);

  return (
    <>
      {console.log(`rerender happening myCSV=${myCSV}`)}
      <h1> myCSV={myCSV ? "True" : "False"} </h1>
      {myCSV && <Loader />}
      <FormContainer>
        <h1>Subir archivo de respuestas de encuestas.</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="nombreDeArchivoNumerico">
            <Form.Label>Folder y nombre de archivo con datos</Form.Label>
            <br />
            <Form.Label>Archivo seleccionado: {nombreDeArchivo}</Form.Label>

            {/* <Form.Control
            type="text"
            placeholder={nombreDeArchivo}
            value={nombreDeArchivo}
            onChange={(e) => setnombreDeArchivo(e.target.value)}
          /> */}
            <Form.Control
              type="file"
              ref={fileInputRef}
              className=""
              onChange={uploadFileHandler}
            />
          </Form.Group>
          <Form.Group controlId="nombreDeArchivoReales">
            <Form.Label>Folder y nombre de archivo con datos reales</Form.Label>
            <Form.Control
              type="text"
              placeholder="Seleccionar el archivo datos reales"
              value={nombreDeArchivoDatosReales}
              onChange={(e) => setnombreDeArchivoDatosReales(e.target.value)}
            ></Form.Control>
            <Form.Control
              type="file"
              className=""
              onChange={uploadFileRealesHandler}
            ></Form.Control>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};

export default UploadSurveyAnswers;
