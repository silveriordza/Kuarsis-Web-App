let asyncHandler = require('express-async-handler')
let {Schedule, ProviderBlockedSchedule} = require('../models/scheduleModel.js')
let {LogThis, initLogSettings} = require('../utils/Logger.js')

const logSettings = initLogSettings('schedulerController', '')

const updateScheduleByProviderId = asyncHandler(async (req, res) => {
  try{
        logSettings.sourceFunction='updateScheduleByProviderId'
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
    
    try
    {
      const logSettings = initLogSettings('schedulerController', 'getScheduleByProviderId')
    const _providerId = req.query.providerId
    const _clientId = req.query.clientId

    LogThis(logSettings, `Started: _providerId=${_providerId}`)
    let providerBlockedSchedule = null
    let providerSchedule = null
    let clientSchedule = null
    let _scheduleData = []
    let schedule = null
          LogThis(logSettings, `Before ProviderBlockedSchedule.find: _providerId=${_providerId}`)
          providerBlockedSchedule = await ProviderBlockedSchedule.find({providerId: _providerId})
          LogThis(logSettings, `After ProviderBlockedSchedule.find: providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)
          
          LogThis(logSettings, `Before Provider Schedule.find: _providerId=${_providerId}`)
         
          providerSchedule = await Schedule.find 
          (
            {
              $and:  
              [
                {providerId: _providerId}, {clientId: {$ne: _clientId}}
              ]
            }
          )
          if(providerSchedule&&providerSchedule.length>0)
          {
            providerSchedule.forEach(sch => {
              sch.scheduleData.forEach(event => {
                event.Subject = 'Busy'
                event.IsBlock = true
                _scheduleData.push(event)
              })
            })
          }
          clientSchedule = await Schedule.find ({clientId: _clientId})
          
          if(clientSchedule&&clientSchedule.length>0)
          {
            providerSchedule.forEach
            (sch => 
                {
                    if(sch.providerId!==_providerId)
                    {
                      sch.scheduleData.forEach
                      (event => 
                          {
                          event.Subject = 'Busy'
                          event.IsBlock = true
                          _scheduleData.push(event)
                          }
                      )
                    } 
                    else 
                    {
                      sch.scheduleData.forEach(event => {
                        _scheduleData.push(event)
                      })
                    }
                }
              )
          }
          schedule = [{
            providerId: _providerId,
            clientId: _clientId,
            product: '6497772db683f275e421c0e1',
            scheduleData: _scheduleData
          }]
          LogThis(logSettings, `After Schedule.find: schedule=${JSON.stringify(schedule)}`)

          if (!providerBlockedSchedule || providerBlockedSchedule.length===0){
            LogThis(logSettings, `Creating schedule entry`)
            
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
                            appointmentType: 'blocked-schedule'
                          }]
            })
            LogThis(logSettings, `After ProviderBlockedSchedule.create: _providerId=${_providerId}; providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)
          }
          
          LogThis(logSettings, `Before checking schedule and providerBlockedSchedule lengths`)
          let scheduleResponse = null
          let _otherScheduleData = null
          if ((schedule&&schedule.length>0)||(providerBlockedSchedule&&providerBlockedSchedule.length>0)) {
                LogThis(logSettings, `schedule or providerBlockedSchedule have scheduleData: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
                
                if(schedule.length>0&&providerBlockedSchedule.length>0){
                    LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
                    _otherScheduleData = providerBlockedSchedule[0].scheduleData.concat(schedule[0].scheduleData)
                    LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0 after concatenation: _otherScheduleData=${_otherScheduleData}`)
                    
                    scheduleResponse = {
                      providerId, 
                      clientId, 
                      product, 
                      scheduleData, 
                    } = schedule[0]
                    
                    scheduleResponse.scheduleData = _otherScheduleData
                    LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: scheduleResponse=${scheduleResponse}`) 

                } else if (schedule.length===0&&providerBlockedSchedule.length>0){

                    LogThis(logSettings, `schedule=0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 

                    _otherScheduleData = providerBlockedSchedule[0].scheduleData
                    scheduleResponse = {
                      providerId: _providerId, 
                      clientId: _clientId,  
                      scheduleData: _otherScheduleData
                    }
                    LogThis(logSettings, `schedule=0 and providerBlockedSchedule>0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 

                } else if (schedule.length>0&&providerBlockedSchedule.length===0){

                    LogThis(logSettings, `schedule>0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
                    _otherScheduleData = schedule.scheduleData
                    scheduleResponse = {
                      providerId, 
                      clientId, 
                      product, 
                      scheduleData, 
                    } = schedule[0]
                    scheduleResponse.scheduleData = _otherScheduleData
                    LogThis(logSettings, `schedule>0 and providerBlockedSchedule=0: scheduleResponse=${scheduleResponse}`) 
                } 
          } else {
              LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
              scheduleResponse = {
                providerId: _providerId, 
                clientId: _clientId,
                product: '6497772db683f275e421c0e1',
                scheduleData: []
              }
              LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: scheduleResponse=${scheduleResponse}`) 
          }
        LogThis(logSettings, `About to send back res.json: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
        res.json(scheduleResponse) 
    } catch (ex) 
    {

      LogThis(logSettings, `ex.message=${ex.message}; ex.stack=${ex.stack}`)
      res.status(404)
      throw new Error(`Error while retrieving appointments information.`)

    }
})

module.exports = {
  getScheduleByProviderId,
  updateScheduleByProviderId
}