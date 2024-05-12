/** @format */

import html2Canvas from 'html2canvas'
import { LogThis, LoggerSettings, L1, L2, L3, L0 } from '../libs/Logger'
import React, { useState, useEffect, useRef } from 'react'
import { formatDate } from '../libs/Functions'

import { Link, useHistory } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import {
   DocumentEditorContainerComponent,
   Toolbar,
   SectionBreakType,
} from '@syncfusion/ej2-react-documenteditor'

import {
   GridComponent,
   ColumnsDirective,
   ColumnDirective,
   Inject,
} from '@syncfusion/ej2-react-grids'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { ProgressBarComponent } from '@syncfusion/ej2-react-progressbar'

import KuarxisPercentBarComponent from '../components/KuarxisPercentBar/KuarxisPercentBarComponent'

import { calculateStyleCriteria } from '../components/KuarxisPercentBar/KuarxisPercentBarComponent'

import { saveAs } from 'file-saver'

import { Button } from 'react-bootstrap'

import ReactExport from 'react-data-export'
const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

const excelMultiDataSet = [
   {
      columns: [
         { title: 'Name', width: { wch: 20 } }, //pixels width
         { title: 'Text Style', width: { wch: 20 } }, //char width
         { title: 'Colors', width: { wch: 20 } },
      ],
      data: [
         [{ value: 1 }, { value: 'Bold' }, { value: 'Red' }],
         [{ value: 2598 }, { value: 'underline' }, { value: 'Blue' }],
         [{ value: 3 }, { value: 'italic' }, { value: 'Green' }],
         [{ value: 1295 }, { value: 'italic' }, { value: 'Green' }],
      ],
   },
]

const exportDataFile = exportPreguntas => {
   let colValues = []
   excelMultiDataSet[0].data = []
   if (exportPreguntas) {
      excelMultiDataSet[0].columns[0].title = 'Preguntas'
      //excelMultiDataSet[0].data[1][1].value = "Valor Pregunta 1"
      colValues = []
      colValues.push({ value: 10000 })
      colValues.push({ value: '10001' })
      colValues.push({ value: 'SOME OTHER PREGUNTA VALUE' })
      excelMultiDataSet[0].data.push(colValues)
   } else {
      excelMultiDataSet[0].columns[0].title = 'Campos'
      //excelMultiDataSet[0].data[1][1].value = "Valor Campo 1"
      colValues = []
      colValues.push({ value: 20000 })
      colValues.push({ value: '20001' })
      colValues.push({ value: 'SOME OTHER CAMPO VALUE' })
      excelMultiDataSet[0].data.push(colValues)
   }
}

