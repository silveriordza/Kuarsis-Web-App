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

import { surveyExportHtml2WordAction } from '../actions/surveyActions'

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
   const dispatch = useDispatch()
   const { respondentId } = props.match.params
   const surveyOutputSingle = useSelector(state => state.surveyOutputSingle)
   const { surveyOutputSingleInfo, surveySelected, selectedPageNumber } =
      surveyOutputSingle
   const [gridDataSourceArray, setgridDataSourceArray] = useState([])

   const [gridLoadedCompleted, setgridLoadedCompleted] = useState(false)

   const handleGridLoadCompleted = e => {
      setgridLoadedCompleted(true)
   }

   const history = useHistory()

   const goBackHandler = e => {
      e.preventDefault()
      //history.goBack()
      history.push(
         `/surveyoutput/survey/${surveySelected}/page/${selectedPageNumber}`,
      )
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
            output => output.INFO_1 === respondentId,
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

   const resultsReferences = useRef(new Map())

   const addRef = (key, elementRef) => {
      resultsReferences.current.set(key, elementRef)
   }

   const handleExportHTMLImageToWord = () => {
      dispatch(
         surveyExportHtml2WordAction({
            resultsReferences: resultsReferences,
            respondentId: respondentId,
            wordFileName: 'PerfilEncuestado',
            surveyOutputSingleInfo: surveyOutputSingleInfo,
         }),
      )
   }

   const renderKuarxisProgressBarTemplate = props => {
      let fieldLayout = surveyOutputSingleInfo.outputLayouts.find(
         field => field.fieldName === props['fieldName'],
      )

      let fieldReferenceKey = null

      switch (fieldLayout.displayType.type) {
         case 'percentBarWithCriterias':
            const style = calculateStyleCriteria(
               props.value,
               fieldLayout.displayType.styleCriterias,
            )
            const value = (props.value * 100).toFixed(0)
            fieldReferenceKey = `${props['fieldName']}_percentBar`
            return (
               <KuarxisPercentBarComponent
                  id={`${props['fieldName']}_percentBar`}
                  // ref={elementRef =>
                  //    resultsReferences.current.set(
                  //       fieldReferenceKey,
                  //       elementRef,
                  //    )
                  // }
                  percent={value}
                  color={style}
                  barWidth={'30%'}
               />
            )
         default:
            fieldReferenceKey = props['fieldName']
            return (
               <span
                  id={fieldReferenceKey}
                  // ref={elementRef =>
                  //    resultsReferences.current.set(
                  //       fieldReferenceKey,
                  //       elementRef,
                  //    )
                  // }
               >
                  {props.value}
               </span>
            )
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

      //html2Canvas(gridComponentRef.current).then(canvas => {
      // const dataUrl = canvas.toDataURL()

      // // To insert the image at table first cell
      // documentEditorContainer.documentEditor.editor.insertImage(
      //    dataUrl,
      //    600,
      //    2000,
      // )
      //documentEditorContainer.documentEditor.editor.insertText('\n')
      //moveCursorToNextLine()
      // documentEditorContainer.documentEditor.editor.insertSectionBreak(
      //    SectionBreakType.Continuous,
      // )

      // documentEditorContainer.documentEditor.editor.insertSectionBreak(
      //    SectionBreakType.Continuous,
      // )
      // documentEditorContainer.documentEditor.editor.insertSectionBreak(
      //    SectionBreakType.Continuous,
      // )
      // documentEditorContainer.documentEditor.editor.insertSectionBreak(
      //    SectionBreakType.Continuous,
      // )
      // To insert the table in cursor position
      documentEditorContainer.documentEditor.editor.insertTable(
         gridDataSourceArray.length + 1,
         2,
      )
      // To insert text in cursor position
      documentEditorContainer.documentEditor.editor.insertText('Tipo Resultado')
      // To move the cursor to next cell
      moveCursorToNextCell()
      // To insert text in cursor position
      documentEditorContainer.documentEditor.editor.insertText(
         'Datos/Resultado',
      )
      // To move the cursor to next row

      for (const row of gridDataSourceArray) {
         // To insert text in cursor position
         moveCursorToNextRow()
         let columna = row['fieldName']
         documentEditorContainer.documentEditor.editor.insertText(columna)
         // To move the cursor to next cell
         moveCursorToNextCell()
         let value = row['value']
         // To insert text in cursor position
         documentEditorContainer.documentEditor.editor.insertText(
            value.toString(),
         )
      }

      // const percentBar = gridDataSourceArray.find(
      //    data => data.fieldName === 'JEFF_COLAB_INTERPERS_PERCENT_OF_MAX',
      // )

      const element = document.getElementById(
         'JEFF_COLAB_INTERPERS_PERCENT_OF_MAX_percentBar',
      )

      html2Canvas(element).then(canvas => {
         const dataUrl = canvas.toDataURL()
         const img = new Image()
         img.src = dataUrl
         //const imgHtml = img.outerHTML
         moveCursorToNextLine()
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
         // To insert the image at table first cell
         documentEditorContainer.documentEditor.editor.insertImage(
            //dataUrl,
            img,
            200,
            20,
         )
      })

      // // To insert text in cursor position
      // documentEditorContainer.documentEditor.editor.insertText('C11')
      // // To move the cursor to next cell
      // moveCursorToNextCell()
      // // To insert text in cursor position
      // documentEditorContainer.documentEditor.editor.insertText('C12')

      // // To move the cursor to next row
      // moveCursorToNextRow()
      // // To insert text in cursor position
      // documentEditorContainer.documentEditor.editor.insertText('C21')
      // // To move the cursor to next cell
      // moveCursorToNextCell()
      // // To insert text in cursor position
      // documentEditorContainer.documentEditor.editor.insertText('C22')
      // //})
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
         <Link to="/" className="btn btn-light my-3" onClick={goBackHandler}>
            Go Back
         </Link>
         <h3>Perfil del encuestado</h3>

         <div>
            <Button
               variant="light"
               size="sm"
               onClick={() => handleExportHTMLImageToWord()}
            >
               <i className="fas fa-save fa-2x"></i> Exportar a Word
            </Button>
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

         <div id="exportContent">
            {gridDataSourceArray && gridDataSourceArray.length > 0 && (
               <GridComponent
                  dataSource={gridDataSourceArray}
                  allowTextWrap={true}
                  width={900}
                  dataBound={handleGridLoadCompleted}
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
         {/* {gridLoadedCompleted && (
            <div className="kuarxisControl">
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
         )} */}
      </section>
   )
}

export default SurveyOutputSingleData
