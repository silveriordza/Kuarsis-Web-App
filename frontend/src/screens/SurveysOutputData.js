/** @format */

import axios from 'axios'
import JSZip from 'jszip'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import FormData from 'form-data'

//import fs from "fs";
import React, { useState, useEffect, useRef } from 'react'
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button, Table, Col, Row, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
//import FormContainer from '../components/FormContainer'
import PaginateGeneric from '../components/PaginateGeneric'
import { saveStringAsCSV } from '../libs/csvProcessingLib'
import ExcelExport from 'react-data-export'

//import _ from "lodash";

import {
   surveyProcessAnswersAction,
   surveyProcessAnswersAtClientAction,
   surveyDetailsAction,
   surveyGetOutputValuesAction,
   surveyOutputExportDataAction,
} from '../actions/surveyActions'
//import { surveysConfigurations } from "../surveysConfigurations";
import { LogThis, LoggerSettings, L1, L2, L3, L0 } from '../libs/Logger'

import { formatDate } from '../libs/Functions'
import {
   zipFile,
   unzipFile,
   unzipStringBase64,
   autoDownloadFileOnClientBrowser,
   autoDownloadTextAsFileOnClientBrowser,
   unzipFileFromSubfolder,
} from '../libs/Functions'
import { SURVEY_OUTPUTS_RESET } from '../constants/surveyConstants'

