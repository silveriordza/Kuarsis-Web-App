/** @format */

import html2Canvas from 'html2canvas'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import {
   ChartComponent,
   SeriesCollectionDirective,
   SeriesDirective,
   Legend,
   Category,
   StackingBarSeries,
   Tooltip,
   DataLabel,
   ILoadedEventArgs,
   ChartTheme,
   Highlight,
} from '@syncfusion/ej2-react-charts'

import { Browser } from '@syncfusion/ej2-base'

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

// export let dataStackedBar = [
//    { x: 'Jan', y: 6, y1: 6, y2: 1 },
//    { x: 'Feb', y: 8, y1: 8, y2: 1.5 },
//    { x: 'Mar', y: 12, y1: 11, y2: 2 },
//    { x: 'Apr', y: 15, y1: 16, y2: 2.5 },
//    { x: 'May', y: 20, y1: 21, y2: 3 },
//    { x: 'Jun', y: 24, y1: 25, y2: 3.5 },
// ]
const SAMPLE_CSS = `
.stacked-progress {
   width: 100%;
   height: 20px; /* Set height of the progress bar */
   background-color: #ccc; /* Set background color of the progress bar container */
   border-radius: 10px; /* Set border radius to create rounded corners */
   overflow: hidden; /* Ensure overflow is hidden */
}

.progress-bar {
   height: 100%;
   float: left; /* Float the progress bars to stack them horizontally */
   border-radius: 10px; /* Set border radius to create rounded corners */
}

.progress-bar1 {
   background-color: #ff5733; /* Set background color for the first progress bar */
}

.progress-bar2 {
   background-color: #ffcc33; /* Set background color for the second progress bar */
}

.progress-bar3 {
   background-color: #33ccff; /* Set background color for the third progress bar */
}

.progress-bar4 {
   background-color: #33ff57; /* Set background color for the fourth progress bar */
} 
`

