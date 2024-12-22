/** @format */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { LogManager, OFF, L3 } from '../classes/LogManager'

import { Button } from 'react-bootstrap'

import { formatDate } from '../libs/Functions'
import { saveStringAsCSV } from '../libs/csvProcessingLib'

import KuarxisPercentBarComponent from '../components/KuarxisPercentBar/KuarxisPercentBarComponent'

import KuarxisRangeSemaphore from '../components/KuarxisPercentBar/KuarxisRangeSemaphore'

import {
   SURVEY_OUTPUTS_RESET,
   SURVEY_OUTPUT_SINGLE_SUCCESS,
} from '../constants/surveyConstants'

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
   Inject,
   Page,
   Sort,
   Toolbar,
   Resize,
   ColumnChooser,
   Aggregate,
   AggregateColumnsDirective,
   AggregateDirective,
   AggregatesDirective,
   AggregateColumnDirective,
} from '@syncfusion/ej2-react-grids'
const srcFileName = 'KuarxisDataGrid'

const KuarxisDataGrid = ({
   gridDataSourceArray,
   pageSettings,
   surveyOutputsInfo,
   surveySelected,
   selectedPageNumber,
   history,
   searchKeyword,
   isReRender,
}) => {
   //EXCEL SECTION END: VARIABLES PROPERTIES EVENTS AND FUNCTIONS

   const newLogger = new LogManager(srcFileName, 'KuarxisDataGrid')
   const dispatch = useDispatch()

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

   // const storedgridPageRowsQuantityText = localStorage.getItem(
   //    'surveyOutputData_gridPageRowsQuantityText',
   // )

   // const initialRowQuantity = storedgridPageRowsQuantityText ?? '10'

   // const [gridPageRowsQuantityText, setgridPageRowsQuantityText] =
   //    useState(initialRowQuantity)
   //const pageSettings = { pageSize: 100 }
   // const [pageSettings, setpageSettings] = useState({
   //    pageSize: parseInt(initialRowQuantity),
   // })

   //const [gridLoading, setgridLoading] = useState(false)

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

   // const dataStateChange = () => {
   //    setgridLoading(false)
   // }

   // const gridLoadCompletedHandler = () => {
   //    const localLog = new LogManager(
   //       srcFileName,
   //       'gridLoadCompletedHandler',
   //    )
   //    localLog.LogThis(`Entering`)
   //    setgridLoading(true)
   // }

   // const gridCreatedHandler = () => {
   //    const localLog = new LogManager(srcFileName, 'gridCreatedHandler')
   //    localLog.LogThis(`Entering`)

   //    setgridLoading(false)
   // }

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

   return (
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
         height={(50 * parseInt(pageSettings.pageSize)).toString()}
         //created={gridCreatedHandler}
         dataBound={dataBound}
         // dataStateChange={dataStateChange}
         //load={gridLoadCompletedHandler}
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
               `Rendering GridData NOW searchKeyword=${searchKeyword}`,
            )} */}
            {surveyOutputsInfo.outputLayouts.map((layout, keyVal) => {
               let encoder = new TextEncoder()
               let utf8Array = encoder.encode(layout.fieldName)
               let utf8String = new TextDecoder()
                  .decode(utf8Array)
                  .replace(/,/g, ' ')
                  .replace(/:/g, '')

               switch (layout.dataType) {
                  case 'Date':
                     newLogger.LogThis(`Adding date column`)
                     return (
                        <ColumnDirective
                           key={keyVal}
                           field={utf8String}
                           width="250"
                           visible={layout.showInSurveyOutputScreen}
                           format="yMd"
                           type="datetime"
                        />
                     )
                  case 'Integer':
                     newLogger.LogThis(`Adding base on type Integer column`)
                     return prepareDisplayBasedOnType(
                        keyVal,
                        utf8String,
                        layout,
                        '250',
                        'number',
                     )
                  case 'Float':
                     newLogger.LogThis(`Adding base on type Integer column`)
                     return prepareDisplayBasedOnType(
                        keyVal,
                        utf8String,
                        layout,
                        '250',
                        'number',
                     )

                  case 'String':
                     newLogger.LogThis(`Adding string column`)
                     return utf8String === 'INFO_1' ? (
                        <ColumnDirective
                           key={keyVal}
                           field={utf8String}
                           width="250"
                           visible={layout.showInSurveyOutputScreen}
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
                           visible={layout.showInSurveyOutputScreen}
                           clipMode="EllipsisWithTooltip"
                           type="string"
                        />
                     )
                  default:
                     throw Error(`Invalid dataType for field ${utf8String}`)
               }
            })}
         </ColumnsDirective>
         <AggregatesDirective>
            <AggregateDirective>
               <AggregateColumnsDirective>
                  {surveyOutputsInfo.outputLayouts.map((layout, keyVal) => {
                     newLogger.LogThis(`Adding aggregate average captions`)
                     let encoder = new TextEncoder()
                     let utf8Array = encoder.encode(layout.fieldName)
                     let utf8String = new TextDecoder()
                        .decode(utf8Array)
                        .replace(/,/g, ' ')
                        .replace(/:/g, '')
                     if (layout.dataType === 'Integer') {
                        return (
                           <AggregateColumnDirective
                              key={keyVal}
                              field={utf8String}
                              type="Average"
                              footerTemplate={aggregateAverageCaptionTemplate}
                           />
                        )
                     }
                  })}
               </AggregateColumnsDirective>
            </AggregateDirective>
            <AggregateDirective>
               <AggregateColumnsDirective>
                  {surveyOutputsInfo.outputLayouts.map((layout, keyVal) => {
                     //layout.showInSurveyOutputScreen
                     newLogger.LogThis(`Adding aggregate Max captions`)
                     let encoder = new TextEncoder()
                     let utf8Array = encoder.encode(layout.fieldName)
                     let utf8String = new TextDecoder()
                        .decode(utf8Array)
                        .replace(/,/g, ' ')
                        .replace(/:/g, '')
                     if (layout.dataType === 'Integer') {
                        return (
                           <AggregateColumnDirective
                              key={keyVal}
                              field={utf8String}
                              type="Max"
                              footerTemplate={aggregateMaxCaptionTemplate}
                           />
                        )
                     }
                  })}
               </AggregateColumnsDirective>
            </AggregateDirective>
            <AggregateDirective>
               <AggregateColumnsDirective>
                  {surveyOutputsInfo.outputLayouts.map((layout, keyVal) => {
                     //layout.showInSurveyOutputScreen
                     newLogger.LogThis(
                        `Adding aggregate Min captions ${layout.fieldName}`,
                     )
                     let encoder = new TextEncoder()
                     let utf8Array = encoder.encode(layout.fieldName)
                     let utf8String = new TextDecoder()
                        .decode(utf8Array)
                        .replace(/,/g, ' ')
                        .replace(/:/g, '')
                     if (layout.dataType === 'Integer') {
                        return (
                           <AggregateColumnDirective
                              key={keyVal}
                              field={utf8String}
                              type="Min"
                              footerTemplate={aggregateMinCaptionTemplate}
                           />
                        )
                     }
                  })}
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
   )
}

export default memo(KuarxisDataGrid, (prevProps, nextProps) => {
   const newLogger = new LogManager(srcFileName, 'KuarxisDataGrid memo')
   newLogger.LogThis(
      `!nextProps.isReRender= ${!nextProps.isReRender}, prevProps.searchKeyword=${
         nextProps.searchKeyword
      }, nextProps.searchKeyword=${nextProps.searchKeyword}`,
      L3,
   )
   return (
      !nextProps.isReRender &&
      prevProps.pageSettings.pageSize == nextProps.pageSettings.pageSize
   )
})
