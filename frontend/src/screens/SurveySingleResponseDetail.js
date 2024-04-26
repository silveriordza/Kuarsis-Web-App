
import React, { useState, useEffect, useRef } from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Inject } from '@syncfusion/ej2-react-grids';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ProgressBarComponent } from "@syncfusion/ej2-react-progressbar";

import {
  Button,
} from 'react-bootstrap'

import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const multiDataSet = [
  {
      columns: [
          {title: "Name", width: {wch: 20}},//pixels width 
          {title: "Text Style", width: {wch: 20}},//char width 
          {title: "Colors", width: {wch: 20}},
      ],
      data: [
          [
              {value: 1},
              {value: "Bold"},
              {value: "Red"},
          ],
          [
              {value: 2598},
              {value: "underline"},
              {value: "Blue"},
          ],
          [
              {value: 3},
              {value: "italic"},
              {value: "Green"},
          ],
          [
            {value: 1295},
            {value: "italic"},
            {value: "Green"},
        ]
      ]
  }
];

const exportDataFile = (exportPreguntas) => {

  let colValues = []  
  multiDataSet[0].data = []
  if(exportPreguntas){
    multiDataSet[0].columns[0].title = "Preguntas"
    //multiDataSet[0].data[1][1].value = "Valor Pregunta 1"
    colValues = []
    colValues.push({value: 10000})
    colValues.push({value: "10001"})
    colValues.push({value: "SOME OTHER PREGUNTA VALUE"})
    multiDataSet[0].data.push(colValues)
  } else {
    multiDataSet[0].columns[0].title = "Campos"
    //multiDataSet[0].data[1][1].value = "Valor Campo 1"
    colValues = []
    colValues.push({value: 20000})
    colValues.push({value: "20001"})
    colValues.push({value: "SOME OTHER CAMPO VALUE"})
    multiDataSet[0].data.push(colValues)
  }
}





const SurveySingleResponseDetail = () => {

   const [multiDataState, setmultiDataState] = useState([{columns: [], data: []}])
   
   const [tipoExportacion, settipoExportacion] = useState(false)

   const [exportarTriggered, setexportarTriggered] = useState(false)
  const data = [
    { id: 1, name: 'John', percentage: 75 },
    { id: 2, name: 'Jane', percentage: 50 },
    { id: 3, name: 'Doe', percentage: 90 }
];
const exportDataFileTrigger = (exportPreguntas) => {

  let colValues = []  
  multiDataSet[0].data = []
  if(exportPreguntas){
    multiDataSet[0].columns[0].title = "Preguntas"
    //multiDataSet[0].data[1][1].value = "Valor Pregunta 1"
    colValues = []
    colValues.push({value: 10000})
    colValues.push({value: "10001"})
    colValues.push({value: "SOME OTHER PREGUNTA VALUE"})
    multiDataSet[0].data.push(colValues)
    
  } else {
    multiDataSet[0].columns[0].title = "Campos"
    //multiDataSet[0].data[1][1].value = "Valor Campo 1"
    colValues = []
    colValues.push({value: 20000})
    colValues.push({value: "20001"})
    colValues.push({value: "SOME OTHER CAMPO VALUE"})
    multiDataSet[0].data.push(colValues)
  }
  setexportarTriggered(true)
  settipoExportacion(exportPreguntas)
  setmultiDataState(multiDataSet)
}

  const renderProgressBarTemplate = (props) => {
    return (
        // <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
        //     <div style={{ width: `${props.percentage}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
        //     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>{props.percentage}%</div>
        // </div>
        <ProgressBar now={props.percentage} label={`${props.percentage}%`} variant="warning"/>
    );
}

const renderSyncProgressBarTemplate = (props) => {
  return (
      // <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
      //     <div style={{ width: `${props.percentage}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
      //     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>{props.percentage}%</div>
      // </div>
      <ProgressBarComponent id="linear" type='Linear' width='100' height='20' trackThickness={24} progressThickness={24} value={props.percentage} showProgressValue={true} style={{color: "white", fontWeight: "bold"}} progressColor="green" animation={{
        enable: false,
        duration: 2000,
        delay: 0
    }}>
     </ProgressBarComponent>
  );
}
const exportarPreguntasButton = useRef(null);
const exportarCamposButton = useRef(null);



useEffect(()=>{
  //const triggerButton = document.getElementById("exportar_preguntas")
  if(exportarTriggered){
    if(tipoExportacion){
  exportarPreguntasButton.current.click()
} else {
  exportarCamposButton.current.click()
}
  setexportarTriggered(false)
  }
}, [multiDataState, exportarTriggered])

  return (
    <section>
     <h1>Hola Survey Single Response Detail</h1>
    <div>
     <ExcelFile element={<Button 
     ref={exportarPreguntasButton}
                                 variant="light"
                                 size="sm"
                                 style={{display: 'none'}}
                                 // className="btn-mg"
                              //    onClick={() =>
                              //     exportDataFile(true)
                              //  }
                              >
                                 <i className="fas fa-save fa-2x"></i> Exportar
                                 Preguntas
                              </Button>}>
         <ExcelSheet dataSet={multiDataState} name="Organization"/>
            </ExcelFile>
            <ExcelFile element={<Button 
                                 ref={exportarCamposButton}
                                 variant="light"
                                 size="sm"
                                 style={{display: 'none'}}
                                 // className="btn-mg"
                              //    onClick={() =>
                              //     exportDataFile(false)
                              //  }
                              >
                                 <i className="fas fa-save fa-2x"></i> Exportar
                                 Campos
                              </Button>}>
         <ExcelSheet dataSet={multiDataState} name="Organization"/>
            </ExcelFile>
            <Button 
            
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                  exportDataFileTrigger(true)
                               }
                              >
                                 <i className="fas fa-save fa-2x"></i> Bajar Preguntas Excel
                              </Button>

                              <Button 
            
                                 variant="light"
                                 size="sm"
                                 // className="btn-mg"
                                 onClick={() =>
                                  exportDataFileTrigger(false)
                               }
                              >
                                 <i className="fas fa-save fa-2x"></i> Bajar Campos Excel 
                              </Button>
            </div>
     
            <GridComponent dataSource={data}>
                <ColumnsDirective>
                    <ColumnDirective field='id' headerText='ID' width='10' />
                    <ColumnDirective field='name' headerText='Name'  width='10'/>
                    <ColumnDirective field='percentage' headerText='Percentage' width="10" template={renderProgressBarTemplate} />
                    <ColumnDirective field='percentage' headerText='Percentage' width="10" template={renderSyncProgressBarTemplate} />
                    <ColumnDirective field='percentage' headerText='Percentage' width="100" />
                </ColumnsDirective>
                <Inject services={[]} />
            </GridComponent>
            </section>
  )
}

export default SurveySingleResponseDetail
