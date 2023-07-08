//With the link you can redirect the page to a new page without refreshing the whole page but only the section where you want the page to appear. If you don't use Link and use a regular <a> tag, when the user clicks on it, it will refresh the whole page to show the page on the link, which is not user friendly.
//import { Link } from 'react-router-dom'
//import { KUARSIS_PUBLIC_BUCKET_URL } from '../constants/enviromentConstants'
import {Inject, ScheduleComponent, Day, DragAndDrop, Resize, ViewsDirective, ViewDirective} from '@syncfusion/ej2-react-schedule';
import {LogThis, initLogSettings} from '../libs/Logger'

import React, { useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader' 
import { getScheduleDetails, updateScheduleDetails} from '../actions/schedulerActions'
//import {SCHEDULE_DETAILS_SUCCESS} from '../constants/schedulerConstants'

const logSettings=initLogSettings('Scheduler')

const Scheduler = ({providerId}) => {

  logSettings.functionName = 'Scheduler'
  LogThis(logSettings, `Entering to the Scheduler: providerId=${providerId}`)

  const dispatch = useDispatch() 
  
  const schedulerDetails = useSelector((state) => state.schedulerDetails)
  const { loading, error, schedule } = schedulerDetails

  //const isInitialLoad = useRef(true)

  //const onDragStart = (dragEventArgs) => {
      /*if(dragEventArgs){ 
      ////Enable enables the drag and drop.
      dragEventArgs.enable = false
      ////The scroll by controls the speed of how quicly the scroll moves.
      dragEventArgs.scrollBy = 500
      ////Interval is when dragging, the appointment will jump from interval to interval, if the interval is 60 then if user drags it will move the appointment back or forward by 60 min. 
      dragEventArgs.interval = 60
      ////Navitaion allows user to drag and drop appointments outside of the current date range selection and the calenar will auto move to the previous or next date range.
      dragEventArgs.navigation.enable = true
      ////Exclude Selectors will block the appointment from being drop into the excluded areas.
      //ragEventArgs.excludeSelectors = 'e-all-day-cells,e-work-cells'
      }*/
    //}
   
  //const onResizeStart = (resizeEventArgs) => {
    //Enable enables the resize.
    /*if(resizeEventArgs){
      console.log(1)
    resizeEventArgs.enable = false
    console.log(resizeEventArgs)
    resizeEventArgs.scrollBy = 500
    console.log(2)
    resizeEventArgs.interval = 60
    console.log(3)
    ////Navigation property is not available in the ResizeEventArgs type. 
    //resizeEventArgs.navigation.enable = true
    console.log(4)
    } */ 
  //}
        
  //const ondataBound = (args) => {  
  /*
    logSettings.sourceFunction = 'onAppointmentListModified'
    LogThis(logSettings, `Entering onAppointmentListModified`)  

    let scheduler = document.getElementById('scheduler').ej2_instances[0] 
    let appointments = scheduler.getEvents()   

    LogThis(logSettings, `Appointments: ${JSON.stringify(appointments)}`)
    LogThis(logSettings, `1`) 

    const newSchedule = schedule
    //LogThis(logSettings, `2 newSchedule=${newSchedule}`)
    newSchedule.scheduleData=appointments
    //LogThis(logSettings, `3 newSchedule=${newSchedule}`)
    LogThis(logSettings, `3 Dispatching updateScheduleDetails: newSchedule=${JSON.stringify(newSchedule)}`)
    LogThis(logSettings, `4`) 
    if(!isInitialLoad.current){
      LogThis(logSettings, `InitLoad is not: !isInitialLoad.current=${!isInitialLoad.current}`)
      !loading? dispatch(updateScheduleDetails(newSchedule)):LogThis(logSettings, 'update already loading') 
      isInitialLoad.current=true
    } else {
      LogThis(logSettings, `InitLoad is yes: !isInitialLoad.current=${!isInitialLoad.current}`)
      isInitialLoad.current=false
    }
    LogThis(logSettings, `5`)
    LogThis(logSettings, `Dispatched updateScheduleDetails: newSchedule=${JSON.stringify(newSchedule)}`)
    LogThis(logSettings, `6`)
    */
   //} 

   const onActionBegin = (args) => { 
    logSettings.sourceFunction='onActionBegin'
    if (args.requestType === 'toolbarItemRendering') {
    // This block is execute before toolbarItem render
    }
    if (args.requestType === 'dateNavigate') {
    // This block is executed before previous and next navigation
    }
    if (args.requestType === 'viewNavigate') {
    // This block is execute before view navigation
    }
    if (args.requestType === 'eventCreate') {
    // This block is execute before an appointment create
     LogThis(logSettings, `eventCreate: Entering, args=${JSON.stringify(args)}`)
    //if(args.changedRecords.length > 0) {
      let scheduler = document.getElementById('scheduler').ej2_instances[0]
      let appointments = scheduler.getEvents()
      //let newSchedule = [...scheduler]
      LogThis(logSettings, `eventChange: appointments=${JSON.stringify(appointments)}`)
      const isAppointmentOveralapped = IsSlotAvailable(args.addedRecords[0], appointments)
      if(isAppointmentOveralapped){
        alert('Appointments overlapped')
        args.cancel = isAppointmentOveralapped
        }
    }
    if (args.requestType === 'eventChange') {
    // This block is execute before an appointment change
     // This block is execute before an appointment create
     LogThis(logSettings, `eventChange: Entering, args=${JSON.stringify(args)}`)
     //if(args.changedRecords.length > 0) {
       let scheduler = document.getElementById('scheduler').ej2_instances[0]
       let appointments = scheduler.getEvents()
       //let newSchedule = [...scheduler]
       LogThis(logSettings, `eventChange: appointments=${JSON.stringify(appointments)}`)
       const isAppointmentOveralapped = IsSlotAvailable(args.changedRecords[0], appointments)
       if(isAppointmentOveralapped){
       alert('Appointments overlapped')
       args.cancel = isAppointmentOveralapped
       }
     //}
    }
    if (args.requestType === 'eventRemove') {
    // This block is execute before an appointment remove
    }
} 

const IsSlotAvailable = (newEvent, eventList) => {
  logSettings.sourceFunction = 'IsSlotAvailable'
  let isOverlapped = 0
  let newEventList = eventList.filter(e => e.Guid!=newEvent.Guid)
  newEventList.some(eventScheduled => {
    if (   (newEvent.StartTime >= eventScheduled.StartTime && newEvent.StartTime < eventScheduled.EndTime)
        || (newEvent.EndTime > eventScheduled.StartTime && newEvent.EndTime <= eventScheduled.EndTime)
        || ( newEvent.StartTime===eventScheduled.StartTime && newEvent.EndTime === eventScheduled.EndTime)
        ) {
          LogThis(logSettings, `overlap identified`)
          isOverlapped=true
          return true;
        }
  })

  if(isOverlapped)
  { 
    LogThis(logSettings, `event is overlapped: true`)
    return true;
  }
  LogThis(logSettings, `event is overlapped: false`)
  return false;  
}

   const onActionComplete = (args) => { 
     
    logSettings.sourceFunction='onActionComplete'
    LogThis(logSettings, ` args.requestType = ${JSON.stringify(args.requestType)}; args.data = ${JSON.stringify(args.data)}`)

    if (args.requestType === 'eventCreated' /*|| args.requestType === 'eventChanged' || args.requestType === 'eventRemoved'*/) {
        // This block is execute after an appointment create
        LogThis(logSettings, `eventCreated: Entering`)
        let scheduler = document.getElementById('scheduler').ej2_instances[0]
        let appointments = scheduler.getEvents()
        let blockedTimes = scheduler.getBlockEvents()
        const wholeSchedule = appointments.concat(blockedTimes).concat(args.data)

         
        LogThis(logSettings, `eventCreated wholeSchedule=${JSON.stringify(wholeSchedule)}`)
        //setcalendarSchedule({dataSource: wholeSchedule})
        const newSchedule = schedule
        //LogThis(logSettings, `2 newSchedule=${newSchedule}`) 
        newSchedule.scheduleData=wholeSchedule
        dispatch(updateScheduleDetails(newSchedule))
    }  
    if (args.requestType === 'eventChanged') { 
        // This block is execute after an appointment change
        LogThis(logSettings, `eventChanged: Entering`)
        let scheduler = document.getElementById('scheduler').ej2_instances[0]
        let appointments = scheduler.getEvents()
        let blockedTimes = scheduler.getBlockEvents()
        LogThis(logSettings, `eventChanged: Before updating Appointments index: appointments=${JSON.stringify(appointments)} args.data=${JSON.stringify(args.data)}`)
   
        const newAppointments = appointments.filter(appt => (args.data.find( dt => appt.Guid===dt.Guid)?false:true))
        
        LogThis(logSettings, `eventChanged: After updating Appointments: newAppointments=${JSON.stringify(newAppointments)}`)
 
        const wholeSchedule = newAppointments.concat(args.data).concat(blockedTimes)
        
        LogThis(logSettings, `eventChanged wholeSchedue=${JSON.stringify(wholeSchedule)}`)
        //setcalendarSchedule({dataSource: wholeSchedule})
        const newSchedule = schedule
        //LogThis(logSettings, `2 newSchedule=${newSchedule}`)
        newSchedule.scheduleData=wholeSchedule
        dispatch(updateScheduleDetails(newSchedule))
    } 
    if(args.requestType === 'eventRemoved') {  
        // This block is execute after an appointment remove
        // This block is execute after an appointment change
        let scheduler = document.getElementById('scheduler').ej2_instances[0]
        let appointments = scheduler.getEvents()
        let blockedTimes = scheduler.getBlockEvents()
        LogThis(logSettings, `eventRemoved: Before filtering Appointments: appointments=${JSON.stringify(appointments)} args.data=${JSON.stringify(args.data)}`)
        
        const newAppointments = appointments.filter(appt => (args.data.find( dt => appt.Guid===dt.Guid)?false:true))

        LogThis(logSettings, `eventRemoved: After filtering Appointments: appointments=${JSON.stringify(newAppointments)}`)

        const wholeSchedule = newAppointments.concat(blockedTimes)
        LogThis(logSettings, `eventRemoved: After contatenating Appointments: wholeSchedule=${JSON.stringify(wholeSchedule)}`)

       //setcalendarSchedule({dataSource: wholeSchedule})
       const newSchedule = schedule

       LogThis(logSettings, `eventRemoved: After updating newSchedule with schedule: newSchedule=${JSON.stringify(newSchedule)}`)
       //LogThis(logSettings, `2 newSchedule=${newSchedule}`)
       newSchedule[0].scheduleData = wholeSchedule
       LogThis(logSettings, `eventRemoved: After updating newSchedule with updated events: newSchedule=${JSON.stringify(newSchedule)}`)
       //console.dir('NEW-SCHEDULE', JSON.stringify(newSchedule))
       dispatch(updateScheduleDetails(newSchedule))
    }
    LogThis(logSettings, `eventCreated event Ended`)
  }

  useEffect(() => { 
    if(providerId){
    dispatch(getScheduleDetails(providerId))
    } 
// eslint-disable-next-line 
  }, [providerId])

  useEffect(() => {  
    logSettings.sourceFunction='useEffect checking schedule'
    LogThis(logSettings, `loading=${JSON.stringify(loading)}; schedule=${JSON.stringify(schedule)}; error=${JSON.stringify(error)};`)
// eslint-disable-next-line  
  }, [loading, schedule, error])
     
   
    return ( 
        <div className='schedulerClass'>  
        {console.log(`Scheduler, Rendering before loadingcheck: loading=${JSON.stringify(loading)}; schedule=${JSON.stringify(schedule)}`)}
        {loading&&(!schedule??true) ? ( 
        <>
        {console.log(`Scheduler, Rendering Loading: loading=${JSON.stringify(loading)}; schedule=${JSON.stringify(schedule)}`)}
        <Loader />
        </>  
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (  
        <>
            {console.log(`Scheduler, Rendering Start: loading=${JSON.stringify(loading)}; schedule.scheduleData=${JSON.stringify(schedule[0].scheduleData)} `)}
            <ScheduleComponent id='scheduler' currentView='Day' eventSettings={{eventOverlap: false, dataSource:schedule[0].scheduleData}}  actionBegin={onActionBegin} actionComplete={onActionComplete} > 
            <ViewsDirective>
              <ViewDirective option='Day' interval={7} displayName='7 Days' startHour='08:00' endHour='20:00'></ViewDirective>
            </ViewsDirective>
            <Inject services={[Day, DragAndDrop, Resize]} />
          </ScheduleComponent> 
        </>)  
      } 
      {/* {logSettings.sourceFunction='Render: before isInitialLoad.current checks'}
      {LogThis(logSettings, `1 changing isInitialLoad.current=${isInitialLoad.current}`)}
      {isInitialLoad.current=false}
      {LogThis(logSettings, `2 changing isInitialLoad.current=${isInitialLoad.current}`)} */}
    </div>
  )
} 
 
export default Scheduler
