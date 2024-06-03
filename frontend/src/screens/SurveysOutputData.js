/** @format */

import axios from 'axios'
import JSZip from 'jszip'

import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'

import FormData from 'form-data'

// import {
//    setSpinner,
//    createSpinner,
//    showSpinner,
// } from '@syncfusion/ej2-react-popups'

//import fs from "fs";
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

import KuarxisPercentBarComponent from '../components/KuarxisPercentBar/KuarxisPercentBarComponent'

import KuarxisRangeSemaphore from '../components/KuarxisPercentBar/KuarxisRangeSemaphore'

import KuarxisDashboardLayout from '../components/KuarxisDashboardLayout'

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
   OverlayTrigger,
   Tooltip,
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
   LazyLoadGroup,
   InfiniteScroll,
   ExcelExport,
   //Data,
   //PdfExport,
   ColumnChooser,
   Aggregate,
   AggregateColumnsDirective,
   AggregateDirective,
   AggregatesDirective,
   AggregateColumnDirective,
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
   //Tooltip,
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

import { LogManager, OFF } from '../classes/LogManager'

import { formatDate } from '../libs/Functions'
import {
   zipFile,
   unzipFile,
   unzipStringBase64,
   autoDownloadFileOnClientBrowser,
   autoDownloadTextAsFileOnClientBrowser,
   unzipFileFromSubfolder,
} from '../libs/Functions'
import {
   SURVEY_OUTPUTS_RESET,
   SURVEY_OUTPUT_SINGLE_SUCCESS,
} from '../constants/surveyConstants'

import ReactExport from 'react-data-export'

import { DATA_EXPORTER_TYPE_CSV } from '../classes/DataExporterCSV'
import {
   DATA_EXPORTER_TYPE_EXCEL_REACT_DATA_EXPORT,
   DataExporterExcelReactDataExport,
} from '../classes/DataExporterExcelReactDataExport'

L10n.load(spanishLocalization)
//loadCldr(esgregorian)

// const oldGenerateQuery = Data.prototype.generateQuery
// Data.prototype.generateQuery = function () {
//    const query = oldGenerateQuery.call(this, true)
//    // Check if 'pageQuery' is available in the prototype chain
//    if (Data.prototype.hasOwnProperty('pageQuery')) {
//       const pageQueryFn = Data.prototype['pageQuery']
//       pageQueryFn.call(this, query)
//    }
//    return query
// }
const srcFileName = 'SurveysOutputData'
const newLogger = new LogManager(srcFileName, 'SurveysOutputData')

