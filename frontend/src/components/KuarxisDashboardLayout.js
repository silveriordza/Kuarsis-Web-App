/** @format */

import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'

//import { outputData } from '../constants/surveyOutputsDataStatic'

import {
   DashboardLayoutComponent,
   PanelDirective,
   PanelsDirective,
} from '@syncfusion/ej2-react-layouts'
import {
   ColumnDirective,
   ColumnsDirective,
   GridComponent,
} from '@syncfusion/ej2-react-grids'
import {
   AccumulationChartComponent,
   AccumulationSeriesCollectionDirective,
   AccumulationSeriesDirective,
   AccumulationLegend,
   PieSeries,
   AccumulationDataLabel,
   AccumulationTooltip,
   ChartComponent,
   DateTimeCategory,
   SeriesCollectionDirective,
   SeriesDirective,
   SplineAreaSeries,
   Inject,
} from '@syncfusion/ej2-react-charts'

const KuarxisDashboardLayout = data => {
   //START PROTOTYPING DATA FOR REACT DASHBOARD LAYOUT SAMPLE

   let incomeExpenseData = [
      { period: new Date('2017-01-01'), income: 7490, expense: 6973 },
      { period: new Date('2021-02-01'), income: 6840, expense: 6060 },
      { period: new Date('2021-03-01'), income: 6060, expense: 5500 },
      { period: new Date('2012-04-01'), income: 8190, expense: 7059 },
      { period: new Date('2021-05-01'), income: 7320, expense: 6333 },
      { period: new Date('2021-06-01'), income: 7380, expense: 6135 },
   ]
   let PieRenderingDataAll = [
      { x: 'Mortgage / Rent', text: '15.76%', y: 6000 },
      { x: 'Mortgage / Rent', text: '15.76%', y: 6000 },
      { x: 'Mortgage / Rent', text: '15.76%', y: 6000 },
      { x: 'Mortgage / Rent', text: '15.76%', y: 6000 },
      { x: 'Food', text: '12.79%', y: 4866 },
      { x: 'Utilities', text: '10.93%', y: 4160 },
      { x: 'Bills', text: '10.4%', y: 3960 },
      { x: 'Shopping', text: '8.87%', y: 3375 },
      { x: 'Transportation', text: '8.49%', y: 3230 },
      { x: 'Insurance', text: '7.59%', y: 2890 },
      { x: 'Health Care', text: '6.52%', y: 2480 },
      { x: 'Clothing', text: '5.92%', y: 2255 },
      { x: 'Others', text: '12.73%', y: 4844 },
   ]
   const [dataSource, setdataSource] = useState()

   const [dashboardData, setdashBoardData] = useState()

   const [dataSourceFiltered, setdataSourceFiltered] = useState()

   const kuarxisPieData = [
      {
         'FIAD-15 RESULTADO': 'Nivel Alto',
         BECK_ES_CASO_DEPRESION: 'Sin Depresion',
      },
      {
         'FIAD-15 RESULTADO': 'Nivel Funcional',
         BECK_ES_CASO_DEPRESION: 'Depresion Ligera',
      },
      {
         'FIAD-15 RESULTADO': 'Nivel Intermedio',
         BECK_ES_CASO_DEPRESION: 'Depresion Moderada',
      },
      {
         'FIAD-15 RESULTADO': 'Nivel Limitrofe',
         BECK_ES_CASO_DEPRESION: 'Depresion Severa',
      },
      {
         'FIAD-15 RESULTADO': 'Nivel Limitrofe',
         BECK_ES_CASO_DEPRESION: 'Depresion Muy Severa',
      },
   ]

   const pieDefinitions = [
      {
         surveyShortName: 'FIAD_15',
         seriesField: 'FIAD-15 RESULTADO',
         calculationType: 'countSeries',
         seriesStyles: {
            'Nivel Funcional': '#0cc50c',
            'Nivel Alto': '#008000',
            'Nivel Intermedio': '#ffa500',
            'Nivel Limitrofe': '#ff0000',
         },
      },
      {
         surveyShortName: 'BECK',
         seriesField: 'BECK_ES_CASO_DEPRESION',
         calculationType: 'countSeries',
         seriesStyles: {
            'Sin Depresión': '#0cc50c',
            'Depresión Ligera': '#008000',
            'Depresión Moderada': '#ffa500',
            'Depresión Severa - requiere ayuda': '#ff0000',
            'Depresión Muy Severa - requiere ayuda': '#ff0000',
         },
      },
      {
         surveyShortName: 'HAMILTON',
         seriesField: 'HAMILTON_ANSIEDAD_RESULTADO',
         calculationType: 'countSeries',
         seriesStyles: {
            'Sin Ansiedad': '#0cc50c',
            'Ansiedad Leve': '#008000',
            'Ansiedad Moderada': '#ffa500',
            'Ansiedad Severa': '#ff0000',
         },
      },
   ]

   // Function to aggregate data
   const aggregateData = dataSourceInput => {
      const pieAggregatedData = new Map()
      let pieFinalAggregatedValues = {}
      let pieAggregatedDataArray = null
      //const pieAggregatedData = new Map()
      for (const pieDefinition of pieDefinitions) {
         for (const pieData of dataSourceInput) {
            let seriesValue = pieData[pieDefinition.seriesField]

            switch (pieDefinition.calculationType) {
               case 'countSeries':
                  if (pieFinalAggregatedValues[seriesValue]) {
                     pieFinalAggregatedValues[seriesValue] += 1
                  } else {
                     pieFinalAggregatedValues[seriesValue] = 1
                  }
            }
         }
         pieAggregatedDataArray = Object.keys(pieFinalAggregatedValues).map(
            key => ({
               xNameSeries: key,
               xNameSeriesColor: pieDefinition.seriesStyles[key],
               yNameValues: pieFinalAggregatedValues[key],
            }),
         )

         pieAggregatedData.set(
            pieDefinition.surveyShortName,
            pieAggregatedDataArray,
         )
         pieFinalAggregatedValues = {}
      }

      setdashBoardData(pieAggregatedData)
   }
   const legendSettings = {
      visible: false,
   }
   function kuarxisPayChart(surveyShortName) {
      return (
         // <div
         // // style={{
         // //    width: '100%',
         // //    height: '100%',
         // //    position: 'relative',
         // //    top: '0',
         // //    left: '0',
         // // }}
         // >
         <AccumulationChartComponent
            id={`${surveyShortName}_kuarxisPieChart`}
            pointClick={args => pointClickFilter(args, surveyShortName)}
            legendSettings={legendSettings}
            enableSmartLabels={true}
            tooltip={{ enable: true, duration: 500 }}
            width="100%"
            height="100%"
         >
            <Inject
               services={[
                  //AccumulationLegend,
                  PieSeries,
                  AccumulationTooltip,
                  AccumulationDataLabel,
               ]}
            />
            <AccumulationSeriesCollectionDirective>
               <AccumulationSeriesDirective
                  dataSource={dashboardData.get(surveyShortName)}
                  //xName="text"
                  xName="xNameSeries"
                  yName="yNameValues"
                  radius="80%"
                  pointColorMapping="xNameSeriesColor"
                  // center={{ x: '50%', y: '30%' }}
                  explode={true}
                  explodeOffset="10%"
                  //explodeIndex={0}
                  explodeAll={true}
                  startAngle={0}
                  endAngle={360}
                  innerRadius="0%"
                  legendShape="Rectangle"
                  dataLabel={{
                     visible: false,
                     name: 'x',
                     position: 'Outside',
                     font: {
                        size: '10px',
                     },
                  }}
               ></AccumulationSeriesDirective>
            </AccumulationSeriesCollectionDirective>
         </AccumulationChartComponent>
         // </div>
      )
   }

   useEffect(() => {
      setdataSource(data.data.outputValues)
      setdataSourceFiltered(data.data.outputValues)
      aggregateData(data.data.outputValues)
   }, [])

   //const [outputData, setOutputData] = useState(outputData)

   let transactionData = [
      {
         category: 'Food',
         amount: 6,
         paymentMode: 'Debit Card',
         iconCss: 'food',
         isExpense: true,
         isIncome: false,
         transactoinId: '#131614678',
         description: 'Palmetto Cheese, Mint julep',
      },
      {
         category: 'Transportation',
         amount: 7,
         paymentMode: 'Debit Card',
         iconCss: 'travel',
         isExpense: true,
         isIncome: false,
         transactoinId: '#131416876',
         description: 'Other vehicle expenses',
      },
      {
         category: 'Housing',
         amount: 20,
         paymentMode: 'Credit Card',
         iconCss: 'housing',
         isExpense: true,
         isIncome: false,
         transactoinId: '#1711148579',
         description: 'Laundry and cleaning supplies',
      },
      {
         category: 'Extra Income',
         amount: 110,
         paymentMode: 'Cash',
         iconCss: 'extra-income',
         isExpense: false,
         isIncome: true,
         transactoinId: '#1922419785',
         description: 'Income from Sale',
      },
      {
         category: 'Food',
         amount: 10,
         paymentMode: 'Credit Card',
         iconCss: 'food',
         isExpense: true,
         isIncome: false,
         transactoinId: '#2744145880',
         description: 'Muffuletta sandwich, Mint julep',
      },
   ]

   const card1 = () => {
      return (
         <table>
            <tr>
               <td>
                  <p className="income-container">$43,300</p>
               </td>
               <td>
                  {/* <img src="../income.jpg" style={{ marginLeft: '138px' }} /> */}
               </td>
            </tr>
         </table>
      )
   }
   function card2() {
      return (
         <table>
            <tr>
               <td>
                  <p className="expense-container">$38,060</p>
               </td>
               <td>
                  {/* <img src="../expense.jpg" style={{ marginLeft: '135px' }} /> */}
               </td>
            </tr>
         </table>
      )
   }
   function card3() {
      return (
         <table>
            <tr>
               <td>
                  <p className="balance-container">$38,060</p>
               </td>
               <td>
                  {/* <img
                     src="../balance.png"
                     style={{ marginLeft: '125px', marginBottom: '15px' }}
                  /> */}
               </td>
            </tr>
         </table>
      )
   }
   function card4() {
      return (
         <table>
            <tr>
               <td>
                  <p className="transaction-container">$38,060</p>
               </td>
               <td>
                  {/* <img
                     src="../trans.jpg"
                     style={{ marginLeft: '118px', marginBottom: '15px' }}
                  /> */}
               </td>
            </tr>
         </table>
      )
   }
   function colChart() {
      return (
         <ChartComponent
            primaryXAxis={{
               valueType: 'DateTimeCategory',
               intervalType: 'Months',
               labelFormat: 'MMM',
            }}
            primaryYAxis={{ minimum: 1000, maximum: 9000, interval: 2000 }}
         >
            <Inject services={[SplineAreaSeries, DateTimeCategory]} />
            <SeriesCollectionDirective>
               <SeriesDirective
                  dataSource={incomeExpenseData}
                  name="income"
                  xName="period"
                  yName="income"
                  type="SplineArea"
                  fill="#00BCD7"
               />
               <SeriesDirective
                  dataSource={incomeExpenseData}
                  name="expense"
                  xName="period"
                  yName="expense"
                  type="SplineArea"
                  fill="#CDDE1F"
               />
            </SeriesCollectionDirective>
         </ChartComponent>
      )
   }
   const pointClick = args => {
      // document.getElementById('lbl').innerText =
      //    'X : ' + args.point.x + '\nY : ' + args.point.y
      //const fieldFilter = pieDefinitions.find(pie => pie.surveyShortName === surveyShortName)
      const dataSourceFilteredLocal = dataSource.filter(
         d => d.x === args.point.text,
      )
      setdataSourceFiltered(dataSourceFilteredLocal)

      aggregateData(dataSourceFilteredLocal)
   }

   const pointClickFilter = (args, surveyShortName) => {
      // document.getElementById('lbl').innerText =
      //    'X : ' + args.point.x + '\nY : ' + args.point.y
      const pie = pieDefinitions.find(
         pie => pie.surveyShortName === surveyShortName,
      )

      if (!pie) {
         throw Error(`Pie Definition not found while filtering pointClick`)
      }
      const dataSourceFilteredLocal = dataSourceFiltered.filter(
         d => d[pie.seriesField] === args.point.x,
      )
      setdataSourceFiltered(dataSourceFilteredLocal)

      aggregateData(dataSourceFilteredLocal)
   }
   function pieChart() {
      // let localOutputData = outputData
      return (
         <div>
            <label id="lbl"></label>
            <AccumulationChartComponent id="pieChart" pointClick={pointClick}>
               <Inject
                  services={[
                     AccumulationLegend,
                     PieSeries,
                     AccumulationTooltip,
                     AccumulationDataLabel,
                  ]}
               />
               <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective
                     dataSource={dataSourceFiltered}
                     xName="text"
                     yName="y"
                     radius="50%"
                     startAngle={0}
                     endAngle={360}
                     innerRadius="0%"
                     dataLabel={{
                        visible: true,
                        name: 'x',
                        position: 'Outside',
                        font: {
                           size: '12px',
                        },
                     }}
                  ></AccumulationSeriesDirective>
               </AccumulationSeriesCollectionDirective>
            </AccumulationChartComponent>
         </div>
      )
   }

   function pieChart2() {
      return (
         <div>
            <label id="lbl2"></label>
            <AccumulationChartComponent id="pieChart2" pointClick={pointClick}>
               <Inject
                  services={[
                     AccumulationLegend,
                     PieSeries,
                     AccumulationTooltip,
                     AccumulationDataLabel,
                  ]}
               />
               <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective
                     dataSource={dataSourceFiltered}
                     xName="text"
                     yName="y"
                     radius="83%"
                     startAngle={0}
                     endAngle={360}
                     innerRadius="50%"
                     dataLabel={{
                        visible: true,
                        name: 'x',
                        position: 'Outside',
                     }}
                  ></AccumulationSeriesDirective>
               </AccumulationSeriesCollectionDirective>
            </AccumulationChartComponent>
         </div>
      )
   }
   function categoryTemplate(props) {
      var src = '../' + props.iconCss + '.png'
      var category = props.category
      return (
         <div className="image">
            <img className="category-icon" src={src} />
            <div className="category-text">{category}</div>
         </div>
      )
   }
   function amountTemplate(props) {
      var amount = props.amount
      return (
         <div className="image">
            <span>$</span>
            <span>{amount}</span>
         </div>
      )
   }
   function colGrid() {
      return (
         <GridComponent dataSource={transactionData}>
            <ColumnsDirective>
               <ColumnDirective
                  field="transactoinId"
                  headerText="Transaction ID"
                  width={120}
                  textAlign="Center"
               />
               <ColumnDirective
                  field="category"
                  headerText="Category"
                  width={120}
                  template={categoryTemplate}
               ></ColumnDirective>
               <ColumnDirective
                  field="paymentMode"
                  headerText="PaymentMode"
                  width={160}
                  textAlign="Center"
               />
               <ColumnDirective
                  field="description"
                  headerText="Description"
                  width={160}
                  textAlign="Center"
               />
               <ColumnDirective
                  field="amount"
                  headerText="Amount"
                  width={160}
                  textAlign="Center"
                  template={amountTemplate}
               ></ColumnDirective>
            </ColumnsDirective>
         </GridComponent>
      )
   }

   //END PROTOTYPING DATA FOR REACT DASHBOARD LAYOUT SAMPLE
   const resetFilters = () => {
      setdataSourceFiltered(dataSource)
      aggregateData(dataSource)
   }

   return (
      <div>
         <div>
            <Button variant="light" size="sm" onClick={resetFilters}>
               <i class="fas fa-undo-alt fa-2x"></i> Reiniciar Filtros
            </Button>
         </div>
         {dashboardData && dataSource && (
            <DashboardLayoutComponent
               columns={8}
               cellSpacing={[10, 10]}
               allowFloating={true}
               //mediaQuery="max-width:700px"
               //cellAspectRatio={1}
            >
               <PanelsDirective>
                  <PanelDirective
                     header="<div>FIAD_15</div>"
                     //content={colChart}
                     content={() => kuarxisPayChart('FIAD_15')}
                     //content="<div>Fiad-15 Content</div>"
                     col={0}
                     row={0}
                     sizeX={2}
                     sizeY={2}
                  ></PanelDirective>
                  <PanelDirective
                     header="<div>Beck Depresion</div>"
                     content={() => kuarxisPayChart('BECK')}
                     //content="<div>BECK Content</div>"
                     col={2}
                     row={0}
                     sizeX={2}
                     sizeY={2}
                  ></PanelDirective>
                  <PanelDirective
                     header="<div>Hamilton Ansiedad</div>"
                     content={() => kuarxisPayChart('HAMILTON')}
                     //content="<div>BECK Content</div>"
                     col={4}
                     row={0}
                     sizeX={2}
                     sizeY={2}
                  ></PanelDirective>
                  {/* <PanelDirective
                  header="<div>Recent Transactions</div>"
                  content={colGrid}
                  col={0}
                  row={4}
                  sizeX={8}
                  sizeY={3}
               ></PanelDirective> */}
                  {/* <PanelDirective
                  header="<div>Income</div>"
                  //content="<div>Hola</div>"
                  content={card1}
                  // cssClass="e-custom"
                  col={0}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective> */}
                  {/* <PanelDirective
                  header="<div>Expense</div>"
                  //content="<div> content panel 2</div>"
                  // cssClass="e-custom"
                  content={card2}
                  col={2}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Balance</div>"
                  //content="<div> content panel 3</div>"
                  content={card3}
                  // cssClass="e-custom"
                  col={4}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Transactions</div>"
                  //content="<div> content panel 4</div>"
                  content={card4}
                  // cssClass="e-custom"
                  col={6}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Panel 5</div>"
                  content="<div> content panel 5</div>"
                  // cssClass="e-custom"
                  col={0}
                  row={1}
                  sizeX={4}
                  sizeY={3}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Panel 6</div>"
                  content="<div> content panel 6</div>"
                  // cssClass="e-custom"
                  col={4}
                  row={1}
                  sizeX={4}
                  sizeY={3}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Panel 7</div>"
                  content="<div>content panel 7</div>"
                  // cssClass="e-custom"
                  col={0}
                  row={4}
                  sizeX={8}
                  sizeY={3}
               ></PanelDirective> */}

                  {/* <PanelDirective
                  header="<div>Expenses</div>"
                  content={card2}
                  col={2}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Balance</div>"
                  content={card3}
                  col={4}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective>
               <PanelDirective
                  header="<div>Transactions</div>"
                  content={card4}
                  col={6}
                  row={0}
                  sizeX={2}
                  sizeY={1}
               ></PanelDirective> */}
               </PanelsDirective>
            </DashboardLayoutComponent>
         )}
      </div>
   )
}

export default KuarxisDashboardLayout
