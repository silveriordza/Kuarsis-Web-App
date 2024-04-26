import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Inject } from '@syncfusion/ej2-react-grids';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ProgressBarComponent } from "@syncfusion/ej2-react-progressbar";


const SurveySingleResponseDetail = () => {

  const data = [
    { id: 1, name: 'John', percentage: 75 },
    { id: 2, name: 'Jane', percentage: 50 },
    { id: 3, name: 'Doe', percentage: 90 }
];

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

  return (
    <section>
     <h1>Hola Survey Single Response Detail</h1>
     
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
