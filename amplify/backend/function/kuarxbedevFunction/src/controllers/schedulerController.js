let asyncHandler = require('express-async-handler')
let Schedule = require('../models/scheduleModel.js')
let {LogThis, initLogSettings} = require('../utils/Logger.js')

const logSettings = initLogSettings('schedulerController', '')

const updateScheduleByProviderId = asyncHandler(async (req, res) => {
  logSettings.sourceFunction='updateScheduleByProviderId'
  //const schedule = req.body.schedule
  LogThis(logSettings, `req.body=${JSON.stringify(req.body)}`)
  const {scheduleRequestUpdate} = req.body 

  const updatedSchedule = {
    _id,
    serviceProvider, 
    serviceClient, 
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
  } = scheduleRequestUpdate

  LogThis(logSettings, `Entering: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
  let originalSchedule = await Schedule.findOne({serviceProvider: updatedSchedule[0].serviceProvider})
  LogThis(logSettings, `Entering: originalSchedule=${JSON.stringify(originalSchedule)}`)
  if (originalSchedule) {
    
    originalSchedule.scheduleData = updatedSchedule[0].scheduleData
    LogThis(logSettings, `After updating schedule data: originalSchedule=${JSON.stringify(originalSchedule)}`)
    originalSchedule = await originalSchedule.save()
    LogThis(logSettings, `After updating database: originalSchedule=${JSON.stringify(originalSchedule)}`)
    updatedSchedule[0].scheduleData=originalSchedule.scheduleData
    LogThis(logSettings, `After updating updatedSchedule with originalSchedule updated: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
    res.json(updatedSchedule)
  } else {
    res.status(404)
    throw new Error('Schedule not found')
  }
})

// @desc    Get schedule
// @route   GET /api/schedule/:providerid
// @access  Private 
const getScheduleByProviderId = asyncHandler(async (req, res) => {
  const logSettings = initLogSettings('schedulerController', 'getScheduleByProviderId')
 
  LogThis(logSettings, `getScheduleByProviderId started`)
  let schedule = null
  try{
   schedule = await Schedule.find({serviceProvider: '62e551baf5c6b51f61e0ef93'})
  } catch(ex) {
    LogThis(logSettings, `Schedule.find`)
    schedule=null;
  }
   if (!schedule || schedule.length===0){
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
  

  const newSchedule = await Schedule.create ({
    serviceProvider: '62e551baf5c6b51f61e0ef93',
    serviceClient: '62e551baf5c6b51f61e0ef93',
    product: '647b8c1c52180d3030931b88',
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
          },
          {
          Subject: 'Scrum Master Advisory 2',
          StartTime: todayPlus1DayStartTime,
          EndTime: todayPlus1DayEndTime,
          Location: 'Adivsor will send you Zoom link to your email',
          appointmentType: 'existent-appointment',
          IsBlock: true
        }
    ],
    paymentMethod: 'paymentMethod',
    paymentResult: 'paymentResult',
    itemsPrice:100.0,
    taxPrice: 7.0,
    totalPrice: 107.0,
    isPaid: false,
    paidAt: null,
    isServiceProvided: false,
    serviceProvidedAt: null
  })
  schedule = await Schedule.find({serviceProvider: '62e551baf5c6b51f61e0ef93'})
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
  
  if (schedule) {
    LogThis(logSettings, `Responding 1`)
    const scheduleResponse = {
      _id,
      serviceProvider, 
      serviceClient, 
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
    } = schedule
    LogThis(logSettings, `Responding 2`)
    //LogThis(logSettings, JSON.stringify(scheduleResponse))
    
    res.json(scheduleResponse)
  } else {
    res.status(404)
    throw new Error('Schedule not found')
  }
})

module.exports = {
  getScheduleByProviderId,
  updateScheduleByProviderId
}