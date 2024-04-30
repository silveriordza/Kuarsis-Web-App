/** @format */

import axios from 'axios'
import JSZip from 'jszip'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import FormData from 'form-data'

//import fs from "fs";
import React, { useState, useEffect, useRef, useCallback } from 'react'
//import csv from "csv-parser"; // Import the csv-parser library
// import { Link } from 'react-router-dom'
import {
   Form,
   Button,
   Table,
   Col,
   Row,
   Container,
   FloatingLabel,
   ProgressBar,
} from 'react-bootstrap'
//import { FloatingLabel } from 'react-bootstrap/FloatingLabel'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
//import FormContainer from '../components/FormContainer'
import PaginateGeneric from '../components/PaginateGeneric'
import { saveStringAsCSV } from '../libs/csvProcessingLib'
import {
   L10n,
   loadCldr,
   setCulture,
   setCurrencyCode,
} from '@syncfusion/ej2-base'
import {
   ColumnDirective,
   ColumnsDirective,
   Filter,
   GridComponent,
   Group,
   ExcelExport,
   PdfExport,
   ColumnChooser,
} from '@syncfusion/ej2-react-grids'
import {
   Inject,
   Page,
   Sort,
   Toolbar,
   Resize,
} from '@syncfusion/ej2-react-grids'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

import spanishLocalization from '../constants/esLocale.json'
import esgregorian from '../constants/es-gregorian.json'
import {
   ChartComponent,
   SeriesCollectionDirective,
   SeriesDirective,
   Legend,
   Category,
   Tooltip,
   DataLabel,
   BarSeries,
} from '@syncfusion/ej2-react-charts'

//import { data } from '../constants/datasource'

import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars'

//import _ from "lodash";
import debounce from 'lodash/debounce'

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

import ReactExport from 'react-data-export'

import { DATA_EXPORTER_TYPE_CSV } from '../classes/DataExporterCSV'
import {
   DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT,
   DataExporterExcelReactDataExport,
} from '../classes/DataExporterExcelReactDataExport'

L10n.load(spanishLocalization)
//loadCldr(esgregorian)

