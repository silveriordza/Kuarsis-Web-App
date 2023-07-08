let asyncHandler = require('express-async-handler')
let {Schedule, ProviderBlockedSchedule} = require('../models/scheduleModel.js')
//let ProviderBlockedSchedule = require('../models/providerBlockedScheduleModel.js')
let {LogThis, initLogSettings} = require('../utils/Logger.js')

const logSettings = initLogSettings('schedulerController', '')

const updateScheduleByProviderId = asyncHandler(async (req, res) => {
  try{
        logSettings.sourceFunction='updateScheduleByProviderId'
        //const schedule = req.body.schedule
        LogThis(logSettings, `req.body=${JSON.stringify(req.body)}`)
        const {scheduleRequestUpdate} = req.body 

        const updatedSchedule = {
          schedule, product
        } = scheduleRequestUpdate

        LogThis(logSettings, `Entering: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
        let originalSchedule = await Schedule.find({providerId: updatedSchedule.schedule.providerId})
        LogThis(logSettings, `Entering: originalSchedule=${JSON.stringify(originalSchedule)}`)
        
        if (originalSchedule&&originalSchedule.length>0) {
          LogThis(logSettings, `originalSchedule has data`)
          originalSchedule[0].scheduleData = updatedSchedule.schedule.scheduleData

          LogThis(logSettings, `After updating schedule data: originalSchedule=${JSON.stringify(originalSchedule)}`)
          originalSchedule = await originalSchedule[0].save()
          
          LogThis(logSettings, `After updating database: originalSchedule=${JSON.stringify(originalSchedule)}`)
          updatedSchedule.schedule.scheduleData=originalSchedule[0].scheduleData
          LogThis(logSettings, `After updating updatedSchedule with originalSchedule updated: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
          res.json(updatedSchedule)
        } else {   
          const newSchedule = await Schedule.create({
              providerId: updatedSchedule.schedule.providerId, 
              clientId:updatedSchedule.schedule.providerId,
              product: updatedSchedule.product,
              scheduleData: updatedSchedule.schedule.scheduleData,
            })
          // res.status(404)
          // throw new Error('Schedule not found')
        }
  } catch (ex){
    LogThis(logSettings,`Exception error: ex.message=${ex.message}; ex.stack=${ex.stack}`)
    res.status(404)
    throw new Error('Error updating the appointments information.')
  }
})
    
