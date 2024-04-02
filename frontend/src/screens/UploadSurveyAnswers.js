/** @format */

import axios from 'axios'
import JSZip from 'jszip'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import FormData from 'form-data'

//import fs from "fs";
import React, { useState, useEffect, useRef } from 'react'
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
   //surveyProcessAnswersAction,
   surveyProcessAnswersAtClientAction,
   surveyDetailsAction,
   processAnswersFromMonkey,
   //surveyUpdateAnswersAtClientAction,
} from '../actions/surveyActions'
//import { surveysConfigurations } from "../surveysConfigurations";
import { LogThis, LoggerSettings, L1, L3 } from '../libs/Logger'

import { saveStringAsCSV } from '../libs/csvProcessingLib'
import {
   zipFile,
   unzipFile,
   unzipStringBase64,
   autoDownloadFileOnClientBrowser,
   autoDownloadTextAsFileOnClientBrowser,
   unzipFileFromSubfolder,
} from '../libs/Functions'
import { SURVEY_PROCESS_ANSWERS_RESET } from '../constants/surveyConstants'

const UploadSurveyAnswers = ({ match, history }) => {
   const srcFileName = 'UploadSurveyAnswers'
   const log = new LoggerSettings(srcFileName, 'UploadSurveyAnswers')

   const fileNumericAnswersRef = useRef(null)
   const fileRealAnswersRef = useRef(null)

   const [fileNumeric, setfileNumeric] = useState(null)
   const [fileReal, setfileReal] = useState(null)

   const [uploadingNumeric, setuploadingNumeric] = useState(false)
   const [uploadingReal, setuploadingReal] = useState(false)
   const [selectedUpdateType, setselectedUpdateType] = useState('new')

   const [uploadingServer, setuploadingServer] = useState(false)
   const [startToProcessAnswers, setstartToProcessAnswers] = useState(false)
   const [selectedSurveySuperior, setselectedSurveySuperior] = useState(null)
   const [surveyDetailsDispatched, setsurveyDetailsDispatched] = useState(false)

   const userLogin = useSelector(state => state.userLogin)
   const { userInfo } = userLogin

   const surveyProcessAnswers = useSelector(state => state.surveyProcessAnswers)
   const {
      loading: surveyLoading,
      error: surveyError,
      success: surveySuccess,
      survey: surveyData,
      surveyStatusMessage: surveyStatusMessage,
      surveySuccessMessage: surveySuccessMessage,
      surveyStatusRow: surveyRow,
   } = surveyProcessAnswers

   const surveyDetails = useSelector(state => state.surveyDetails)

   const {
      loading: surveyDetailLoading,
      error: surveyDetailError,
      success: surveyDetailSuccess,
      surveyDetailsInfo: surveyDetailsInfo,
   } = surveyDetails

   // const [nombreDeArchivoDatosReales, setnombreDeArchivoDatosReales] =
   //   useState(false);
   // const [nombreDeArchivo, setnombreDeArchivo] = useState(false);

   //const fileInputRef = useRef("");

   const dispatch = useDispatch()

   const uploadFileRealHandler = async e => {
      const objLogSettings = new LoggerSettings(
         srcFileName,
         'uploadFileRealHandler',
      )
      setuploadingReal(true)
      LogThis(objLogSettings, `START`)

      const file = e.target.files[0]
      if (file && file.name) {
         const extension = file.name.split('.').pop()

         if (extension === 'zip') {
            const unzippedText = await unzipFileFromSubfolder(
               file,
               'CSV',
               selectedSurveySuperior.surveyName + '.csv',
            )
            setfileReal(unzippedText)
            setuploadingReal(false)
         } else if (extension === 'csv') {
            const reader = new FileReader()
            reader.onload = e => {
               const content = e.target.result
               //setFileContent(content);
               setfileReal(content)
               setuploadingReal(false)
               // const zippedFile = await zipFile("fileNumeric.csv", file);
               // autoDownloadFileOnClientBrowser(zippedFile, "Numeric File 1021 Row.zip");

               // const unzippedText = await unzipFile(file, "OutputReport.csv");
               // autoDownloadTextAsFileOnClientBrowser(
               //   unzippedText,
               //   "OutputReportUnzipped.csv"
               // );
            }
            LogThis(log, 'numeric data read as text')
            reader.readAsText(file)

            // const zippedFile = await zipFile("fileReal.csv", file);
            // autoDownloadFileOnClientBrowser(zippedFile, "Real File 1021 Row.zip");
         } else {
            throw new Error(`La extension del archivo no CSV ni tampoco ZIP.`)
         }
      } else {
         setfileReal(null)
         setuploadingReal(false)
      }
      // };
      // reader.readAsText(file);

      // // const zippedFile = await zipFile("fileReal.csv", file);
      // // autoDownloadFileOnClientBrowser(zippedFile, "Real File 1021 Row.zip");

      // setuploadingReal(false);
      LogThis(log, 'END')
   }

   const uploadFileNumericHandler = async e => {
      const log = new LoggerSettings(srcFileName, 'uploadFileHandler')
      LogThis(log, 'START')
      setuploadingNumeric(true)
      const file = e.target.files[0]
      if (file && file.name) {
         const extension = file.name.split('.').pop()

         if (extension === 'zip') {
            const unzippedText = await unzipFileFromSubfolder(
               file,
               'CSV',
               selectedSurveySuperior.surveyName + '.csv',
            )
            setfileNumeric(unzippedText)
            // autoDownloadTextAsFileOnClientBrowser(
            //   unzippedText,
            //   "OutputReportUnzipped.csv"
            // );
            LogThis(log, 'numeric data read as text')
            setuploadingNumeric(false)
         } else if (extension === 'csv') {
            const reader = new FileReader()
            reader.onload = e => {
               const content = e.target.result
               //setFileContent(content);
               setfileNumeric(content)
               // const zippedFile = await zipFile("fileNumeric.csv", file);
               // autoDownloadFileOnClientBrowser(zippedFile, "Numeric File 1021 Row.zip");

               // const unzippedText = await unzipFile(file, "OutputReport.csv");
               // autoDownloadTextAsFileOnClientBrowser(
               //   unzippedText,
               //   "OutputReportUnzipped.csv"
               // );
               LogThis(log, 'numeric data read as text')
               setuploadingNumeric(false)
            }

            reader.readAsText(file)
         }
      } else {
         fileRealAnswersRef.current.file = null
         setfileNumeric(null)
         setuploadingNumeric(false)
      }
   }

   const uploadToServer = async e => {
      e.preventDefault()
      const log = new LoggerSettings(srcFileName, 'uploadToServer')
      LogThis(log, 'START')

      dispatch({ type: SURVEY_PROCESS_ANSWERS_RESET })

      setstartToProcessAnswers(true)

      // dispatch(
      //   surveyProcessAnswersAction({
      //     surveySuperiorId: "6542afe8f8dbeb38182e234d",
      //     fileNumeric: fileNumeric,
      //     fileReal: fileReal,
      //   })

      // dispatch(
      //   surveyProcessAnswersAtClientAction({
      //     surveySuperiorId: "6542afe8f8dbeb38182e234d",
      //     fileNumeric: fileNumeric,
      //     fileReal: fileReal,
      //   })
      // );

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
   }

   // const testsHandler = async (e) => {
   //   e.preventDefault();
   //   const log = new LoggerSettings(srcFileName, "testsHandler");
   //   LogThis(log, "START");
   //   setuploadingServer(true);
   //   LogThis(log, `token=${userInfo.token}`);
   //   const config = {
   //     //responseType: "arraybuffer",
   //     headers: {
   //       //"Content-Type": "multipart/form-data",
   //       Authorization: `Bearer ${userInfo.token}`,
   //       Accept: "application/zip",
   //     },
   //   };

   //   const { data } = await axios.put(
   //     BACKEND_ENDPOINT + `/surveys/tests`,
   //     {},
   //     config
   //   );
   //   LogThis(log, `data=${data}`);
   //   const unzippedText = unzipStringBase64(data, "OutputReport.csv");
   //   //const text = new TextDecoder().decode(new Uint8Array(data));

   //   console.log(unzippedText); // Output: "Hello, world!"
   //   LogThis(log, `text=${unzippedText}`);
   //   setuploadingServer(false);
   // };

   const handleSelectSurveySuperior = async e => {
      log.functionName = 'handleSelectSurveySuperior'
      const selectedSurvey =
         surveyDetailsInfo.surveySuperiors[e.target.selectedIndex - 1]

      LogThis(
         log,
         `selectedSurvey=${JSON.stringify(selectedSurvey)}; index=${
            e.target.selectedIndex - 1
         }; surveyDetailsInfo=${JSON.stringify(surveyDetailsInfo)}`,
      )
      setselectedSurveySuperior(selectedSurvey)
   }

   const handleUpdateTypeChange = event => {
      setselectedUpdateType(event.target.id)
   }

   const updateMonkeyDataHandler = () => {
      log.functionName = 'updateMonkeyDataHandler'

      dispatch(
         processAnswersFromMonkey({
            surveyInfo: selectedSurveySuperior,
            updateType: selectedUpdateType,
         }),
      )
   }

   useEffect(() => {
      if (!userInfo) {
         LogThis(log, `No userInfo available`, L3)
         history.push('/sign-in')
      } else {
         LogThis(
            log,
            `useEffect startToProcess=${startToProcessAnswers}; uploadingServer=${uploadingServer}`,
         )
         if (startToProcessAnswers && !uploadingServer) {
            setuploadingServer(true)
            LogThis(
               log,
               `selectedSurveySuperior=${JSON.stringify(
                  selectedSurveySuperior,
               )}`,
            )
            //if (selectedUpdateType == "all") {
            LogThis(log, `update type selected ALL`, L3)
            dispatch(
               surveyProcessAnswersAtClientAction({
                  surveySuperiorId: selectedSurveySuperior._id,
                  surveyShortName: selectedSurveySuperior.superSurveyShortName,
                  updateType: selectedUpdateType,
                  fileNumeric: fileNumeric,
                  fileReal: fileReal,
               }),
            )
            // } else {
            //   LogThis(log, `update type selected NEW`, L3);
            //   dispatch(
            //     surveyUpdateAnswersAtClientAction({
            //       surveySuperiorId: selectedSurveySuperior._id,
            //       surveyShortName: selectedSurveySuperior.superSurveyShortName,
            //       fileNumeric: fileNumeric,
            //       fileReal: fileReal,
            //     })
            //   );
            // }
            setstartToProcessAnswers(false)
         }
         LogThis(log, `checking surveyData: `)
         if (
            !surveyLoading &&
            surveySuccess &&
            (surveyData || surveyData == '') &&
            uploadingServer
         ) {
            saveStringAsCSV(surveyData, 'OutputReport.csv')
            //dispatch({ type: SURVEY_PROCESS_ANSWERS_RESET });
            setuploadingServer(false)
         } else if (
            uploadingServer &&
            !surveyLoading &&
            !surveySuccess &&
            surveyError
         ) {
            setuploadingServer(false)
         }
      }
   }, [
      dispatch,
      surveyLoading,
      surveyData,
      surveyError,
      surveySuccess,
      uploadingServer,
      surveyRow,
      userInfo,
      startToProcessAnswers,
   ])

   useEffect(() => {
      if (!surveyDetailsDispatched) {
         dispatch(surveyDetailsAction({}))
         setsurveyDetailsDispatched(true)
      }
   }, [
      dispatch,
      surveyDetailLoading,
      surveyDetailSuccess,
      surveyDetailsInfo,
      surveyDetailError,
   ])

   return (
      <>
         {LogThis(log, `Rendering`)}
         {(uploadingNumeric ||
            uploadingReal ||
            uploadingServer ||
            surveyDetailLoading) && <Loader />}
         <FormContainer>
            {surveyError && <Message variant="danger">{surveyError}</Message>}

            <h1>Seleccione la encuesta a procesar</h1>
            {LogThis(log, `Rendering`)}
            {!surveyDetailLoading &&
               surveyDetailSuccess &&
               surveyDetailsInfo &&
               surveyDetailsInfo.surveySuperiors && (
                  <>
                     <Form.Control
                        as="select"
                        value={selectedSurveySuperior ?? ''}
                        onChange={handleSelectSurveySuperior}
                     >
                        <option value=""> Seleccionar...</option>
                        {/* <option value="">
                  {" "}
                  {surveyDetailsInfo.surveySuperiors[0].surveyName}
                </option> */}
                        {surveyDetailsInfo.surveySuperiors.map(
                           (element, index) => {
                              return (
                                 <option key={index} value={element}>
                                    {element.surveyName}
                                 </option>
                              )
                           },
                        )}
                     </Form.Control>
                  </>
               )}

            <Form onSubmit={uploadToServer}>
               <Form.Group>
                  <br />
                  <Form.Check
                     type="radio"
                     label="Sólo procesar respuestas nuevas."
                     name="updateType"
                     id="new"
                     checked={selectedUpdateType == 'new'}
                     onChange={handleUpdateTypeChange}
                  />
                  <Form.Check
                     type="radio"
                     label="Reprocesar respuestas anteriores y nuevas."
                     name="updateType"
                     id="all"
                     checked={selectedUpdateType == 'all'}
                     onChange={handleUpdateTypeChange}
                  />
               </Form.Group>

               <Form.Group controlId="nombreDeArchivoNumerico">
                  <br />
                  <Form.Label>
                     Seleccione archivo de respuestas numéricas:
                  </Form.Label>

                  {/* <Form.Control
            type="text"
            placeholder={nombreDeArchivo}
            value={nombreDeArchivo}
            onChange={(e) => setnombreDeArchivo(e.target.value)}
          /> */}
                  <Form.Control
                     type="file"
                     ref={fileNumericAnswersRef}
                     // className=""
                     onChange={uploadFileNumericHandler}
                     disabled={
                        !(
                           fileNumericAnswersRef.current &&
                           fileNumericAnswersRef.current.files.length > 0
                        ) && selectedSurveySuperior == null
                           ? true
                           : false
                     }
                  />
               </Form.Group>
               <Form.Group controlId="nombreDeArchivoReales">
                  <Form.Label>
                     Seleccionar el archivo de respuestas reales
                  </Form.Label>
                  {/* <Form.Control
              type="text"
              placeholder="Seleccionar el archivo de respuestas reales"
              value={nombreDeArchivoDatosReales}
              onChange={(e) => setnombreDeArchivoDatosReales(e.target.value)}
            ></Form.Control> */}
                  <Form.Control
                     type="file"
                     className=""
                     ref={fileRealAnswersRef}
                     onChange={uploadFileRealHandler}
                     disabled={
                        !(
                           fileRealAnswersRef.current &&
                           fileRealAnswersRef.current.files.length > 0
                        ) &&
                        (selectedSurveySuperior == null ||
                           !(
                              fileNumericAnswersRef.current &&
                              fileNumericAnswersRef.current.files.length > 0
                           ))
                           ? true
                           : false
                     }
                  ></Form.Control>
                  {/* <br />
            <Button variant="primary" onClick={testsHandler}>
              Tests
            </Button> */}
                  <br />
                  <br />
                  <Button
                     type="submit"
                     variant="primary"
                     disabled={
                        selectedSurveySuperior != null &&
                        fileNumericAnswersRef.current &&
                        fileNumericAnswersRef.current.files.length > 0 &&
                        fileRealAnswersRef.current &&
                        fileRealAnswersRef.current.files.length > 0
                           ? false
                           : true
                     }
                  >
                     PROCESAR ENCUESTAS
                  </Button>
                  <br />
                  {/* <br />
            <Button
              type="button"
              variant="primary"
              disabled={selectedSurveySuperior != null ? false : true}
              onClick={updateMonkeyDataHandler}
            >
              Update from Survey Monkey
            </Button>
            <br /> */}
                  <br />
                  {surveyStatusMessage && surveyStatusMessage != '' && (
                     <Form.Label>
                        Estatus de procesamiento de la encuesta:
                     </Form.Label>
                  )}
                  <br />
                  <br />
                  {surveyStatusMessage && surveyStatusMessage != '' && (
                     <Form.Label>Estado: {surveyStatusMessage}</Form.Label>
                  )}
                  {surveySuccessMessage && surveySuccessMessage != '' && (
                     <Form.Label>{surveySuccessMessage}</Form.Label>
                  )}
                  <br />
                  <br />
                  {!surveySuccessMessage &&
                  surveySuccessMessage == '' &&
                  surveyStatusMessage &&
                  surveyStatusMessage != '' &&
                  surveyRow &&
                  surveyRow > 0 ? (
                     <Form.Label>
                        {console.log(`surveyRow=${surveyRow}`)}
                        Procesando encuesta número: {surveyRow}
                     </Form.Label>
                  ) : (
                     <></>
                  )}
               </Form.Group>
            </Form>
         </FormContainer>
      </>
   )
}

export default UploadSurveyAnswers