const SurveysOutputData = ({ match, history }) => {
   const srcFileName = 'SurveysOutputData'
   const log = new LoggerSettings(srcFileName, 'SurveysOutputData')

   //EXCEL SECTION START: VARIABLES PROPERTIES EVENTS AND FUNCTIONS
   const ExcelFile = ReactExport.ExcelFile
   const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
   const excelMultiDataSet = [
      {
         columns: [
            // { title: 'Name', width: { wch: 20 } }, //pixels width
         ],
         data: [
            // [{ value: 1 }, { value: 'Bold' }, { value: 'Red' }],
         ],
         // columns: [
         //    { title: 'Name', width: { wch: 20 } }, //pixels width
         //    { title: 'Text Style', width: { wch: 20 } }, //char width
         //    { title: 'Colors', width: { wch: 20 } },
         // ],
         // data: [
         //    [{ value: 1 }, { value: 'Bold' }, { value: 'Red' }],
         //    [{ value: 2598 }, { value: 'underline' }, { value: 'Blue' }],
         //    [{ value: 3 }, { value: 'italic' }, { value: 'Green' }],
         //    [{ value: 1295 }, { value: 'italic' }, { value: 'Green' }],
         // ],
      },
   ]

   const [excelExportMultiDataState, setexcelExportMultiDataState] = useState([
      { columns: [], data: [] },
   ])

   const [excelExportarTriggered, setexcelExportarTriggered] = useState(false)

   // const exportDataFileTrigger = exportPreguntas => {
   //    let colValues = []
   //    excelMultiDataSet[0].data = []
   //    if (exportFields) {
   //       excelMultiDataSet[0].columns[0].title = 'Campos'
   //       //excelMultiDataSet[0].data[1][1].value = "Valor Campo 1"
   //       colValues = []
   //       colValues.push({ value: 20000 })
   //       colValues.push({ value: '20001' })
   //       colValues.push({ value: 'SOME OTHER CAMPO VALUE' })
   //       excelMultiDataSet[0].data.push(colValues)
   //    } else {
   //       excelMultiDataSet[0].columns[0].title = 'Preguntas'
   //       //excelMultiDataSet[0].data[1][1].value = "Valor Pregunta 1"
   //       colValues = []
   //       colValues.push({ value: 10000 })
   //       colValues.push({ value: '10001' })
   //       colValues.push({ value: 'SOME OTHER PREGUNTA VALUE' })
   //       excelMultiDataSet[0].data.push(colValues)
   //    }
   //    setexcelExportarTriggered(true)
   //    setexportFields(exportPreguntas)
   //    setexcelExportMultiDataState(excelMultiDataSet)
   // }

   const excelExportarPreguntasButton = useRef(null)
   const excelExportarCamposButton = useRef(null)

   useEffect(() => {
      //const triggerButton = document.getElementById("exportar_preguntas")
      if (excelExportarTriggered) {
         if (exportFields) {
            excelExportarPreguntasButton.current.click()
         } else {
            excelExportarCamposButton.current.click()
         }
         setexcelExportarTriggered(false)
      }
   }, [excelExportMultiDataState, excelExportarTriggered])

   //EXCEL SECTION END: VARIABLES PROPERTIES EVENTS AND FUNCTIONS
   setCulture('es')

   let grid
   let dropDown
   const dropDownData = [
      { text: 'Sólo página actual', value: 'CurrentPage' },
      { text: 'Todas las páginas', value: 'AllPages' },
   ]

   const pageSettings = { pageSize: 100 }
   const sortSettings = {
      columns: [],
   }
   const filterSettings = {
      type: 'Excel',
      operators: {
         stringOperator: [
            { value: 'startsWith', text: 'Starts With' },
            { value: 'endsWith', text: 'Ends With' },
            { value: 'contains', text: 'Contains' },
            { value: 'equal', text: 'Equal' },
            { value: 'notEqual', text: 'Not Equal' },
         ],
         numberOperator: [
            { value: 'equal', text: 'Equal' },
            { value: 'notEqual', text: 'Not Equal' },
            { value: 'greaterThan', text: 'Greater Than' },
            { value: 'lessThan', text: 'Less Than' },
         ],
         dateOperator: [
            { value: 'equal', text: 'Equal' },
            { value: 'notEqual', text: 'Not Equal' },
            { value: 'greaterThan', text: 'After' },
            { value: 'lessThan', text: 'Before' },
         ],
         booleanOperator: [
            { value: 'equal', text: 'Equal' },
            { value: 'notEqual', text: 'Not Equal' },
         ],
      },
   }
   const groupSettings = { columns: [] }
   const toolbarOptions = ['ExcelExport', 'PdfExport', 'ColumnChooser']

   const toolbarClick = args => {
      const exportProperties = 'AllPages'
      if (grid && args.item.id === 'Grid_excelexport') {
         // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
         // const exportProperties = {
         //    exportType: dropDown.value,
         // }
         grid.excelExport(exportProperties)
      } else if (grid && args.item.id === 'Grid_pdfexport') {
         grid.pdfExport()
      }
   }

   const dataBound = () => {
      if (grid) {
         grid.autoFitColumns()
      }
   }
   /* DateRagePickerComponent constants */
   const dateRangeEndCalc = new Date()

   const dateRangeEndMonth = dateRangeEndCalc.getMonth()

   let targetMonth = dateRangeEndMonth - 1

   const dateRangeStartCalc = new Date()

   dateRangeStartCalc.setMonth(targetMonth)

   const [dateRangeStart, setdateRangeStart] = useState(dateRangeStartCalc)
   const [dateRangeEnd, setdateRangeEnd] = useState(dateRangeEndCalc)
   const data = [{ y: 25, x: '' }]

   const data2 = [
      { id: 1, name: 'John', percentage: 75 },
      { id: 2, name: 'Jane', percentage: 50 },
      { id: 3, name: 'Doe', percentage: 90 },
   ]
   const primaryxAxis = {
      valueType: 'Category',
   }
   const primaryyAxis = {
      title: 'Percentage (%)',
      minimum: 0,
      maximum: 100,
      edgeLabelPlacement: 'Shift',
      labelFormat: '{value}%',
   }
   const percentageBarTemplate = props => {
      // const primaryxAxis = {
      //    valueType: 'Category',
      // }
      // const primaryyAxis = {
      //    minimum: 0,
      //    maximum: 100,
      //    edgeLabelPlacement: 'Shift',
      //    labelFormat: '{value}%',
      // }
      // let data = [{ y: props.SCL90_TOTAL_MAX_360 / 360, x: '' }]
      // return (
      //    //<div style={{ height: '500px' }}>
      //    <ChartComponent
      //       id="charts"
      //       primaryXAxis={primaryxAxis}
      //       primaryYAxis={primaryyAxis}
      //       // width="650"
      //       height="50"
      //    >
      //       <Inject
      //          services={[BarSeries, Legend, Tooltip, DataLabel, Category]}
      //       />
      //       <SeriesCollectionDirective width="200">
      //          <SeriesDirective
      //             dataSource={data}
      //             xName="x"
      //             yName="y"
      //             type="Bar"
      //          ></SeriesDirective>
      //       </SeriesCollectionDirective>
      //    </ChartComponent>
      //    //</div>
      // )
      let valuePercent = (parseInt(props.SCL90_TOTAL_MAX_360) / 360) * 100

      return (
         <ProgressBar
            now={valuePercent}
            label={`${valuePercent}%`}
            variant="success"
         />
      )
   }

   const [selectedDates, setSelectedDates] = useState(null)

   function formatDate(dateIn) {
      let date = new Date(dateIn)
      const month = String(date.getMonth() + 1).padStart(2, '0') // Month (0-indexed)
      const day = String(date.getDate()).padStart(2, '0') // Day
      const year = date.getFullYear() // Year

      return `${month}/${day}/${year}`
   }
   /**
    * Using debounce from lodash here to to prevent the event to be triggered multiple times due to unwanted reasons.
    * Also using the React useCallback to set this handleDateRangeChange event handler as a Callback, this prevents the handler to be invoked multiple times due to the dateRangePickerComponent being recreated when re-rendering multiple times due to unwanted reasons.
    */
   const handleDateRangeChange = useCallback(
      debounce(args => {
         if (
            args &&
            args?.value &&
            (args.value[0] ?? false) &&
            (args.value[1] ?? false) &&
            (formatDate(dateRangeStart) != formatDate(args.value[0]) ||
               formatDate(dateRangeEnd) != formatDate(args.value[1]))
         ) {
            setdateRangeStart(args.value[0])
            setdateRangeEnd(args.value[1])
            setSelectedDates(args.value)
            setnewSelectedSurveySuperior(true)
         }
         let x = 0
         x = x + 1
      }, 300),
      [],
   )

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

   const [triggerNewSearch, settriggerNewSearch] = useState(false)

   const [exportFields, setexportFields] = useState(true)
   const [exportType, setexportType] = useState('')
   const exportAllowedRef = useRef(true)

   const [gridDataSourceArray, setgridDataSourceArray] = useState([])

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
      exportedData: exportexportedData,
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
         history.push('/surveyoutput')
      } else {
         const selectedSurvey =
            surveyDetailsInfo.surveySuperiors[e.target.selectedIndex - 1]
         setsurveySelected(e.target.selectedIndex - 1)
         history.push(
            `/surveyoutput/survey/${
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
            LogThis(log, `timer executed`, L0)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
         }, 1000)
      else {
         clearTimeout(typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L0)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
         }, 1000)
      }
      setsearchKeyword(e.target.value)
      LogThis(log, `START text=${e.target.value}`, L0)
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
         output => output.INFO_1 === outputId,
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

   const exportDataFile = (exportFieldsLocal, exportTypeLocal) => {
      if (exportAllowedRef.current) {
         exportAllowedRef.current = false
         setdispatchExport(true)
         setexportFields(exportFieldsLocal)
         setexportType(exportTypeLocal)
      }
   }

   // const exportDataExcelFile = (outputData, exportFields) => {
   //    setdispatchExport(true)
   //    setexportFields(exportFields)
   // }
   const generateOutputFileTemplate = props => {
      let inputValue = props[props.column.field]

      return (
         <Button
            variant="dark"
            className="btn-sm"
            onClick={() => GenerateOutputFile(inputValue)}
         >
            <i className="fas fa-tasks"></i>
         </Button>
      )
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
                  dateRangeStart: dateRangeStart,
                  dateRangeEnd: dateRangeEnd,
               }),
            )

            setnewSelectedSurveySuperior(false)
         }
      }
   }, [
      dispatch,
      //userInfo,
      newSelectedSurveySuperior,
      triggerNewSearch,
      //loading,
      selectedSurveySuperior,
      selectedPageNumber,
      dateRangeStart,
      dateRangeEnd,

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
                  exportType: exportType,
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
         exportexportedData &&
         exportexportedData != ''
      ) {
         LogThis(log, `UseEffect about to save ReporteRespuestas.csv`, L3)
         switch (exportType) {
            case DATA_EXPORTER_TYPE_CSV:
               saveStringAsCSV(exportexportedData, 'ReporteRespuestas.csv')
               break
            case DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT:
               setexcelExportarTriggered(true)
               setexcelExportMultiDataState(exportexportedData)
               break
            default:
               throw Error('Invalid export type')
         }

         //setstartExcelDownload(true)
         exportAllowedRef.current = true
         setdispatchExport(false)
      }
   }, [dispatch, exportLoading, exportSuccess, exportexportedData])

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
      LogThis(log, `useEffect OutputInfo for DataGrid`, L3)
      if (
         surveyOutputsInfo &&
         surveyOutputsInfo.outputValues &&
         surveyOutputsInfo.outputLayouts
      ) {
         let gridDataSourceArrayLocal = []
         surveyOutputsInfo.outputValues.map(outputValue => {
            // const keys = Object.keys(outputValue)
            // keys.shift()
            let outputValueData = null
            let gridDataSourceObject = {}
            surveyOutputsInfo.outputLayouts.map(outputField => {
               let key = null
               key = outputField.fieldName
               // if (
               //    outputField.showInSurveyOutputScreen
               // ) {
               let isDate = false
               switch (outputField.fieldName) {
                  case 'INFO_3':
                     outputValueData = formatDate(outputValue[key])
                     isDate = true
                     break
                  case 'INFO_4':
                     outputValueData = formatDate(outputValue[key])
                     isDate = true
                     break
                  default:
                     outputValueData = outputValue[key]
               }
               if (isDate) {
                  gridDataSourceObject[key] = new Date(outputValue[key])
               } else {
                  // let encoder = new TextEncoder()
                  // let utf8Array = encoder.encode(outputValueData ?? '')
                  // let utf8String = new TextDecoder().decode(utf8Array)
                  // console.log(
                  //    `${outputField.fieldName}:ov${outputValueData}:txt${utf8String}:pos${outputField.position}`,
                  // )

                  gridDataSourceObject[key] = outputValue[key]
               }

               // } else {
               //    return
               // }
            })
            gridDataSourceArrayLocal.push(gridDataSourceObject)
         })
         setgridDataSourceArray(gridDataSourceArrayLocal)
      } else {
         setgridDataSourceArray([])
      }
   }, [surveyOutputsInfo])

   useEffect(() => {
      let x
      x = x + 1
   }, [dateRangeStart, dateRangeEnd])

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
                  <Container
                     // style={{
                     //    marginTop: '1%',
                     //    height: '1000px',
                     //    backgroundColor: 'red',
                     // }}
                     fluid
                  >
                     <Row
                        className="mb-1"
                        // style={{ backgroundColor: 'yellow', height: '50px' }}
                     >
                        <Col
                           // style={{ backgroundColor: 'blue', height: '200%' }}
                           lg={3}
                        >
                           {/* <h5>Seleccione la encuesta</h5> */}
                           <Form.Control
                              as="select"
                              value={selectedSurveySuperior ?? ''}
                              onChange={handleSelectSurveySuperior}
                              // style={{ backgroundColor: 'orange' }}
                           >
                              <option key={50000} value={'NoSurveySelected'}>
                                 {' '}
                                 Seleccionar encuesta...
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
                        <Col
                           lg={2}
                           //className="h-1"
                           // style={{
                           //    height: '1px',
                           //    padding: '1px',
                           //    border: '1px',
                           // }}
                           // style={{ backgroundColor: 'brown', height: '10%' }}
                        >
                           {/* <Form> */}
                           {/* <FloatingLabel
                              controlId="flabel"
                              label="Texto a buscar..."
                              //className="mb-1"
                              // style={{
                              //    height: '1px',
                              //    padding: '1px',
                              //    border: '1px',
                              // }}
                              style={{
                                 backgroundColor: 'yellow',
                                 height: '1px',
                                 padding: '1px',
                                 lineHeight: 0.1,
                              }}
                           > */}
                           {!loading &&
                              success &&
                              surveyOutputsInfo &&
                              surveyOutputsInfo.outputLayouts &&
                              surveyOutputsInfo.outputValues && (
                                 <Form.Control
                                    type="text"
                                    placeholder="Texto a buscar..."
                                    value={searchKeyword}
                                    onChange={handleSearchText}
                                    //className="p-1"
                                    // style={{
                                    //    height: '1px',
                                    //    padding: '1px',
                                    //    border: '1px',
                                    // }}
                                    // style={{
                                    //    backgroundColor: 'green',
                                    //    height: '20px',
                                    //    padding: '5px',
                                    //    lineHeight: 0.1,
                                    // }}
                                 ></Form.Control>
                              )}
                           {/* </FloatingLabel> */}
                           {/* <FloatingLabel
                              controlId="floatingInput"
                              label="Email address"
                              className="mb-3"
                           >
                              <Form.Control
                                 type="email"
                                 placeholder="name@example.com"
                              />
                           </FloatingLabel>
                           <FloatingLabel
                              controlId="floatingPassword"
                              label="Password"
                           >
                              <Form.Control
                                 type="password"
                                 placeholder="Password"
                              />
                           </FloatingLabel> */}
                           {/* <Form.Group controlId="textControl">
                              <Form.Label style={{ marginTop: '1%' }}>
                                 Búsqueda por texto:
                              </Form.Label>
                              <Form.Control
                                 type="text"
                                 placeholder="Buscar..."
                                 value={searchKeyword}
                                 onChange={handleSearchText}
                              ></Form.Control>
                           </Form.Group> */}
                           {/* </Form> */}
                        </Col>
                        <Col lg={2}>
                           {!loading &&
                              success &&
                              surveyOutputsInfo &&
                              surveyOutputsInfo.outputLayouts &&
                              surveyOutputsInfo.outputValues && (
                                 <DateRangePickerComponent
                                    id="daterangepicker"
                                    placeholder="Select a range"
                                    startDate={dateRangeStart}
                                    endDate={dateRangeEnd}
                                    change={handleDateRangeChange}
                                    locale="es"
                                 />
                              )}
                           {/* </Form.Label>
                           </Form.Group> */}
                        </Col>
                        {/* </div> */}
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
                        <Row>
                           <Form>
                              <Row>
                                 {/* <Col>
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
                                 </Col>
                                 <Col>
                                    <Form.Group>
                                       <Form.Label style={{ marginTop: '1%' }}>
                                          Rango de Fechas:
                                       </Form.Label>
                                       <Form.Label
                                          style={{
                                             marginTop: '1%',
                                             marginLeft: '2%',
                                          }}
                                       >
                                          <DateRangePickerComponent
                                             id="daterangepicker"
                                             placeholder="Select a range"
                                             startDate={dateRangeStart}
                                             endDate={dateRangeEnd}
                                             change={handleDateRangeChange}
                                             //width="25%"
                                          />                                          
                                       </Form.Label>
                                    </Form.Group>
                                 </Col> */}
                              </Row>
                           </Form>
                        </Row>
                        {/* <br /> */}
                        <Row>
                           <Col lg="auto">
                              <div>
                                 <ExcelFile
                                    filename="DatosEncuestas"
                                    element={
                                       <Button
                                          ref={excelExportarPreguntasButton}
                                          variant="light"
                                          size="sm"
                                          style={{ display: 'none' }}
                                       >
                                          <i className="fas fa-save fa-2x"></i>{' '}
                                          Exportar Preguntas
                                       </Button>
                                    }
                                 >
                                    <ExcelSheet
                                       dataSet={excelExportMultiDataState}
                                       name="Datos"
                                    />
                                 </ExcelFile>
                                 <ExcelFile
                                    filename="DatosEncuestas"
                                    element={
                                       <Button
                                          ref={excelExportarCamposButton}
                                          variant="light"
                                          size="sm"
                                          style={{ display: 'none' }}
                                       >
                                          <i className="fas fa-save fa-2x"></i>{' '}
                                          Exportar Campos
                                       </Button>
                                    }
                                 >
                                    <ExcelSheet
                                       dataSet={excelExportMultiDataState}
                                       name="Datos"
                                    />
                                 </ExcelFile>
                                 <Button
                                    variant="light"
                                    size="sm"
                                    // className="btn-mg"
                                    // onClick={() => exportDataFileTrigger(true)}
                                    onClick={() =>
                                       exportDataFile(
                                          false,
                                          DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT,
                                       )
                                    }
                                 >
                                    <i className="fas fa-save fa-2x"></i> Excel
                                    Preguntas
                                 </Button>

                                 <Button
                                    variant="light"
                                    size="sm"
                                    // className="btn-mg"
                                    onClick={() =>
                                       exportDataFile(
                                          true,
                                          DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT,
                                       )
                                    }
                                 >
                                    <i className="fas fa-save fa-2x"></i>Excel
                                    Campos
                                 </Button>
                              </div>
                           </Col>
                           <Col lg="auto">
                              <Button
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                    exportDataFile(
                                       false,
                                       DATA_EXPORTER_TYPE_CSV,
                                    )
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> CSV
                                 Preguntas
                              </Button>
                           </Col>
                           <Col lg="auto">
                              <Button
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                    exportDataFile(true, DATA_EXPORTER_TYPE_CSV)
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> CSV
                                 Campos
                              </Button>
                           </Col>

                           {/* <Col>
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
                                       dataSet={excelMultiDataSource}
                                       name="ResultadosEncuestas"
                                    />
                                 </ExcelFile>
                              )}
                              {startExcelDownload &&
                                 setstartExcelDownload(false)}
                           </Col> */}
                           <Col md="auto">
                              <Form.Label>{exportStatusMessage}</Form.Label>
                           </Col>
                        </Row>
                     </Container>
                  </div>
                  <div>
                     {/* <Container fluid="xxl">
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
                     </Container> */}
                     <Container fluid>
                        {/* <GridComponent dataSource={data2} width="400">
                           <ColumnsDirective>
                              <ColumnDirective
                                 field="id"
                                 headerText="ID"
                                 width="100"
                              />
                              <ColumnDirective
                                 field="name"
                                 headerText="Name"
                                 width="100"
                              />
                              <ColumnDirective
                                 field="percentage"
                                 headerText="Numeric Percentage"
                                 width="100"
                                 //template={percentageBarTemplate}
                              />
                              <ColumnDirective
                                 field="percentage"
                                 headerText="Percentage"
                                 width="100"
                                 template={percentageBarTemplate}
                              />
                           </ColumnsDirective>
                           <Inject services={[]} />
                        </GridComponent>
                        <ChartComponent
                           id="charts2"
                           primaryXAxis={primaryxAxis}
                           primaryYAxis={primaryyAxis}
                           title="SCL-90 (%) OF TOTAL"
                           height="150"
                        >
                           <Inject
                              services={[
                                 BarSeries,
                                 Legend,
                                 Tooltip,
                                 DataLabel,
                                 Category,
                              ]}
                           />
                           <SeriesCollectionDirective>
                              <SeriesDirective
                                 dataSource={data}
                                 xName="x"
                                 yName="y"
                                 name="SCL90"
                                 type="Bar"
                              ></SeriesDirective>
                           </SeriesCollectionDirective>
                        </ChartComponent> */}

                        {/* <div className="mb-3">
                           <Form.Label className="mr-3">
                              {' '}
                              Tipo de exportación:{' '}
                           </Form.Label>
                           <DropDownListComponent
                              Class
                              ref={d => (dropDown = d)}
                              index={0}
                              width={170}
                              dataSource={dropDownData}
                           ></DropDownListComponent>
                        </div> */}
                        <GridComponent
                           //style={{ width: '100%' }}
                           id="Grid"
                           dataSource={gridDataSourceArray}
                           allowPaging={true}
                           pageSettings={pageSettings}
                           allowFiltering={true}
                           filterSettings={filterSettings}
                           allowGrouping={true}
                           groupSettings={groupSettings}
                           allowSorting={true}
                           allowMultiSorting={true}
                           sortSettings={sortSettings}
                           allowResizing={true}
                           // //width={1500}
                           toolbarClick={toolbarClick}
                           toolbar={toolbarOptions}
                           allowExcelExport={true}
                           allowPdfExport={true}
                           showColumnChooser={true}
                           ref={g => (grid = g)}
                           // height="100%"
                           dataBound={dataBound}
                        >
                           <ColumnsDirective>
                              {/* <ColumnDirective
                                 field="SCL90_TOTAL_MAX_360"
                                 headerText="SCL90 TOTAL %"
                                 //width="100"
                                 type="number"
                                 template={percentageBarTemplate}
                              />
                              <ColumnDirective
                                 field="SCL90_TOTAL_MAX_360"
                                 headerText="SCL90_TOTAL_NUMERIC"
                                 width="100"
                                 type="number"
                                 //template={percentageBarTemplate}
                              /> */}
                              <ColumnDirective
                                 field="INFO_1"
                                 width="100"
                                 type="number"
                                 template={generateOutputFileTemplate}
                              />
                              {surveyOutputsInfo.outputLayouts.map(
                                 (layout, keyVal) => {
                                    //layout.showInSurveyOutputScreen

                                    let encoder = new TextEncoder()
                                    let utf8Array = encoder.encode(
                                       layout.fieldName,
                                    )
                                    let utf8String = new TextDecoder()
                                       .decode(utf8Array)
                                       .replace(/,/g, ' ')
                                       .replace(/:/g, '')
                                    // console.log(
                                    //    `${layout.fieldName}:pos${layout.position}`,
                                    // )
                                    switch (layout.dataType) {
                                       case 'Date':
                                          return (
                                             <ColumnDirective
                                                //key={keyVal}
                                                field={utf8String}
                                                //width="150"
                                                visible={
                                                   layout.showInSurveyOutputScreen
                                                }
                                                format="yMd"
                                                type="datetime"
                                             />
                                          )
                                       case 'Integer':
                                          return (
                                             <ColumnDirective
                                                //key={keyVal}
                                                field={utf8String}
                                                width="150"
                                                visible={
                                                   layout.showInSurveyOutputScreen
                                                }
                                                type="number"
                                             />
                                          )
                                       case 'String':
                                          return (
                                             <ColumnDirective
                                                //key={keyVal}
                                                field={utf8String}
                                                width="150"
                                                visible={
                                                   layout.showInSurveyOutputScreen
                                                }
                                                type="string"
                                             />
                                          )
                                       default:
                                          throw Error(
                                             `Invalid dataType for field ${utf8String}`,
                                          )
                                    }
                                 },
                              )}
                           </ColumnsDirective>
                           <Inject
                              services={[
                                 Page,
                                 Sort,
                                 Filter,
                                 Resize,
                                 Group,
                                 Toolbar,
                                 ExcelExport,
                                 PdfExport,
                                 ColumnChooser,
                              ]}
                           />
                        </GridComponent>
                     </Container>
                  </div>
               </>
            )}
      </Container>
   )
}

export default SurveysOutputData