const SurveyOutputSingleData = props => {
   const srcFileName = 'SurveyOutputSingleData'
   const log = new LoggerSettings(srcFileName, 'SurveyOutputSingleData')

   const { repondentId } = props.match.params
   const surveyOutputSingle = useSelector(state => state.surveyOutputSingle)
   const { surveyOutputSingleInfo } = surveyOutputSingle
   const [gridDataSourceArray, setgridDataSourceArray] = useState([])

   const history = useHistory()

   const goBackHandler = () => {
      history.goBack()
   }

   useEffect(() => {
      LogThis(log, `useEffect OutputInfo for DataGrid Single Output`, L3)
      if (
         surveyOutputSingleInfo &&
         surveyOutputSingleInfo.outputValues &&
         surveyOutputSingleInfo.outputLayouts
      ) {
         let gridDataSourceArrayLocal = []
         const outputValue = surveyOutputSingleInfo.outputValues.find(
            output => output.INFO_1 === repondentId,
         )

         let outputValueData = null
         let gridDataSourceObject = null
         const fieldNameKey = 'fieldName'
         const valueKey = 'value'
         surveyOutputSingleInfo.outputLayouts.map(outputField => {
            gridDataSourceObject = null
            if (
               // outputField.displayType?.displayInScreens?.find(
               //    screen => screen === 'SingleOutputScreen',
               // )
               outputField.showInSurveyOutputScreen
            ) {
               gridDataSourceObject = {}
               let key = null
               key = outputField.fieldName
               let isDate = false
               switch (outputField.dataType) {
                  case 'Date':
                     outputValueData = formatDate(outputValue[key])
                     isDate = true
                     break
                  default:
                     outputValueData = outputValue[key]
               }

               gridDataSourceObject[fieldNameKey] = key
               gridDataSourceObject[valueKey] = outputValueData
            }
            if (gridDataSourceObject) {
               gridDataSourceArrayLocal.push(gridDataSourceObject)
            }
         })
         setgridDataSourceArray(gridDataSourceArrayLocal)
      } else {
         setgridDataSourceArray([])
      }
   }, [surveyOutputSingleInfo])

   const [excelExportMultiDataState, setexcelExportMultiDataState] = useState([
      { columns: [], data: [] },
   ])

   const [exportFields, setexportFields] = useState(false)

   const [excelExportarTriggered, setexcelExportarTriggered] = useState(false)

   const renderKuarxisProgressBarTemplate = props => {
      if (!props) {
         return
      }
      let fieldLayout = surveyOutputSingleInfo.outputLayouts.find(
         field => field.fieldName === props['fieldName'],
      )
      switch (fieldLayout.displayType.type) {
         case 'percentBarWithCriterias':
            const style = calculateStyleCriteria(
               props.value,
               fieldLayout.displayType.styleCriterias,
            )
            const value = (props.value * 100).toFixed(0)
            return (
               <KuarxisPercentBarComponent
                  percent={value}
                  color={style}
                  barWidth={'10%'}
               />
            )
         default:
            return <span>{props.value}</span>
      }
   }

   const excelExportarPreguntasButton = useRef(null)
   const excelExportarCamposButton = useRef(null)

   const exportToWord = (element, filename = '') => {
      var preHtml =
         "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
      var postHtml = '</body></html>'
      var html = preHtml + document.getElementById(element).innerHTML + postHtml

      var blob = new Blob(['\ufeff', html], {
         type: 'application/msword',
      })

      // Specify link url
      var url =
         'data:application/vnd.ms-word;charset=utf-8,' +
         encodeURIComponent(html)

      // Specify file name
      filename = filename ? filename + '.doc' : 'document.doc'

      // Create download link element
      var downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
         navigator.msSaveOrOpenBlob(blob, filename)
      } else {
         // Create a link to the file
         downloadLink.href = url

         // Setting the file name
         downloadLink.download = filename

         //triggering the function
         downloadLink.click()
      }

      document.body.removeChild(downloadLink)
   }
   const gridComponentRef = useRef(null)
   const exportHTMLImageToWord = (element, filename = '') => {
      const elementRef = element.current

      html2Canvas(elementRef).then(canvas => {
         const dataUrl = canvas.toDataURL()
         const img = new Image()
         img.src = dataUrl
         const imgHtml = img.outerHTML
         //document.body.appendChild(img)
         //barChartElement.appendChild(img)

         var preHtml =
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title> <style> #customers {font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;} #customers td, #customers th {border: 1px solid #ddd;  padding: 8px;} #customers tr:nth-child(even){background-color:#f2f2f2;} #customers th {  padding-top: 12px;  padding-bottom: 12px;  text-align: left;  background-color: #04AA6D;  color: white;}</style></head><body>"
         var postHtml = '</body></html>'
         //var html = preHtml + document.getElementById(element).innerHTML + postHtml
         var tableHtml = ''

         tableHtml =
            '<table id="customers"><tr ><th >H1</th><th >H2</th><th >H3</th></tr>'
         tableHtml =
            tableHtml + '<tr><td >R1V1</td ><td >R1V2</td><td >R1V3</td></tr>'
         tableHtml =
            tableHtml + '<tr><td >R2V1</td><td >R2V2</td><td >R2V3</td></tr>'
         tableHtml =
            tableHtml + '<tr><td >R3V1</td><td >R3V2</td><td >R3V3</td></tr>'
         tableHtml = tableHtml + '</table>'

         var html =
            preHtml +
            "<div style='width:50px'>" +
            imgHtml +
            '</div>' +
            tableHtml +
            postHtml

         var blob = new Blob(['\ufeff', html], {
            type: 'application/msword',
         })

         // Specify link url
         var url =
            'data:application/vnd.ms-word;charset=utf-8,' +
            encodeURIComponent(html)

         // Specify file name
         filename = filename ? filename + '.doc' : 'document.doc'

         // Create download link element
         var downloadLink = document.createElement('a')

         document.body.appendChild(downloadLink)

         if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename)
         } else {
            // Create a link to the file
            downloadLink.href = url

            // Setting the file name
            downloadLink.download = filename

            //triggering the function
            downloadLink.click()
         }

         document.body.removeChild(downloadLink)
      })
   }
   //START SYNCFUSION DOCUMENT EDITOR FUNCTIONS
   //DocumentEditorContainerComponent.Inject(Toolbar)
   // tslint:disable:max-line-length
   //var documentEditorContainer = useRef(null)
   let documentEditorContainer = null
   const save = () => {
      //Download the document in Docx format.
      documentEditorContainer.documentEditor.save('sample', 'Docx')
   }
   DocumentEditorContainerComponent.Inject(Toolbar)

   function onCreated() {
      //const elementRef = element.current
      //moveCursortToFirstCell()
      html2Canvas(gridComponentRef.current).then(canvas => {
         const dataUrl = canvas.toDataURL()

         // To insert the image at table first cell
         documentEditorContainer.documentEditor.editor.insertImage(
            dataUrl,
            600,
            2000,
         )
         //documentEditorContainer.documentEditor.editor.insertText('\n')
         //moveCursorToNextLine()
         documentEditorContainer.documentEditor.editor.insertSectionBreak(
            SectionBreakType.Continuous,
         )

         documentEditorContainer.documentEditor.editor.insertSectionBreak(
            SectionBreakType.Continuous,
         )
         documentEditorContainer.documentEditor.editor.insertSectionBreak(
            SectionBreakType.Continuous,
         )
         documentEditorContainer.documentEditor.editor.insertSectionBreak(
            SectionBreakType.Continuous,
         )
         // To insert the table in cursor position
         documentEditorContainer.documentEditor.editor.insertTable(2, 2)

         // To insert text in cursor position
         documentEditorContainer.documentEditor.editor.insertText('C11')
         // To move the cursor to next cell
         moveCursorToNextCell()
         // To insert text in cursor position
         documentEditorContainer.documentEditor.editor.insertText('C12')

         // To move the cursor to next row
         moveCursorToNextRow()
         // To insert text in cursor position
         documentEditorContainer.documentEditor.editor.insertText('C21')
         // To move the cursor to next cell
         moveCursorToNextCell()
         // To insert text in cursor position
         documentEditorContainer.documentEditor.editor.insertText('C22')
      })
   }

   function moveCursortToFirstCell() {
      // To get current selection start offset
      var startOffset =
         documentEditorContainer.documentEditor.selection.startOffset
      // Increasing cell index to consider next cell
      var startOffsetArray = startOffset.split(';')
      startOffsetArray[2] = '0'
      startOffsetArray[3] = '0'
      // Changing start offset
      startOffset = startOffsetArray.join(';')
      // Navigating selection using select method
      documentEditorContainer.documentEditor.selection.select(
         startOffset,
         startOffset,
      )
   }

   function moveCursorToNextLine() {
      // To get current selection start offset
      var startOffset =
         documentEditorContainer.documentEditor.selection.startOffset
      // Increasing cell index to consider next cell
      documentEditorContainer.documentEditor.selection.moveToNextLine()

      startOffset = documentEditorContainer.documentEditor.selection.startOffset

      var startOffsetArray = startOffset.split(';')
      startOffsetArray[1] = '1'
      startOffsetArray[2] = `${parseInt(startOffsetArray[2]) + 1}`
      // startOffsetArray[3] = '0'
      // // Changing start offset
      startOffset = startOffsetArray.join(';')
      // Navigating selection using select method
      documentEditorContainer.documentEditor.selection.select(
         startOffset,
         startOffset,
      )
   }

   function moveCursorToNextCell() {
      // To get current selection start offset
      var startOffset =
         documentEditorContainer.documentEditor.selection.startOffset
      // Increasing cell index to consider next cell
      var startOffsetArray = startOffset.split(';')
      startOffsetArray[3] = parseInt(startOffsetArray[3]) + 1
      // Changing start offset
      startOffset = startOffsetArray.join(';')
      // Navigating selection using select method
      documentEditorContainer.documentEditor.selection.select(
         startOffset,
         startOffset,
      )
   }

   function moveCursorToNextRow() {
      // To get current selection start offset
      var startOffset =
         documentEditorContainer.documentEditor.selection.startOffset
      // Increasing row index to consider next row
      var startOffsetArray = startOffset.split(';')
      startOffsetArray[2] = parseInt(startOffsetArray[2]) + 1
      // Going back to first cell
      startOffsetArray[3] = 0
      // Changing start offset
      startOffset = startOffsetArray.join(';')
      // Navigating selection using select method
      documentEditorContainer.documentEditor.selection.select(
         startOffset,
         startOffset,
      )
   }

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

   return (
      <section>
         <Link className="btn btn-light my-3" onClick={() => history.goBack()}>
            Go Back
         </Link>
         <h1>Resultados de la Encuesta</h1>
         <div>
            {/* <ExcelFile
               element={
                  <Button
                     ref={excelExportarPreguntasButton}
                     variant="light"
                     size="sm"
                     style={{ display: 'none' }}
                  >
                     <i className="fas fa-save fa-2x"></i> Exportar Preguntas
                  </Button>
               }
            >
               <ExcelSheet dataSet={excelExportMultiDataState} name="Kuarxis" />
            </ExcelFile>
            <ExcelFile
               element={
                  <Button
                     ref={excelExportarCamposButton}
                     variant="light"
                     size="sm"
                     style={{ display: 'none' }}
                  >
                     <i className="fas fa-save fa-2x"></i> Exportar Campos
                  </Button>
               }
            >
               <ExcelSheet dataSet={excelExportMultiDataState} name="Kuarxis" />
            </ExcelFile>
            <Button
               variant="light"
               size="sm"
               // className="btn-mg"
               onClick={() => exportDataFileTrigger(true)}
            >
               <i className="fas fa-save fa-2x"></i> Bajar Preguntas Excel
            </Button>

            <Button
               variant="light"
               size="sm"
               // className="btn-mg"
               onClick={() => exportDataFileTrigger(false)}
            >
               <i className="fas fa-save fa-2x"></i> Bajar Campos Excel
            </Button>
            <Button
               variant="light"
               size="sm"
               onClick={() => exportToWord('exportContent', 'Respuestas.docx')}
            >
               <i className="fas fa-save fa-2x"></i> Bajar Word
            </Button>
            <Button
               variant="light"
               size="sm"
               onClick={() =>
                  exportHTMLImageToWord(gridComponentRef, 'exportContent.docx')
               }
            >
               <i className="fas fa-save fa-2x"></i> Bajar HTML a Word
            </Button> */}
         </div>

         <div ref={gridComponentRef} id="exportContent">
            {gridDataSourceArray && gridDataSourceArray.length > 0 && (
               <GridComponent
                  dataSource={gridDataSourceArray}
                  allowTextWrap={true}
                  width={900}
               >
                  <ColumnsDirective>
                     <ColumnDirective
                        key={1}
                        field="fieldName"
                        headerText="Tipo de resultado"
                        width={50}
                     />
                     <ColumnDirective
                        key={2}
                        field="value"
                        headerText="Datos/Resultado"
                        width={100}
                        template={props =>
                           renderKuarxisProgressBarTemplate(props)
                        }
                     />
                  </ColumnsDirective>
                  <Inject services={[]} />
               </GridComponent>
            )}
         </div>
         <div class="kuarxisControl">
            <Button variant="light" size="sm" onClick={() => save()}>
               <i className="fas fa-save fa-2x"></i> Exportar a Word
            </Button>

            <DocumentEditorContainerComponent
               id="container"
               height={'1500'}
               width={'2000'}
               serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
               enableToolbar={true}
               //ref={documentEditorContainer}
               ref={scope => {
                  documentEditorContainer = scope
               }}
               created={onCreated}
            />
         </div>
      </section>
   )
}

export default SurveyOutputSingleData