const SurveysOutputData = ({ match, history }) => {
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
   // let dropDown
   // const dropDownData = [
   //    { text: 'Sólo página actual', value: 'CurrentPage' },
   //    { text: 'Todas las páginas', value: 'AllPages' },
   // ]

   const aggregateAverageCaptionTemplate = props => {
      let value = parseFloat(props.Average).toFixed(0)

      return <span>Prom: {value}</span>
   }
   const aggregateMinCaptionTemplate = props => {
      return <span>Min: {props.Min}</span>
   }
   const aggregateMaxCaptionTemplate = props => {
      return <span>Máx: {props.Max}</span>
   }

   const [showMaxTooltip, setshowMaxTooltip] = useState(false)

   const storedgridPageRowsQuantityText = localStorage.getItem(
      'surveyOutputData_gridPageRowsQuantityText',
   )

   const initialRowQuantity = storedgridPageRowsQuantityText ?? '10'

   const [gridPageRowsQuantityText, setgridPageRowsQuantityText] =
      useState(initialRowQuantity)
   //const pageSettings = { pageSize: 100 }
   const [pageSettings, setpageSettings] = useState({
      pageSize: parseInt(initialRowQuantity),
   })

   const [gridLoading, setgridLoading] = useState(false)

   const sortSettings = {
      columns: [],
   }
   const filterSettings = {
      type: 'Excel',
      ignoreAccent: true,
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
   const groupSettings = {
      //columns: ['FIAD-15 RESULTADO'],
      disablePageWiseAggregates: false,
      enableLazyLoading: true,
      captionTemplate:
         '<span class="groupItems"> ${headerText} - ${key} : ${count} encuestados </span>',
   }
   const toolbarOptions = ['ExcelExport', 'ColumnChooser']

   const toolbarClick = args => {
      const exportProperties = 'AllPages'
      if (grid && args.item.id === 'Grid_excelexport') {
         // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
         // const exportProperties = {
         //    exportType: dropDown.value,
         // }
         grid.showSpinner()
         grid.excelExport(exportProperties)
      }
      // else if (grid && args.item.id === 'Grid_pdfexport') {
      //    grid.pdfExport()
      // }
   }
   const excelExportComplete = () => {
      grid.hideSpinner()
   }
   let initial = true

   const dataBound = () => {
      if (grid) {
         //grid.autoFitColumns()
         //setgridLoading(false)
      }
      // else {
      //    setgridLoading(false)
      // }
      // if (grid && initial === true) {
      //    grid.groupModule.collapseAll()
      //    initial = false
      // }
   }
   //const [showSpinner, setshowSpinner] = useState(false)

   const dataStateChange = () => {
      setgridLoading(false)
   }

   const gridLoadCompletedHandler = () => {
      const localLog = new LogManager(srcFileName, 'gridLoadCompletedHandler')
      localLog.LogThis(`Entering`)
      setgridLoading(true)
   }

   const gridCreatedHandler = () => {
      const localLog = new LogManager(srcFileName, 'gridCreatedHandler')
      localLog.LogThis(`Entering`)

      setgridLoading(false)
   }
   /* DateRagePickerComponent constants */
   const stringdateRangeStart = localStorage.getItem(
      'surveyOutputData_dateRangeStart',
   )
   const stringdateRangeEnd = localStorage.getItem(
      'surveyOutputData_dateRangeEnd',
   )

   let dateRangeEndCalc = null
   if (stringdateRangeEnd) {
      dateRangeEndCalc = new Date(stringdateRangeEnd)
   } else {
      dateRangeEndCalc = new Date()
   }

   let dateRangeStartCalc = null
   if (stringdateRangeEnd) {
      dateRangeStartCalc = new Date(stringdateRangeStart)
   } else {
      dateRangeStartCalc = new Date()
      const dateRangeEndMonth = dateRangeEndCalc.getMonth()
      let targetMonth = dateRangeEndMonth - 1
      dateRangeStartCalc.setMonth(targetMonth)
   }

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

   const prepareDisplayBasedOnType = (
      keyVal,
      fieldName,
      layout,
      width,
      type,
   ) => {
      const localLog = new LogManager(srcFileName, 'prepareDisplayBasedOnType')
      localLog.LogThis(`Entering`)
      switch (layout.displayType.type) {
         case 'asIs':
            return (
               <ColumnDirective
                  key={keyVal}
                  field={fieldName}
                  width={width}
                  clipMode="EllipsisWithTooltip"
                  visible={layout.showInSurveyOutputScreen}
                  type={type}
               />
            )
         case 'percentBarWithCriterias':
            localLog.LogThis(`Calling percentBarWithCriterias`)
            return (
               <ColumnDirective
                  key={keyVal}
                  field={fieldName}
                  headerText={`${layout.displayType.header}`}
                  visible={layout.showInSurveyOutputScreen}
                  template={props =>
                     KuarxisPercentBarComponentTemplate(props, layout)
                  }
               />
            )
         case 'rangesSemaphore':
            localLog.LogThis(`Calling KuarxisRangesSemaphoreTemplate`)
            return (
               <ColumnDirective
                  key={keyVal}
                  field={fieldName}
                  headerText={`${layout.displayType.header}`}
                  visible={layout.showInSurveyOutputScreen}
                  template={props =>
                     KuarxisRangesSemaphoreTemplate(props, layout)
                  }
               />
            )
      }
   }

   const KuarxisRangesSemaphoreTemplate = (props, layout) => {
      const localLog = new LogManager(
         srcFileName,
         'KuarxisRangesSemaphoreTemplate',
      )
      localLog.LogThis(`Entering`)
      let value = props[layout.fieldName]
      localLog.LogThis(`Calling KuarxisRangeSemaphore`)
      return (
         <KuarxisRangeSemaphore
            value={value}
            styleCriterias={layout.displayType.styleCriterias}
         />
      )
   }

   const KuarxisPercentBarComponentTemplate = (props, layout) => {
      let value = props[layout.fieldName]
      const localLog = new LogManager(
         srcFileName,
         'KuarxisPercentBarComponentTemplate',
      )
      localLog.LogThis(`Entering`)

      if (isNaN(value)) {
         localLog.LogThis(
            `Error: value is not numeric for ${layout.fieldName} value=${value}`,
            L3,
         )
         throw Error(
            `At function KuarxisPercentBarComponentTemplate, the value for field ${layout.fieldName} is not numeric`,
         )
      }

      let styleCriteriaFound = false
      let style = null
      value = (value * 100).toFixed(0)
      for (const styleCriteria of layout.displayType.styleCriterias) {
         if (value >= styleCriteria.min && value <= styleCriteria.max) {
            style = styleCriteria.style
            localLog.LogThis(
               `styleCriteria found, field: ${layout.fieldName} value=${value} styleCriteria=${styleCriteria.style}`,
               L3,
            )
            styleCriteriaFound = true
            break
         }
      }
      if (!styleCriteriaFound) {
         localLog.LogThis(
            `Somethign is wrong, styleCriteria not found for: ${layout.fieldName} value=${value}`,
            L3,
         )
         throw Error(
            `Somethign is wrong, styleCriteria not found for: ${layout.fieldName} value=${value}`,
         )
      }
      localLog.LogThis(`Returning`)
      return (
         <KuarxisPercentBarComponent
            percent={value}
            color={style}
            // barWidth={'10%'}
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
            localStorage.setItem(
               'surveyOutputData_dateRangeStart',
               args.value[0].toString(),
            )
            localStorage.setItem(
               'surveyOutputData_dateRangeEnd',
               args.value[1].toString(),
            )
            setSelectedDates(args.value)
            setnewSelectedSurveySuperior(true)
         }
         let x = 0
         x = x + 1
      }, 300),
      [],
   )

   let keyword = match.params.keyword || ''
   const pageNumber = match.params.pageNumber || 1
   const surveySelectedParam = match.params.surveySelected || -1

   const [selectedPageNumber, setselectedPageNumber] = useState(pageNumber)

   const [selectedSurveySuperior, setselectedSurveySuperior] = useState(null)
   const [newSelectedSurveySuperior, setnewSelectedSurveySuperior] =
      useState(false)
   const [surveyDetailsDispatched, setsurveyDetailsDispatched] = useState(false)

   keyword =
      keyword != ''
         ? keyword
         : localStorage.getItem(`surveyOutputData_searchKeyword`) ?? ''

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
      setsearchKeyword(e.target.value)

      if (!typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L0)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
            localStorage.setItem(
               `surveyOutputData_searchKeyword`,
               e.target.value,
            )
         }, 1000)
      else {
         clearTimeout(typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L0)
            setnewSelectedSurveySuperior(true)
            setselectedPageNumber(1)
            localStorage.setItem(
               `surveyOutputData_searchKeyword`,
               e.target.value,
            )
         }, 1000)
      }

      LogThis(log, `START text=${e.target.value}`, L0)
   }

   const handlegridPageRowsQuantityText = async e => {
      log.functionName = 'handlegridPageRowsQuantityText'

      setgridPageRowsQuantityText(e.target.value)

      if (!typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L0)
            let rowsNumberString =
               e.target.value === null ||
               e.target.value === undefined ||
               e.target.value === ''
                  ? '1'
                  : e.target.value
            let localPageSettings = { pageSize: parseInt(rowsNumberString) }
            setpageSettings(localPageSettings)
            localStorage.setItem(
               `surveyOutputData_gridPageRowsQuantityText`,
               rowsNumberString,
            )
         }, 3000)
      else {
         clearTimeout(typingTimer.current)
         typingTimer.current = setTimeout(() => {
            LogThis(log, `timer executed`, L0)
            let rowsNumberString =
               e.target.value === null ||
               e.target.value === undefined ||
               e.target.value === ''
                  ? '1'
                  : e.target.value
            let localPageSettings = { pageSize: parseInt(rowsNumberString) }
            setpageSettings(localPageSettings)
            localStorage.setItem(
               `surveyOutputData_gridPageRowsQuantityText`,
               rowsNumberString,
            )
         }, 3000)
      }
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

   const handleOutputDetailLinkClick = (e, respondentId) => {
      e.preventDefault()
      dispatch({
         type: SURVEY_OUTPUT_SINGLE_SUCCESS,
         payload: {
            surveyOutputsInfo: surveyOutputsInfo,
            surveySelected: surveySelected,
            selectedPageNumber: selectedPageNumber,
         },
      })
      history.push(`/surveyoutput/detail/${respondentId}`)
   }

   const handleOutputDashboardLinkClick = e => {
      e.preventDefault()
      dispatch({
         type: SURVEY_OUTPUT_SINGLE_SUCCESS,
         payload: {
            surveyOutputsInfo: surveyOutputsInfo,
            surveySelected: surveySelected,
            selectedPageNumber: selectedPageNumber,
         },
      })
      history.push(`/surveyoutput/dashboard`)
   }

   const GenerateOutputFile = outputId => {
      const localLog = new LogManager(srcFileName, 'GenerateOutputFile')

      localLog.LogThis(`Entering`)
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
               switch (outputField.dataType) {
                  case 'Date':
                     outputValueData = formatDate(outputValue[key])
                     break
                  case 'Float':
                     if (
                        outputField.displayType.type ==
                        'percentBarWithCriterias'
                     ) {
                        outputValueData = `${(outputValue[key] * 100).toFixed(
                           0,
                        )}%`
                     } else {
                        outputValueData = outputValue[key]
                     }
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
         //console.log(`outputText=${outputText}`)
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

   const generateOutputFileTemplate = props => {
      let inputValue = props[props.column.field]
      const localLog = new LogManager(srcFileName, 'generateOutputFileTemplate')
      localLog.LogThis(`Entered`, L3)
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
      newSelectedSurveySuperior,
      triggerNewSearch,
      selectedSurveySuperior,
      selectedPageNumber,
      dateRangeStart,
      dateRangeEnd,
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
            let outputValueData = null
            let gridDataSourceObject = {}
            surveyOutputsInfo.outputLayouts.map(outputField => {
               let key = null
               key = outputField.fieldName

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
                  gridDataSourceObject[key] = outputValue[key]
               }
            })
            gridDataSourceArrayLocal.push(gridDataSourceObject)
         })
         setgridDataSourceArray(gridDataSourceArrayLocal)
      } else {
         setgridDataSourceArray([])
      }
      LogThis(log, `useEffect OutputInfo for DataGrid ENDED`, L3)
   }, [surveyOutputsInfo])

   useEffect(() => {
      let x
      x = x + 1
   }, [dateRangeStart, dateRangeEnd])

   useEffect(() => {
      // setdateRangeStart(
      //    new Date(
      //       JSON.parse(localStorage.getItem('surveyOutputData_dateRangeStart')),
      //    ) ?? dateRangeStart,
      // )
      // setdateRangeEnd(
      //    new Date(
      //       JSON.parse(localStorage.getItem('surveyOutputData_dateRangeEnd')),
      //    ) ?? dateRangeEnd,
      // )
      // setgridPageRowsQuantityText(
      //    JSON.parse(
      //       localStorage.getItem('surveyOutputData_gridPageRowsQuantityText') ??
      //          gridPageRowsQuantityText,
      //    ),
      // )
      // localStorage.setItem('surveyOutputData_dateRangeEnd', JSON.stringify(dateRangeEnd))
      // localStorage.setItem('surveyOutputData_gridPageRowsQuantityText', JSON.stringify(gridPageRowsQuantityText))

      return () => {
         setsurveySelected(-1)
         setselectedSurveySuperior(null)

         // localStorage.setItem(
         //    'surveyOutputData_gridPageRowsQuantityText',
         //    gridPageRowsQuantityText,
         // )

         dispatch({
            type: SURVEY_OUTPUTS_RESET,
         })
      }
   }, [])

   return (
      <Container fluid>
         {/* {console.log(`Rendering`)} */}
         {(loading || surveyDetailLoading || gridLoading) && <Loader />}
         {error && <Message variant="danger">{error.message}</Message>}
         <div>
            {!surveyDetailLoading &&
               surveyDetailSuccess &&
               surveyDetailsInfo &&
               surveyDetailsInfo.surveySuperiors && (
                  <Container fluid>
                     <Row className="mb-1">
                        <Col lg={3}>
                           <Form.Control
                              as="select"
                              value={selectedSurveySuperior ?? ''}
                              onChange={handleSelectSurveySuperior}
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
                        <Col lg={2}>
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
                                 ></Form.Control>
                              )}
                        </Col>

                        {!loading &&
                           success &&
                           surveyOutputsInfo &&
                           surveyOutputsInfo.outputLayouts &&
                           surveyOutputsInfo.outputValues && (
                              <>
                                 <Col lg={2}>
                                    <DateRangePickerComponent
                                       id="daterangepicker"
                                       placeholder="Select a range"
                                       startDate={dateRangeStart}
                                       endDate={dateRangeEnd}
                                       change={handleDateRangeChange}
                                       locale="es"
                                    />
                                 </Col>
                                 <Col lg={1}>
                                    <OverlayTrigger
                                       placement="top"
                                       delay={{ show: 50, hide: 50 }}
                                       show={showMaxTooltip}
                                       transition={true}
                                       onToggle={show => {
                                          if (show) {
                                             setTimeout(() => {
                                                setshowMaxTooltip(false)
                                             }, 2000)
                                          }
                                       }}
                                       overlay={
                                          <Tooltip id="tooltip-top">
                                             Máximo número de encuestas por
                                             página.
                                          </Tooltip>
                                       }
                                    >
                                       <div
                                          onMouseEnter={() => {
                                             setshowMaxTooltip(true)
                                          }}
                                       >
                                          <Form.Control
                                             type="number"
                                             placeholder="10"
                                             value={gridPageRowsQuantityText}
                                             onChange={
                                                handlegridPageRowsQuantityText
                                             }
                                          ></Form.Control>
                                       </div>
                                    </OverlayTrigger>
                                 </Col>
                              </>
                           )}
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
                                 onClick={() =>
                                    exportDataFile(true, DATA_EXPORTER_TYPE_CSV)
                                 }
                              >
                                 <i className="fas fa-save fa-2x"></i> CSV
                                 Campos
                              </Button>
                           </Col>

                           <Col lg="auto">
                              <Button
                                 variant="light"
                                 size="sm"
                                 onClick={e =>
                                    handleOutputDashboardLinkClick(e)
                                 }
                              >
                                 <i className="fas fa-table fa-2x"></i> Panel de
                                 gráficas
                              </Button>
                           </Col>
                           <Col md="auto">
                              <Form.Label>{exportStatusMessage}</Form.Label>
                           </Col>
                        </Row>
                     </Container>
                  </div>
                  {gridDataSourceArray && gridDataSourceArray.length > 0 && (
                     <div>
                        <Container fluid>
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
                              excelExportComplete={excelExportComplete}
                              toolbarClick={toolbarClick}
                              toolbar={toolbarOptions}
                              allowExcelExport={true}
                              // allowPdfExport={true}
                              showColumnChooser={true}
                              // enableInfiniteScrolling={true}
                              ref={g => (grid = g)}
                              height={(
                                 50 * parseInt(gridPageRowsQuantityText)
                              ).toString()}
                              created={gridCreatedHandler}
                              dataBound={dataBound}
                              // dataStateChange={dataStateChange}
                              load={gridLoadCompletedHandler}
                           >
                              <ColumnsDirective>
                                 <ColumnDirective
                                    field="INFO_1"
                                    headerText="CSV"
                                    width="100"
                                    type="number"
                                    template={generateOutputFileTemplate}
                                 />
                                 {/* {console.log(
                                    `Started Adding Columns in Render of GridComponents`,
                                 )} */}
                                 {surveyOutputsInfo.outputLayouts.map(
                                    (layout, keyVal) => {
                                       let encoder = new TextEncoder()
                                       let utf8Array = encoder.encode(
                                          layout.fieldName,
                                       )
                                       let utf8String = new TextDecoder()
                                          .decode(utf8Array)
                                          .replace(/,/g, ' ')
                                          .replace(/:/g, '')

                                       switch (layout.dataType) {
                                          case 'Date':
                                             newLogger.LogThis(
                                                `Adding date column`,
                                             )
                                             return (
                                                <ColumnDirective
                                                   key={keyVal}
                                                   field={utf8String}
                                                   width="250"
                                                   visible={
                                                      layout.showInSurveyOutputScreen
                                                   }
                                                   format="yMd"
                                                   type="datetime"
                                                />
                                             )
                                          case 'Integer':
                                             newLogger.LogThis(
                                                `Adding base on type Integer column`,
                                             )
                                             return prepareDisplayBasedOnType(
                                                keyVal,
                                                utf8String,
                                                layout,
                                                '250',
                                                'number',
                                             )
                                          case 'Float':
                                             newLogger.LogThis(
                                                `Adding base on type Integer column`,
                                             )
                                             return prepareDisplayBasedOnType(
                                                keyVal,
                                                utf8String,
                                                layout,
                                                '250',
                                                'number',
                                             )

                                          case 'String':
                                             newLogger.LogThis(
                                                `Adding string column`,
                                             )
                                             return utf8String === 'INFO_1' ? (
                                                <ColumnDirective
                                                   key={keyVal}
                                                   field={utf8String}
                                                   width="250"
                                                   visible={
                                                      layout.showInSurveyOutputScreen
                                                   }
                                                   clipMode="EllipsisWithTooltip"
                                                   template={props => {
                                                      newLogger.LogThis(
                                                         `Adding template for info1 link`,
                                                      )
                                                      return (
                                                         <Link
                                                            to="/surveyoutput/detail"
                                                            onClick={e =>
                                                               handleOutputDetailLinkClick(
                                                                  e,
                                                                  props.INFO_1,
                                                               )
                                                            }
                                                         >
                                                            {props.INFO_1}
                                                         </Link>
                                                      )
                                                   }}
                                                />
                                             ) : (
                                                <ColumnDirective
                                                   key={keyVal}
                                                   field={utf8String}
                                                   width="250"
                                                   visible={
                                                      layout.showInSurveyOutputScreen
                                                   }
                                                   clipMode="EllipsisWithTooltip"
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
                              <AggregatesDirective>
                                 <AggregateDirective>
                                    <AggregateColumnsDirective>
                                       {surveyOutputsInfo.outputLayouts.map(
                                          (layout, keyVal) => {
                                             newLogger.LogThis(
                                                `Adding aggregate average captions`,
                                             )
                                             let encoder = new TextEncoder()
                                             let utf8Array = encoder.encode(
                                                layout.fieldName,
                                             )
                                             let utf8String = new TextDecoder()
                                                .decode(utf8Array)
                                                .replace(/,/g, ' ')
                                                .replace(/:/g, '')
                                             if (
                                                layout.dataType === 'Integer'
                                             ) {
                                                return (
                                                   <AggregateColumnDirective
                                                      key={keyVal}
                                                      field={utf8String}
                                                      type="Average"
                                                      footerTemplate={
                                                         aggregateAverageCaptionTemplate
                                                      }
                                                   />
                                                )
                                             }
                                          },
                                       )}
                                    </AggregateColumnsDirective>
                                 </AggregateDirective>
                                 <AggregateDirective>
                                    <AggregateColumnsDirective>
                                       {surveyOutputsInfo.outputLayouts.map(
                                          (layout, keyVal) => {
                                             //layout.showInSurveyOutputScreen
                                             newLogger.LogThis(
                                                `Adding aggregate Max captions`,
                                             )
                                             let encoder = new TextEncoder()
                                             let utf8Array = encoder.encode(
                                                layout.fieldName,
                                             )
                                             let utf8String = new TextDecoder()
                                                .decode(utf8Array)
                                                .replace(/,/g, ' ')
                                                .replace(/:/g, '')
                                             if (
                                                layout.dataType === 'Integer'
                                             ) {
                                                return (
                                                   <AggregateColumnDirective
                                                      key={keyVal}
                                                      field={utf8String}
                                                      type="Max"
                                                      footerTemplate={
                                                         aggregateMaxCaptionTemplate
                                                      }
                                                   />
                                                )
                                             }
                                          },
                                       )}
                                    </AggregateColumnsDirective>
                                 </AggregateDirective>
                                 <AggregateDirective>
                                    <AggregateColumnsDirective>
                                       {surveyOutputsInfo.outputLayouts.map(
                                          (layout, keyVal) => {
                                             //layout.showInSurveyOutputScreen
                                             newLogger.LogThis(
                                                `Adding aggregate Min captions`,
                                             )
                                             let encoder = new TextEncoder()
                                             let utf8Array = encoder.encode(
                                                layout.fieldName,
                                             )
                                             let utf8String = new TextDecoder()
                                                .decode(utf8Array)
                                                .replace(/,/g, ' ')
                                                .replace(/:/g, '')
                                             if (
                                                layout.dataType === 'Integer'
                                             ) {
                                                return (
                                                   <AggregateColumnDirective
                                                      key={keyVal}
                                                      field={utf8String}
                                                      type="Min"
                                                      footerTemplate={
                                                         aggregateMinCaptionTemplate
                                                      }
                                                   />
                                                )
                                             }
                                          },
                                       )}
                                    </AggregateColumnsDirective>
                                 </AggregateDirective>
                              </AggregatesDirective>
                              <Inject
                                 services={[
                                    Page,
                                    Sort,
                                    Filter,
                                    Resize,
                                    Group,
                                    Toolbar,
                                    ExcelExport,
                                    // PdfExport,
                                    ColumnChooser,
                                    LazyLoadGroup,
                                    //InfiniteScroll,
                                    Aggregate,
                                 ]}
                              />
                           </GridComponent>
                        </Container>
                     </div>
                  )}
                  {/* <div>{console.log(`RENDER ENDED`)}</div> */}
               </>
            )}
      </Container>
   )
}

export default SurveysOutputData