let asyncHandler = require('express-async-handler')
let {Schedule, ProviderBlockedSchedule} = require('../models/scheduleModel.js')
let {LogThis, initLogSettings} = require('../utils/Logger.js')



const updateScheduleByProviderId = asyncHandler(async (req, res) => {
  try{
        const logSettings = initLogSettings('schedulerController', 'updateScheduleByProviderId')
        
        LogThis(logSettings, `req.body=${JSON.stringify(req.body)}`)
        const {scheduleRequestUpdate} = req.body 

        const updatedSchedule = {
          schedule, product
        } = scheduleRequestUpdate

        LogThis(logSettings, `Entering: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
        let originalSchedule = await Schedule.find
        (
          { 
            $and: 
            [
              {providerId: updatedSchedule.schedule.providerId}, 
              {clientId: updatedSchedule.schedule.clientId},
              {product: updatedSchedule.product}
            ]
          }
        )

        LogThis(logSettings, `originalSchedule=${JSON.stringify(originalSchedule)}`)
        const newScheduleData = []
        if (originalSchedule&&originalSchedule.length>0) {
          LogThis(logSettings, `originalSchedule has data`)
          
          
          finalEvents = originalSchedule[0].scheduleData.filter
          (
            originalEvent => !updatedSchedule.schedule.scheduleData.some(updatedEvent => originalEvent.schedulerEventId == updatedEvent.schedulerEventId)
          )
          
          finalEvents = finalEvents.concat(updatedSchedule.schedule.scheduleData)
          
          originalSchedule[0].scheduleData = finalEvents

          LogThis(logSettings, `After updating schedule data: originalSchedule=${JSON.stringify(originalSchedule)}`)
          originalSchedule = await originalSchedule[0].save()
          
          LogThis(logSettings, `After updating database: originalSchedule=${JSON.stringify(originalSchedule)}`)
          const updatedScheduleResponse = await helper_getScheduleByProviderId(updatedSchedule.schedule.providerId, updatedSchedule.schedule.clientId, updatedSchedule.product)

          LogThis(logSettings, `Updating Schedule case, After helper_getScheduleByProviderId: updatedScheduleResponse=${JSON.stringify(updatedScheduleResponse)}`)
          
          res.json(updatedScheduleResponse)
        } else {   
          const newSchedule = await Schedule.create({
              providerId: updatedSchedule.schedule.providerId, 
              clientId:updatedSchedule.schedule.clientId,
              product: updatedSchedule.product,
              scheduleData: updatedSchedule.schedule.scheduleData,
            })
            const updatedScheduleResponse = await helper_getScheduleByProviderId(updatedSchedule.schedule.providerId, updatedSchedule.schedule.clientId, updatedSchedule.product)

          LogThis(logSettings, `NEW Schedule Case, after helper_getScheduleByProviderId: updatedScheduleResponse=${JSON.stringify(updatedScheduleResponse)}`)
          
          res.json(updatedScheduleResponse)
        }
  } catch (ex){
    const logSettings = initLogSettings('schedulerController', 'updateScheduleByProviderId')
    LogThis(logSettings,`Exception error: ex.message=${ex.message}; ex.stack=${ex.stack}`)
    res.status(404)
    throw new Error('Error updating the appointments information.')
  }
})

const helper_getScheduleByProviderId = async (_providerId, _clientId, _product) => {
  try
    {
      const logSettings = initLogSettings('schedulerController', 'helper_getScheduleByProviderId')

      LogThis(logSettings, `Started: _providerId=${_providerId}; _clientId=${_clientId}; _product=${_product}`)
      let providerBlockedSchedule = null
      let providerSchedule = null
      let clientSchedule = null
      let _scheduleData = []
      let schedule = null
      LogThis(logSettings, `Before ProviderBlockedSchedule.find: _providerId=${_providerId}`)
      providerBlockedSchedule = await ProviderBlockedSchedule.find({providerId: _providerId})
      LogThis(logSettings, `After ProviderBlockedSchedule.find: providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)

      LogThis(logSettings, `Before Provider Schedule.find: _providerId=${_providerId}; _clientId=${_clientId}`)
    
      providerSchedule = await Schedule.find 
      (
        {
          $and:  
          [
            {providerId: _providerId}, {clientId: {$ne: _clientId}}
          ]
        }
      )
      LogThis(logSettings, `After Provider Schedule.find: providerSchedule=${JSON.stringify(providerSchedule)}`)
      if(providerSchedule&&providerSchedule.length>0)
      {
        LogThis(logSettings, `Provider Schedule has data`)
        providerSchedule.forEach(sch => {
          sch.scheduleData.forEach(event => {
            event.Subject = 'Busy'
            event.IsBlock = true
            _scheduleData.push(event)
          })
        })
      }
      LogThis(logSettings, `Provider Schedule: _scheduleData=${JSON.stringify(_scheduleData)}`)


      clientSchedule = await Schedule.find ({clientId: _clientId})
      LogThis(logSettings, `After clientSchedule Schedule.find: clientSchedule=${JSON.stringify(clientSchedule)}`)
      if(clientSchedule&&clientSchedule.length>0)
      {
        LogThis(logSettings, `Client Schedule has data`)
        clientSchedule.forEach
        (sch => 
            {
              LogThis(logSettings, `seting other providers as busy: sch.providerId=${sch.providerId}; _providerId=${_providerId}`)
              if(sch.providerId!=_providerId)
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
      LogThis(logSettings, `Client Schedule: _scheduleData=${JSON.stringify(_scheduleData)}`)
      schedule = [{
        providerId: _providerId,
        clientId: _clientId,
        product: _product,
        scheduleData: _scheduleData
      }]
      LogThis(logSettings, `After populating schedule with scheduleData: schedule=${JSON.stringify(JSON.stringify(schedule))}`)
      
      let scheduleResponse = null
      let _otherScheduleData = null
      if ((schedule&&schedule.length>0)||(providerBlockedSchedule&&providerBlockedSchedule.length>0)) {
            LogThis(logSettings, `schedule or providerBlockedSchedule have scheduleData: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
            
            if(schedule.length>0&&providerBlockedSchedule.length>0){
                LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
                _otherScheduleData = providerBlockedSchedule[0].scheduleData.concat(schedule[0].scheduleData)
                LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0 after concatenation: _otherScheduleData=${JSON.stringify(_otherScheduleData)}`)
                
                scheduleResponse = {
                  providerId, 
                  clientId, 
                  product, 
                  scheduleData, 
                } = schedule[0]
                
                scheduleResponse.scheduleData = _otherScheduleData
                LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 

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
                LogThis(logSettings, `schedule>0 and providerBlockedSchedule=0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
            } 
      } else {
          LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
          scheduleResponse = {
            providerId: _providerId, 
            clientId: _clientId,
            product: '6497772db683f275e421c0e1',
            scheduleData: []
          }
          LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
      }
          LogThis(logSettings, `About to send back res.json: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
          return scheduleResponse
    } catch (ex) 
    {

      LogThis(logSettings, `ex.message=${ex.message}; ex.stack=${ex.stack}`)
      throw ex

    }
}

// @desc    Get schedule
// @route   GET /api/schedule/:providerid
// @access  Private 
const getScheduleByProviderId = asyncHandler(async (req, res) => {
    
    try
    {
      const logSettings = initLogSettings('schedulerController', 'getScheduleByProviderId')
      const scheduleResponse = await helper_getScheduleByProviderId(req.query.providerId, req.query.clientId, req.query.product)
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