// @desc    Get schedule
// @route   GET /api/schedule/:providerid
// @access  Private 
const getScheduleByProviderId = asyncHandler(async (req, res) => {
    const logSettings = initLogSettings('schedulerController', 'getScheduleByProviderId')
    const _providerId = req.query.providerId
    const _clientId = req.query.clientId

    LogThis(logSettings, `Started: _providerId=${_providerId}`)
    let providerBlockedSchedule = null
    let schedule = null
    try{
    //schedule = await Schedule.find({serviceProvider: serviceProviderId})
    LogThis(logSettings, `Before ProviderBlockedSchedule.find: _providerId=${_providerId}`)
    providerBlockedSchedule = await ProviderBlockedSchedule.find({providerId: _providerId})
    LogThis(logSettings, `After ProviderBlockedSchedule.find: providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)
    
    LogThis(logSettings, `Before Schedule.find: _providerId=${_providerId}`)
    schedule = await Schedule.find({providerId: _providerId})
    LogThis(logSettings, `After Schedule.find: schedule=${JSON.stringify(schedule)}`)

    if (!providerBlockedSchedule || providerBlockedSchedule.length===0){
      LogThis(logSettings, `Creating schedule entry`)
      const todayPlus1DayStartTime = new Date()
      const todayPlus1DayEndTime = new Date()

      todayPlus1DayStartTime.setDate(todayPlus1DayStartTime.getDate() + 1)
      todayPlus1DayStartTime.setHours(17)
      todayPlus1DayStartTime.setMinutes(0)
      todayPlus1DayStartTime.setSeconds(0)
      todayPlus1DayStartTime.setMilliseconds(0)
      todayPlus1DayEndTime.setDate(todayPlus1DayEndTime.getDate() + 1)
      todayPlus1DayEndTime.setHours(18)
      todayPlus1DayEndTime.setMinutes(0)
      todayPlus1DayEndTime.setSeconds(0)
      todayPlus1DayEndTime.setMilliseconds(0)

      const blockingStartTime = new Date()
      const blockingEndTime = new Date()

      blockingStartTime.setHours(8)
      blockingStartTime.setMinutes(0)
      blockingStartTime.setSeconds(0)
      blockingStartTime.setMilliseconds(0)
      blockingEndTime.setHours(17)
      blockingEndTime.setMinutes(0)
      blockingEndTime.setSeconds(0)
      blockingEndTime.setMilliseconds(0)
      LogThis(logSettings, `Before ProviderBlockedSchedule.create: _providerId=${_providerId}`)
      providerBlockedSchedule = await ProviderBlockedSchedule.create({
                  providerId: _providerId,
                  scheduleData: [
                    {
                      Subject: 'Busy',
                      StartTime: blockingStartTime,
                      EndTime: blockingEndTime,
                      //IsAllDay: true,
                      RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;BYHOUR=8,9,10,11,12,13,14,15,16,17',
                      ////IsReadonly: true, will make the appointment read only, the user can't modify it. 
                      //IsReadonly: true,
                      ////IsBlock:true, will block the calendar for the specified period. 
                      IsBlock: true,
                      appointmentType: 'provider-busy'
                    }]
      })
      LogThis(logSettings, `After ProviderBlockedSchedule.create: _providerId=${_providerId}; providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)

//   const newSchedule = await Schedule.create ({
//     serviceProvider: serviceProviderId,
//     serviceClient: serviceProviderId,
//     product: '647b8c1c52180d3030931b88',
//     scheduleData: [
//           {
//             Subject: 'Busy',
//             StartTime: blockingStartTime,
//             EndTime: blockingEndTime,
//             //IsAllDay: true,
//             RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;BYHOUR=8,9,10,11,12,13,14,15,16,17',
//             ////IsReadonly: true, will make the appointment read only, the user can't modify it. 
//             //IsReadonly: true,
//             ////IsBlock:true, will block the calendar for the specified period. 
//             IsBlock: true,
//             appointmentType: 'provider-busy'
//           },
//         //   {
//         //   Subject: 'Scrum Master Advisory 2',
//         //   StartTime: todayPlus1DayStartTime,
//         //   EndTime: todayPlus1DayEndTime,
//         //   Location: 'Adivsor will send you Zoom link to your email',
//         //   appointmentType: 'existent-appointment',
//         //   IsBlock: true
//         // }
//     ],
//     paymentMethod: 'paymentMethod',
//     paymentResult: 'paymentResult',
//     itemsPrice:0.0,
//     taxPrice: 0.0,
//     totalPrice: 0.0,
//     isPaid: false,
//     paidAt: null,
//     isServiceProvided: false,
//     serviceProvidedAt: null
//   })
   //schedule = await Schedule.find({serviceProvider: '62e551baf5c6b51f61e0ef93'})
   //providerBlockedSchedule = await ProviderBlockedSchedule.find({serviceProvider: serviceProviderId})
   //schedule = await Schedule.find({serviceProvider: serviceProviderId})
 }
  // LogThis(logSettings, `created schedule: ${JSON.stringify(newSchedule)}`)
  
  
  /*schedule.scheduleData = [
          {
            Id: 1,
            Subject: 'Not Available',
            StartTime: new Date(2023,6,4,8,0),
            EndTime: new Date(2023,6,4,17,0),
            //IsAllDay: true,
            RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;BYHOUR=8,9,10,11,12,13,14,15,16,17',
            ////IsReadonly: true, will make the appointment read only, the user can't modify it. 
            //IsReadonly: true,
            ////IsBlock:true, will block the calendar for the specified period. 
            IsBlock: true,
            appointmentType: 'not-available'
          },
          {
          Id: 2,
          Subject: 'Scrum Master Advisory 2',
          StartTime: new Date(2023,6,5,19,0),
          EndTime: new Date(2023,6,5,20,0),
          Location: 'Adivsor will send you Zoom link to your email',
          appointmentType: 'existent-appointment',
          IsReadonly: true
        },
        // { 
        //   Id: 3,
        //   Subject: 'Scrum Master Advisory 2',
        //   StartTime: new Date(2023,6,2,17,0),
        //   EndTime: new Date(2023,6,2,18,0),
        //   Location: 'Adivsor will send you Zoom link to your email',
        //   appointmentType: 'new-appointment'
        // }
    ]
    await schedule.save()*/
    
    LogThis(logSettings, `Before checking schedule and providerBlockedSchedule lengths`)
    let scheduleResponse = null
    let _scheduleData = null
    if ((schedule&&schedule.length>0)||(providerBlockedSchedule&&providerBlockedSchedule.length>0)) {
      LogThis(logSettings, `schedule or providerBlockedSchedule have scheduleData: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
      if(schedule.length>0&&providerBlockedSchedule.length>0){
        LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
        _scheduleData = providerBlockedSchedule[0].scheduleData.concat(schedule[0].scheduleData)
        LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0 after concatenation: _scheduleData=${_scheduleData}`)
        scheduleResponse = {
          _id,
          providerId, 
          clientId, 
          product, 
          scheduleData, 
          paymentMethod, 
          paymentResult, 
          itemsPrice, 
          taxPrice, 
          totalPrice, 
          isPaid, 
          paidAt, 
          isServiceProvided, 
          serviceProvidedAt
        } = schedule[0]
        scheduleResponse.scheduleData = _scheduleData
        LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: scheduleResponse=${scheduleResponse}`) 

      } else if (schedule.length===0&&providerBlockedSchedule.length>0){

        LogThis(logSettings, `schedule=0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 

        _scheduleData = providerBlockedSchedule[0].scheduleData
        scheduleResponse = {
          providerId: _providerId, 
          clientId: _clientId,  
          scheduleData: _scheduleData
        }
        LogThis(logSettings, `schedule=0 and providerBlockedSchedule>0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 

      } else if (schedule.length>0&&providerBlockedSchedule.length===0){

        LogThis(logSettings, `schedule>0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
        _scheduleData = schedule.scheduleData
        scheduleResponse = {
          _id,
          providerId, 
          clientId, 
          product, 
          scheduleData, 
          paymentMethod, 
          paymentResult, 
          itemsPrice, 
          taxPrice, 
          totalPrice, 
          isPaid, 
          paidAt, 
          isServiceProvided, 
          serviceProvidedAt
        } = schedule[0]
        scheduleResponse.scheduleData = _scheduleData
        LogThis(logSettings, `schedule>0 and providerBlockedSchedule=0: scheduleResponse=${scheduleResponse}`) 
      } 
    } else {
      LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
      scheduleResponse = {
        providerId: _providerId, 
        clientId: _clientId,  
        scheduleData: []
      }
      LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: scheduleResponse=${scheduleResponse}`) 
    }
    LogThis(logSettings, `About to send back res.json: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
    res.json(scheduleResponse) 
  } catch (ex) { 
    LogThis(logSettings, `ex.message=${ex.message}`)
    res.status(404)
    throw new Error(`Error while retrieving appointments information.`)
  }
})

module.exports = {
  getScheduleByProviderId,
  updateScheduleByProviderId
}