const PrototypesExperiments = () => {
   // START PROTOTYPING THE 100% STACKED BAR
   // let dataStackedBar = [
   //    { x: 'Valores', y: 20, y1: 25, y2:30, y3: 25 },
   //    { x: 'Intereses', y: 25, y1: 30, y2: 25, y3: 20 },
   // ]

   let dataStackedBar = [{ x: 'Valores', y: 20, y1: 25, y2: 30, y3: 25 }]
   const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }`
   const onChartLoad = args => {
      let chart = document.getElementById('charts')
      chart.setAttribute('title', '')
   }
   const load = args => {
      let selectedTheme = window.location.hash.split('/')[1]
      selectedTheme = selectedTheme ? selectedTheme : 'Material'
      args.chart.theme = (
         selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
      )
         .replace(/-dark/i, 'Dark')
         .replace(/contrast/i, 'Contrast')
   }

   // END PROTOTYPING THE 100% STACKED BAR

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

   const [tooltipText, setTooltipText] = useState('')
   const handleMouseOver = (event, tooltip) => {
      const widthPercentage = event.target.style.width
      setTooltipText(`${tooltip}: ${widthPercentage}`) // Update tooltip text state
   }

   // Function to handle mouseout event
   const handleMouseOut = () => {
      setTooltipText('') // Clear tooltip text state
   }

   const renderKuarxisRangesSemaphore = props => {
      return (
         <div className="kuarxisSemaphoreContainer">
            <span className="kuarxisRangeSemaphore"> </span>
         </div>
      )
   }

   const renderKuarxisStacked100BarTemplate = props => {
      return (
         <div className="stackProgressContainer">
            <div className="stacked-progress">
               <div
                  className="progress-bar progress-bar1"
                  style={{ width: '10%' }}
                  // data-tooltip="Religion"
                  onMouseOver={e => handleMouseOver(e, 'Religion')}
                  onMouseOut={handleMouseOut}
               >
                  <span className="stackedProgrssBarText">10%</span>
               </div>

               <div
                  className="progress-bar progress-bar2"
                  style={{ width: '40%' }}
                  // data-tooltip="Politics"
                  onMouseOver={e => handleMouseOver(e, 'Politics')}
                  onMouseOut={handleMouseOut}
               >
                  <span className="stackedProgrssBarText">40%</span>
               </div>
               <div
                  className="progress-bar progress-bar3"
                  style={{ width: '10%' }}
                  // data-tooltip="Intelligence"
                  onMouseOver={e => handleMouseOver(e, 'Intelligence')}
                  onMouseOut={handleMouseOut}
               >
                  <span className="stackedProgrssBarText">10%</span>
               </div>
               <div
                  className="progress-bar progress-bar4"
                  style={{ width: '40%' }}
                  // data-tooltip="Mathematics"
                  onMouseOver={e => handleMouseOver(e, 'Mathematics')}
                  onMouseOut={handleMouseOut}
               >
                  <span className="stackedProgrssBarText">40%</span>
               </div>
            </div>
            <div className="label">
               <span className="color-square color1"></span> Religion
               <span className="color-square color2"></span> Politics
               <span className="color-square color3"></span> Intelligence
               <span className="color-square color4"></span> Mathematics
            </div>
            {tooltipText && <div className="tooltip">{tooltipText}</div>}
         </div>
      )
   }
   const renderSyncfusionStacked100BarTemplate = props => {
      return (
         // <div style={{ width: '100%', height: '100%' }}>
         <div>
            {/* <style>{SAMPLE_CSS}</style> */}
            <div className="control-section">
               <ChartComponent
                  //id="charts"
                  style={{ textAlign: 'center', fontSize: '10px' }}
                  legendSettings={{ enableHighlight: true }}
                  primaryXAxis={{
                     valueType: 'Category',
                     majorGridLines: { width: 0 },
                     majorTickLines: { width: 0 },
                  }}
                  primaryYAxis={{
                     edgeLabelPlacement: 'Shift',
                     //title: 'Sales (In Percentage)',
                     majorTickLines: { width: 0 },
                     lineStyle: { width: 0 },
                  }}
                  width={Browser.isDevice ? '100%' : '75%'}
                  height={'35%'}
                  chartArea={{ border: { width: 0 } }}
                  //load={load.bind(this)}
                  //title="Sales Comparison"
                  //loaded={onChartLoad.bind(this)}
                  tooltip={{
                     enable: true,
                     format:
                        '${point.x} : <b>${point.y} (${point.percentage}%)</b>',
                  }}
               >
                  <Inject
                     services={[
                        StackingBarSeries,
                        Legend,
                        Tooltip,
                        DataLabel,
                        Category,
                        Highlight,
                     ]}
                  />
                  <SeriesCollectionDirective>
                     <SeriesDirective
                        dataSource={dataStackedBar}
                        xName="x"
                        yName="y"
                        name="Apple"
                        fill="#48B757"
                        border={{ width: 1, color: 'white' }}
                        columnWidth={0.6}
                        type="StackingBar100"
                     />
                     <SeriesDirective
                        dataSource={dataStackedBar}
                        xName="x"
                        yName="y1"
                        name="Orange"
                        fill="#4871B7"
                        border={{ width: 1, color: 'white' }}
                        columnWidth={0.6}
                        type="StackingBar100"
                     />
                     <SeriesDirective
                        dataSource={dataStackedBar}
                        xName="x"
                        yName="y2"
                        name="Wastage"
                        fill="#B748A8"
                        border={{ width: 1, color: 'white' }}
                        columnWidth={0.6}
                        type="StackingBar100"
                     />
                     <SeriesDirective
                        dataSource={dataStackedBar}
                        xName="x"
                        yName="y3"
                        name="FriendlyName"
                        fill="#B78E48"
                        border={{ width: 1, color: 'white' }}
                        columnWidth={0.6}
                        type="StackingBar100"
                     />
                  </SeriesCollectionDirective>
               </ChartComponent>
            </div>
         </div>
      )
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
   //const barChartImageRef = useRef(null)
   const gridComponentRef = useRef(null)
   const exportHTMLImageToWord = async (element, filename = '') => {
      //const elementRef = element.current
      const myPercentBar = document.getElementById('myPercentBar')
      const canvas = await html2Canvas(myPercentBar) //.then(canvas => {

      const dataUrl = canvas.toDataURL()
      const img = new Image()
      img.src = dataUrl
      const imgHtml = img.outerHTML
      //document.body.appendChild(img)
      //barChartElement.appendChild(img)

      var preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
         <head>
         <meta charset='utf-8'>
         <title>Export HTML To Doc</title>
         <style> 
         #customers 
         {font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;} 
         #customers td, #customers th {border: 1px solid #ddd;  padding: 8px;} 
         #customers tr:nth-child(even){background-color:#f2f2f2;} 
         #customers th {  padding-top: 12px;  padding-bottom: 12px;  text-align: left;  background-color: #04AA6D;  color: white;} 
         .kuarxisProgressBackgroundBar { 
            position: relative; 
            width: 100%;
            height: 20px;
            border-radius: 200px;
            background-color: #ccc;
            overflow: hidden;
         } .kuarxisProgressBar {position: absolute;top: 0;left: 0;height: 100%;background-color: #06a00b;border-radius: 200px;left: 0;} .kuarxisProgressBarText {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);color: white;border-radius: 200px;}</style></head><body>`
      var postHtml = '</body></html>'
      //var html = preHtml + document.getElementById(element).innerHTML + postHtml
      var tableHtml = ''

      tableHtml =
         '<table id="customers"><tr ><th >Titulo</th><th >Datos/Resultado</th></tr>'
      const percentBarHTML = ReactDOMServer.renderToString(
         <KuarxisPercentBarComponent percent=".75" />,
      )

      //tableHtml = tableHtml + '<tr><td >R1V1</td ><td>' + imgHtml + '</td></tr>'
      tableHtml =
         tableHtml + '<tr><td >R1V1</td ><td>' + percentBarHTML + '</td></tr>'
      tableHtml = tableHtml + '</table>'

      var html = `${preHtml} ${tableHtml} ${postHtml}`

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
      //})
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
            {/* <div className="control-pane">
               <style>{SAMPLE_CSS}</style>
               <div className="control-section">
                  <ChartComponent
                     id="charts"
                     style={{ textAlign: 'center' }}
                     legendSettings={{ enableHighlight: true }}
                     primaryXAxis={{
                        valueType: 'Category',
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 },
                     }}
                     primaryYAxis={{
                        edgeLabelPlacement: 'Shift',
                        title: 'Sales (In Percentage)',
                        majorTickLines: { width: 0 },
                        lineStyle: { width: 0 },
                     }}
                     width={Browser.isDevice ? '100%' : '75%'}
                     chartArea={{ border: { width: 0 } }}
                     load={load.bind(this)}
                     title="Sales Comparison"
                     loaded={onChartLoad.bind(this)}
                     tooltip={{
                        enable: true,
                        format:
                           '${point.x} : <b>${point.y} (${point.percentage}%)</b>',
                     }}
                  >
                     <Inject
                        services={[
                           StackingBarSeries,
                           Legend,
                           Tooltip,
                           DataLabel,
                           Category,
                           Highlight,
                        ]}
                     />
                     <SeriesCollectionDirective>
                        <SeriesDirective
                           dataSource={dataStackedBar}
                           xName="x"
                           yName="y"
                           name="Apple"
                           fill="#48B757"
                           border={{ width: 1, color: 'white' }}
                           columnWidth={0.6}
                           type="StackingBar100"
                        />
                        <SeriesDirective
                           dataSource={dataStackedBar}
                           xName="x"
                           yName="y1"
                           name="Orange"
                           fill="#4871B7"
                           border={{ width: 1, color: 'white' }}
                           columnWidth={0.6}
                           type="StackingBar100"
                        />
                        <SeriesDirective
                           dataSource={dataStackedBar}
                           xName="x"
                           yName="y2"
                           name="Wastage"
                           fill="#B748A8"
                           border={{ width: 1, color: 'white' }}
                           columnWidth={0.6}
                           type="StackingBar100"
                        />
                        <SeriesDirective
                           dataSource={dataStackedBar}
                           xName="x"
                           yName="y3"
                           name="FriendlyName"
                           fill="#B78E48"
                           border={{ width: 1, color: 'white' }}
                           columnWidth={0.6}
                           type="StackingBar100"
                        />
                     </SeriesCollectionDirective>
                  </ChartComponent>
               </div>
            </div> */}
            {/* <div className="stackProgressContainer">
               <div className="stacked-progress">
                  <div
                     className="progress-bar progress-bar1"
                     style={{ width: '4%' }}
                  >
                     <span className="stackedProgrssBarText">10%</span>
                  </div>

                  <div
                     className="progress-bar progress-bar2"
                     style={{ width: '4%' }}
                  >
                     <span className="stackedProgrssBarText">40%</span>
                  </div>
                  <div
                     className="progress-bar progress-bar3"
                     style={{ width: '10%' }}
                  >
                     <span className="stackedProgrssBarText">10%</span>
                  </div>
                  <div
                     className="progress-bar progress-bar4"
                     style={{ width: '40%' }}
                  >
                     <span className="stackedProgrssBarText">40%</span>
                  </div>
               </div>
               <div className="label">
                  <span className="color-square color1"></span> Religion
                  <span className="color-square color2"></span> Politics
                  <span className="color-square color3"></span> Intelligence
                  <span className="color-square color4"></span> Mathematics
               </div>
            </div> */}
            <div style={{ width: '20%' }}>
               <div className="kuarxisSemaphoreContainer">
                  <span className="kuarxisRangeSemaphore"> </span>
               </div>
            </div>
            <div style={{ marginTop: '50px' }}>
               {renderKuarxisStacked100BarTemplate()}
            </div>
         </div>

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
            <GridComponent dataSource={data} width={1300}>
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
                  <ColumnDirective
                     field="percentage"
                     headerText="StackedBarPrototype"
                     width={400}
                     template={renderKuarxisStacked100BarTemplate}
                  />
                  <ColumnDirective
                     field="percentage"
                     headerText="Ranges Semaphore"
                     width={200}
                     template={renderKuarxisRangesSemaphore}
                  />
               </ColumnsDirective>
               <Inject services={[]} />
            </GridComponent>
         </div>
         <div id="myPercentBar" class="kuarxisProgressColumn">
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
