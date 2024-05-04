/** @format */

import html2Canvas from 'html2canvas'
import React, { useState, useEffect, useRef } from 'react'
import {
   GridComponent,
   ColumnsDirective,
   ColumnDirective,
   Inject,
} from '@syncfusion/ej2-react-grids'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { ProgressBarComponent } from '@syncfusion/ej2-react-progressbar'

import KuarxisPercentBarComponent from '../components/KuarxisPercentBar/KuarxisPercentBarComponent'

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

const SurveySingleResponseDetail = () => {
   const [excelExportMultiDataState, setexcelExportMultiDataState] = useState([
      { columns: [], data: [] },
   ])

   const [exportFields, setexportFields] = useState(false)

   const [excelExportarTriggered, setexcelExportarTriggered] = useState(false)
   const data = [
      { id: 1, name: 'John', percentage: 75 },
      { id: 2, name: 'Jane', percentage: 10 },
      { id: 3, name: 'Doe', percentage: 90 },
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
            <GridComponent dataSource={data} width={500}>
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
                  />
               </ColumnsDirective>
               <Inject services={[]} />
            </GridComponent>
         </div>
         <div class="kuarxisProgressColumn">
            {/* <div class="progress2-bar">
               <div class="background2-bar"></div>
               <div class="progress2" style={{ width: '5%' }}></div>
               <div class="progress2-text">5%</div>
            </div> */}
            <KuarxisPercentBarComponent percent={90} />
         </div>
      </section>
   )
}

export default SurveySingleResponseDetail