const SurveysOutputData = ({ match, history }) => {
   const srcFileName = 'SurveysOutputData'
   const log = new LoggerSettings(srcFileName, 'SurveysOutputData')
   const ExcelFile = ExcelExport.ExcelFile
   const ExcelSheet = ExcelExport.ExcelFile.ExcelSheet
   const multiDataSet = [
      {
         columns: [
            { title: 'Headings', width: { wpx: 80 } }, //pixels width
            { title: 'Text Style', width: { wch: 40 } }, //char width
            { title: 'Colors', width: { wpx: 90 } },
         ],
         data: [
            [
               { value: 'H1', style: { font: { sz: '24', bold: true } } },
               { value: 'Bold', style: { font: { bold: true } } },
               {
                  value: 'Red',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFFF0000' },
                     },
                  },
               },
            ],
            [
               { value: 'H2', style: { font: { sz: '18', bold: true } } },
               { value: 'underline', style: { font: { underline: true } } },
               {
                  value: 'Blue',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FF0000FF' },
                     },
                  },
               },
            ],
            [
               { value: 'H3', style: { font: { sz: '14', bold: true } } },
               { value: 'italic', style: { font: { italic: true } } },
               {
                  value: 'Green',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FF00FF00' },
                     },
                  },
               },
            ],
            [
               { value: 'H4', style: { font: { sz: '12', bold: true } } },
               { value: 'strike', style: { font: { strike: true } } },
               {
                  value: 'Orange',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFF86B00' },
                     },
                  },
               },
            ],
            [
               { value: 'H5', style: { font: { sz: '10.5', bold: true } } },
               { value: 'outline', style: { font: { outline: true } } },
               {
                  value: 'Yellow',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFFFFF00' },
                     },
                  },
               },
            ],
            [
               { value: 'H6', style: { font: { sz: '7.5', bold: true } } },
               { value: 'shadow', style: { font: { shadow: true } } },
               {
                  value: 'Light Blue',
                  style: {
                     fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFCCEEFF' },
                     },
                  },
               },
            ],
         ],
      },
   ]

   const keyword = match.params.keyword || ''
   const pageNumber = match.params.pageNumber || 1
   const surveySelectedParam = match.params.surveySelected || -1

   const [selectedPageNumber, setselectedPageNumber] = useState(pageNumber)

   const [selectedSurveySuperior, setselectedSurveySuperior] = useState(null)
   const [newSelectedSurveySuperior, setnewSelectedSurveySuperior] =
      useState(false)
   const [surveyDetailsDispatched, setsurveyDetailsDispatched] = useState(false)

   const [searchKeyword, setsearchKeyword] = useState(keyword)
   const [surveySelected, setsurveySelected] = useState(surveySelectedParam)

   const [dispatchExport, setdispatchExport] = useState(false)
   const [exportStatusMessage, setexportStatusMessage] = useState('')

   const [exportFields, setexportFields] = useState(true)
   const [startExcelDownload, setstartExcelDownload] = useState(false)

   const userLogin = useSelector(state => state.userLogin)
   const { userInfo } = userLogin
   const typingTimer = useRef(null)

   const surveyDetails = useSelector(state => state.surveyDetails)

   const {
      loading: surveyDetailLoading,
      error: surveyDetailError,
      success: surveyDetailSuccess,
      surveyDetailsInfo: surveyDetailsInfo,
   } = surveyDetails

   const surveyOutputs = useSelector(state => state.surveyOutputs)

   const surveyOutputsExportData = useSelector(
      state => state.surveyOutputsExportData,
   )
   const {
      loading: exportLoading,
      error: exportError,
      success: exportSuccess,
      csvData: exportCsvData,
      message: exportMessage,
   } = surveyOutputsExportData

   const { loading, error, success, surveyOutputsInfo } = surveyOutputs

   const dispatch = useDispatch()

   // const testsHandler = async (e) => {
   //   e.preventDefault();
   //   const log = new LoggerSettings(srcFileName, "testsHandler");
   //   LogThis(log, "START");
   // };

   const handleSelectSurveySuperior = async e => {
      log.functionName = 'handleSelectSurveySuperior'
      LogThis(log, `START`, L3)
      const index = e.target.selectedIndex - 1
      if (index < 0) {
         dispatch({
            type: SURVEY_OUTPUTS_RESET,
         })
         setsurveySelected(-1)
         setselectedSurveySuperior(null)
         history.push('/admin/surveyoutput')
      } else {
         const selectedSurvey =
            surveyDetailsInfo.surveySuperiors[e.target.selectedIndex - 1]
         setsurveySelected(e.target.selectedIndex - 1)
         history.push(
            `/admin/surveyoutput/survey/${
               e.target.selectedIndex - 1
            }/page/${selectedPageNumber}`,
         )
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
   }

   const reselectSurveyAfterPagination = async selectedSurveyIndex => {
      log.functionName = 'reselectSurveyAfterPagination'
      const selectedSurvey =
         surveyDetailsInfo.surveySuperiors[selectedSurveyIndex]
      setsurveySelected(selectedSurveyIndex)

      LogThis(
         log,
         `selectedSurvey=${JSON.stringify(
            selectedSurvey,
         )}; index=${selectedSurveyIndex}; surveyDetailsInfo=${JSON.stringify(
            surveyDetailsInfo,
         )}`,
         L3,
      )
      setselectedSurveySuperior(selectedSurvey)
      setnewSelectedSurveySuperior(true)
   }

   // const debouncedKeywordSearch = _.debounce((newKeyword) => {
   //   log.functionName = "debouncedKeywordSearch";
   //   LogThis(log, `START newKeyword=${newKeyword}`, L1);
   //   setsearchKeyword(newKeyword);
   //   setnewSelectedSurveySuperior(true);
   // }, 2000);
   const handleSearchText = async e => {
      log.functionName = 'handleSearchText'
      //debouncedKeywordSearch(e.target.value);

      if (!typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L3)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
         }, 1000)
      else {
         clearTimeout(typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L3)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
         }, 1000)
      }
      setsearchKeyword(e.target.value)
      LogThis(log, `START text=${e.target.value}`, L3)
   }

   const handlePageChange = e => {
      log.functionName = 'handlePageChange'

      LogThis(log, `START surveySelectedParam=${surveySelected}`, L3)
      if (surveySelected >= 0) {
         reselectSurveyAfterPagination(surveySelected)
         setnewSelectedSurveySuperior(true)
         setselectedPageNumber(e.target.text)
      }
   }

   const GenerateOutputFile = outputId => {
      let outputText = null
      const outputValue = surveyOutputsInfo.outputValues.find(
         output => output._id === outputId,
      )
      if (outputValue) {
         const keys = Object.keys(outputValue)
         keys.shift()
         let outputField = null
         let outputValueData = null
         keys.map(key => {
            outputField = surveyOutputsInfo.outputLayouts.find(x => {
               return x.fieldName == key
            })
            if (outputField.showInSurveyOutputScreen) {
               switch (outputField.fieldName) {
                  case 'INFO_3':
                     outputValueData = formatDate(outputValue[key])
                     break
                  case 'INFO_4':
                     outputValueData = formatDate(outputValue[key])
                     break
                  default:
                     outputValueData = outputValue[key]
               }

               let encoder = new TextEncoder()
               let utf8Array = encoder.encode(outputValueData)
               let utf8String = new TextDecoder()
                  .decode(utf8Array)
                  .replace(/,/g, ' ')
                  .replace(/:/g, '')
               let questionShortutf8Array = encoder.encode(outputField.question)
               let questionShortUtf8String = new TextDecoder()
                  .decode(questionShortutf8Array)
                  .replace(/,/g, ' ')
                  .replace(/:/g, '')

               if (outputText) {
                  outputText =
                     outputText +
                     '\n' +
                     `${questionShortUtf8String}: ${utf8String}`
               } else {
                  outputText = `${questionShortUtf8String}: ${utf8String}`
               }
               return outputText
            } else {
               return
            }
         })
         saveStringAsCSV(outputText, `OutputReport_${outputValue.INFO_1}.txt`)
         console.log(`outputText=${outputText}`)
      }
   }

   const exportDataFile = (outputData, exportFields) => {
      setdispatchExport(true)
      setexportFields(exportFields)
   }

   const exportDataExcelFile = (outputData, exportFields) => {
      setdispatchExport(true)
      setexportFields(exportFields)
   }

   useEffect(() => {
      LogThis(
         log,
         `UseEffect getoutput, newSelectedSurveySuperior=${newSelectedSurveySuperior}; loading=${loading}`,
         L3,
      )
      if (!userInfo) {
         LogThis(log, `No userInfo available`, L3)
         history.push('/sign-in')
      } else {
         if (newSelectedSurveySuperior && !loading && selectedSurveySuperior) {
            LogThis(log, `About to dispatch surveyGetOutputValuesAction`, L3)
            LogThis(
               log,
               `dispatching selectedSurvey._id=${selectedSurveySuperior._id}; selectedSurveySuperior.superSurveyShortName=${selectedSurveySuperior.superSurveyShortName}; selectedPageNumber=${selectedPageNumber}; searchKeyword=${searchKeyword};`,
               L3,
            )
            dispatch(
               surveyGetOutputValuesAction({
                  surveySuperiorId: selectedSurveySuperior._id,
                  superSurveyShortName:
                     selectedSurveySuperior.superSurveyShortName,
                  pageNumber: selectedPageNumber,
                  keyword: searchKeyword,
                  /*startDate: new Date(2024, 4, 18, 0, 0, 0, 0),
                  endDate: new Date(2024, 4, 19, 0, 0, 0, 0),*/
               }),
            )
            setnewSelectedSurveySuperior(false)
         }
      }
   }, [
      dispatch,
      //userInfo,
      newSelectedSurveySuperior,
      //loading,
      selectedSurveySuperior,
      selectedPageNumber,
      //selectedPageNumber,
   ])

   useEffect(() => {
      LogThis(log, `UseEffect details`, L3)
      if (!userInfo) {
         LogThis(log, `No userInfo available`, L3)
         history.push('/sign-in')
      } else {
         LogThis(
            log,
            `Details dispatched surveyDetailsDispatched=${surveyDetailsDispatched}`,
            L3,
         )
         if (!surveyDetailsDispatched) {
            LogThis(log, `About to dispatch surveyDetailsAction`, L3)
            dispatch(surveyDetailsAction({}))
            setsurveyDetailsDispatched(true)
         }
      }
   }, [dispatch, surveyDetailsDispatched])

   useEffect(() => {
      LogThis(log, `UseEffect export data`, L3)
      if (!userInfo) {
         LogThis(log, `No userInfo available`, L3)
         history.push('/sign-in')
      } else {
         LogThis(log, `else of surveyOutputExportDataAction dispatch`, L3)
         if (dispatchExport) {
            LogThis(log, `About to dispatch surveyOutputExportDataAction`, L3)
            setdispatchExport(false)
            dispatch(
               surveyOutputExportDataAction({
                  surveySuperiorId: selectedSurveySuperior._id,
                  superSurveyShortName:
                     selectedSurveySuperior.superSurveyShortName,
                  pages: surveyOutputsInfo.pages,
                  exportFieldNames: exportFields,
                  keyword: searchKeyword,
               }),
            )
         }
      }
   }, [dispatch, dispatchExport])

   useEffect(() => {
      LogThis(log, `UseEffect cycle ReporteRespuestas.csv`, L3)
      if (
         !exportLoading &&
         exportSuccess &&
         exportCsvData &&
         exportCsvData != ''
      ) {
         LogThis(log, `UseEffect about to save ReporteRespuestas.csv`, L3)
         //saveStringAsCSV(exportCsvData, 'ReporteRespuestas.csv')
         setstartExcelDownload(true)
         setdispatchExport(false)
      }
   }, [dispatch, exportLoading, exportSuccess, exportCsvData])

   useEffect(() => {
      LogThis(log, `UseEffect cycle setexportStatusMessage`, L3)

      setexportStatusMessage(exportMessage)
   }, [dispatch, exportMessage])

   useEffect(() => {
      LogThis(log, `UseEffect details`, L3)
      if (!userInfo) {
         LogThis(log, `No userInfo available`, L3)
         history.push('/sign-in')
      } else {
         LogThis(
            log,
            `Details dispatched surveyDetailsDispatched=${surveyDetailsDispatched}`,
            L3,
         )
         if (surveySelected > -1 && surveyDetailsInfo?.surveySuperiors) {
            reselectSurveyAfterPagination(surveySelected)
         }
      }
   }, [dispatch, surveySelected, surveyDetailsInfo])

   useEffect(() => {
      return () => {
         setsurveySelected(-1)
         setselectedSurveySuperior(null)
         dispatch({
            type: SURVEY_OUTPUTS_RESET,
         })
      }
   }, [])

   return (
      <Container fluid>
         {LogThis(log, `Rendering`)}
         {(loading || surveyDetailLoading) && <Loader />}
         {error && <Message variant="danger">{error.message}</Message>}
         <div>
            {!surveyDetailLoading &&
               surveyDetailSuccess &&
               surveyDetailsInfo &&
               surveyDetailsInfo.surveySuperiors && (
                  <Container style={{ marginTop: '1%' }}>
                     <Row>
                        <Col lg="auto">
                           <h5>Seleccione la encuesta</h5>
                           <Form.Control
                              as="select"
                              value={selectedSurveySuperior ?? ''}
                              onChange={handleSelectSurveySuperior}
                           >
                              <option key={50000} value={'NoSurveySelected'}>
                                 {' '}
                                 Seleccionar...
                              </option>
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
                        </Col>
                     </Row>
                  </Container>
               )}
         </div>

         {!loading &&
            success &&
            surveyOutputsInfo &&
            surveyOutputsInfo.outputLayouts &&
            surveyOutputsInfo.outputValues && (
               <>
                  <div>
                     <Container fluid>
                        <Form.Group controlId="textControl">
                           <Form.Label style={{ marginTop: '1%' }}>
                              Búsqueda por texto:
                           </Form.Label>
                           <Form.Control
                              type="text"
                              placeholder="Buscar..."
                              value={searchKeyword}
                              onChange={handleSearchText}
                           ></Form.Control>
                        </Form.Group>
                        <br />
                        <Row>
                           <Col lg="auto">
                              <Button
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                    exportDataFile(surveyOutputsInfo, false)
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> Exportar
                                 Preguntas
                              </Button>
                           </Col>
                           <Col lg="auto">
                              <Button
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                    exportDataFile(surveyOutputsInfo, true)
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> Exportar
                                 Campos
                              </Button>
                           </Col>
                           <Col>
                              <Button
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                    exportDataExcelFile(surveyOutputsInfo, true)
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> Exportar
                                 Excel
                              </Button>

                              {startExcelDownload && (
                                 <ExcelFile
                                    filename="ResultadosEncuestas"
                                    hideElement={true}
                                    element={<span />}
                                 >
                                    <ExcelSheet
                                       dataSet={multiDataSet}
                                       name="ResultadosEncuestas"
                                    />
                                 </ExcelFile>
                              )}
                              {startExcelDownload &&
                                 setstartExcelDownload(false)}
                           </Col>
                           <Col md="auto">
                              <Form.Label>{exportStatusMessage}</Form.Label>
                           </Col>
                        </Row>
                     </Container>
                  </div>
                  <div>
                     <Container fluid="xxl">
                        <Row>
                           <Col>
                              <Table
                                 striped
                                 bordered
                                 hover
                                 responsive
                                 className="table-sm"
                              >
                                 <thead>
                                    <tr>
                                       <th></th>
                                       {surveyOutputsInfo.outputLayouts.map(
                                          (layout, keyVal) => {
                                             if (
                                                layout.showInSurveyOutputScreen
                                             ) {
                                                let encoder = new TextEncoder()
                                                let utf8Array = encoder.encode(
                                                   layout.questionShort,
                                                )
                                                let utf8String =
                                                   new TextDecoder()
                                                      .decode(utf8Array)
                                                      .replace(/,/g, ' ')
                                                      .replace(/:/g, '')
                                                console.log(
                                                   `${layout.fieldName}:pos${layout.position}`,
                                                )
                                                return (
                                                   <th
                                                      key={keyVal}
                                                      style={{
                                                         whiteSpace: 'nowrap',
                                                      }}
                                                   >
                                                      {utf8String}
                                                   </th>
                                                )
                                             } else {
                                                return
                                             }
                                          },
                                       )}
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {surveyOutputsInfo.outputValues.map(
                                       outputValue => {
                                          const keys = Object.keys(outputValue)
                                          keys.shift()
                                          let outputValueData = null
                                          return (
                                             <tr key={outputValue._id}>
                                                <td>
                                                   <Button
                                                      variant="dark"
                                                      className="btn-sm"
                                                      onClick={() =>
                                                         GenerateOutputFile(
                                                            outputValue._id,
                                                         )
                                                      }
                                                   >
                                                      <i className="fas fa-tasks"></i>
                                                   </Button>
                                                </td>
                                                {surveyOutputsInfo.outputLayouts.map(
                                                   outputField => {
                                                      let key = null
                                                      key =
                                                         outputField.fieldName
                                                      if (
                                                         outputField.showInSurveyOutputScreen
                                                      ) {
                                                         switch (
                                                            outputField.fieldName
                                                         ) {
                                                            case 'INFO_3':
                                                               outputValueData =
                                                                  formatDate(
                                                                     outputValue[
                                                                        key
                                                                     ],
                                                                  )
                                                               break
                                                            case 'INFO_4':
                                                               outputValueData =
                                                                  formatDate(
                                                                     outputValue[
                                                                        key
                                                                     ],
                                                                  )
                                                               break
                                                            default:
                                                               outputValueData =
                                                                  outputValue[
                                                                     key
                                                                  ]
                                                         }

                                                         let encoder =
                                                            new TextEncoder()
                                                         let utf8Array =
                                                            encoder.encode(
                                                               outputValueData,
                                                            )
                                                         let utf8String =
                                                            new TextDecoder().decode(
                                                               utf8Array,
                                                            )
                                                         console.log(
                                                            `${outputField.fieldName}:ov${outputValueData}:txt${utf8String}:pos${outputField.position}`,
                                                         )
                                                         return (
                                                            <td
                                                               key={key}
                                                               style={{
                                                                  whiteSpace:
                                                                     'nowrap',
                                                               }}
                                                            >
                                                               {utf8String}
                                                            </td>
                                                         )
                                                      } else {
                                                         return
                                                      }
                                                   },
                                                )}
                                             </tr>
                                          )
                                       },
                                    )}
                                 </tbody>
                              </Table>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <PaginateGeneric
                                 onClick={handlePageChange}
                                 selectedSurveyIndex={surveySelected}
                                 pages={surveyOutputsInfo.pages}
                                 page={pageNumber}
                                 keyword={searchKeyword ? searchKeyword : ''}
                              />
                           </Col>
                        </Row>
                     </Container>
                  </div>
               </>
            )}
      </Container>
   )
}

export default SurveysOutputData
