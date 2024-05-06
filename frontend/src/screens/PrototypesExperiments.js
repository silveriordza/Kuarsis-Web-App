/** @format */

import html2Canvas from 'html2canvas'
import React, { useState, useEffect, useRef } from 'react'

import {
   DocumentEditorComponent,
   DocumentEditorContainerComponent,
   Print,
   SfdtExport,
   WordExport,
   TextExport,
   Selection,
   Search,
   Editor,
   ImageResizer,
   EditorHistory,
   ContextMenu,
   OptionsPane,
   HyperlinkDialog,
   TableDialog,
   BookmarkDialog,
   TableOfContentsDialog,
   PageSetupDialog,
   StyleDialog,
   ListDialog,
   ParagraphDialog,
   BulletsAndNumberingDialog,
   FontDialog,
   TablePropertiesDialog,
   BordersAndShadingDialog,
   TableOptionsDialog,
   CellOptionsDialog,
   StylesDialog,
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

const PrototypesExperiments = () => {
   const [excelExportMultiDataState, setexcelExportMultiDataState] = useState([
      { columns: [], data: [] },
   ])

   const [exportFields, setexportFields] = useState(false)

   const [excelExportarTriggered, setexcelExportarTriggered] = useState(false)
   const data = [
      { id: 1, name: 'John', percentage: 75 },
      { id: 2, name: 'Jane', percentage: 10 },
      { id: 3, name: 'Jane', percentage: 20 },
      { id: 4, name: 'Jane', percentage: 25 },
      { id: 5, name: 'Jane', percentage: 30 },
      { id: 6, name: 'Jane', percentage: 35 },
      { id: 7, name: 'Jane', percentage: 40 },
      { id: 8, name: 'Jane', percentage: 45 },
      { id: 9, name: 'Jane', percentage: 50 },
      { id: 10, name: 'Doe', percentage: 100 },
   ]
   const exportDataFileTrigger = exportPreguntas => {
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
      setexcelExportarTriggered(true)
      setexportFields(exportPreguntas)
      setexcelExportMultiDataState(excelMultiDataSet)
   }

   const renderProgressBarTemplate = props => {
      return (
         // <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
         //     <div style={{ width: `${props.percentage}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
         //     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>{props.percentage}%</div>
         // </div>
         <ProgressBar
            now={props.percentage}
            label={`${props.percentage}%`}
            variant="warning"
         />
      )
   }

   const renderSyncProgressBarTemplate = props => {
      return (
         // <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
         //     <div style={{ width: `${props.percentage}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
         //     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>{props.percentage}%</div>
         // </div>
         <ProgressBarComponent
            id="linear"
            type="Linear"
            width="100"
            height="20"
            trackThickness={24}
            progressThickness={24}
            value={props.percentage}
            showProgressValue={true}
            style={{ color: 'white', fontWeight: 'bold' }}
            progressColor="orange"
            animation={{
               enable: false,
               duration: 2000,
               delay: 0,
            }}
         ></ProgressBarComponent>
      )
   }
   const renderKuarxisProgressBarTemplate = props => {
      return <KuarxisPercentBarComponent percent={props.percentage} />
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
   const barChartImageRef = useRef(null)
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
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
         var postHtml = '</body></html>'
         //var html = preHtml + document.getElementById(element).innerHTML + postHtml
         var html = preHtml + imgHtml + elementRef.outerHTML + postHtml

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
            1500,
            250,
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
   // DocumentEditorComponent.Inject(
   //    // Print,
   //    // SfdtExport,
   //    WordExport,
   //    // TextExport,
   //    // Selection,
   //    // Search,
   //    Editor,
   //    // ImageResizer,
   //    // EditorHistory,
   //    // ContextMenu,
   //    // OptionsPane,
   //    // HyperlinkDialog,
   //    // TableDialog,
   //    // BookmarkDialog,
   //    // TableOfContentsDialog,
   //    // PageSetupDialog,
   //    // StyleDialog,
   //    // ListDialog,
   //    // ParagraphDialog,
   //    // BulletsAndNumberingDialog,
   //    FontDialog,
   //    // TablePropertiesDialog,
   //    // BordersAndShadingDialog,
   //    // TableOptionsDialog,
   //    // CellOptionsDialog,
   //    // StylesDialog,
   //    Toolbar,
   // )
   //END SYNCFUSION DOCUMENT EDITOR FUNCTIONS

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
         <h1>Hola Survey Single Response Detail</h1>
         <div>
            <ExcelFile
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
            </Button>
         </div>

         <div ref={gridComponentRef} id="exportContent">
            <GridComponent dataSource={data} width={900}>
               <ColumnsDirective>
                  <ColumnDirective field="id" headerText="ID" width={50} />
                  <ColumnDirective field="name" headerText="Name" width={100} />
                  <ColumnDirective
                     field="percentage"
                     headerText="Percentage"
                     width={100}
                     template={renderProgressBarTemplate}
                  />
                  <ColumnDirective
                     field="percentage"
                     headerText="Percentage"
                     width={100}
                     template={renderSyncProgressBarTemplate}
                  />
                  <ColumnDirective
                     field="percentage"
                     headerText="Percentage"
                     width={100}
                     template={renderKuarxisProgressBarTemplate}
                  />
                  <ColumnDirective
                     field="percentage"
                     headerText="Percentage"
                     width={100}
                  />
               </ColumnsDirective>
               <Inject services={[]} />
            </GridComponent>
         </div>
         <div class="kuarxisProgressColumn">
            <KuarxisPercentBarComponent percent={90} />
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
            {/* <DocumentEditorComponent
               id="container"
               height={'590px'}
               width={'1500px'}
               serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
               isReadOnly={false}
               // enablePrint={true}
               enableSelection={true}
               enableEditor={true}
               // enableEditorHistory={true}
               // enableContextMenu={true}
               // enableSearch={true}
               // enableOptionsPane={true}
               // enableBookmarkDialog={true}
               // enableBordersAndShadingDialog={true}
               enableFontDialog={true}
               // enableTableDialog={true}
               // enableParagraphDialog={true}
               // enableHyperlinkDialog={true}
               // enableImageResizer={true}
               // enableListDialog={true}
               // enablePageSetupDialog={true}
               // // enableSfdtExport={true}
               // enableStyleDialog={true}
               // enableTableOfContentsDialog={true}
               // enableTableOptionsDialog={true}
               // enableTablePropertiesDialog={true}
               // enableTextExport={true}
               enableWordExport={true}
               enableToolbar={true}
               ref={documentEditorContainer}
            /> */}
         </div>
      </section>
   )
}

export default PrototypesExperiments
