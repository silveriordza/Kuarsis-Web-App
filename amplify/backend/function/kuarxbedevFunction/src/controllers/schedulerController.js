let asyncHandler = require('express-async-handler')
let {Schedule/*, ProviderBlockedSchedule*/} = require('../models/scheduleModel.js')
let {LogThis, initLogSettings} = require('../utils/Logger.js')
let {EVENT_STATUS_CONFIRMED} = require('../config/schedulerComponentConstants.js')


const updateScheduleByProviderId = asyncHandler(async (req, res) => {
  try{
        const logSettings = initLogSettings('schedulerController', 'updateScheduleByProviderId')
        
        LogThis(logSettings, `req.body=${JSON.stringify(req.body)}`)
        const {scheduleRequestUpdate} = req.body 

        const updatedSchedule = {
          schedule, product
        } = scheduleRequestUpdate

        LogThis(logSettings, `Entering: updatedSchedule=${JSON.stringify(updatedSchedule)}`)
        let originalSchedule = null
        if(updatedSchedule.schedule.providerId != updatedSchedule.schedule.clientId)
        {
          originalSchedule = await Schedule.find
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

          originalSchedule[0].scheduleData = updatedSchedule.schedule.scheduleData

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
      } else {
        originalSchedule = await Schedule.find
          (
            { 
              $and: 
              [
                {providerId: updatedSchedule.schedule.providerId}, 
                {product: updatedSchedule.product}
              ]
            }
          )

          LogThis(logSettings, `Provider=Client: originalSchedule=${JSON.stringify(originalSchedule)}`)
        const newScheduleData = []
        if (originalSchedule&&originalSchedule.length>0) {
          LogThis(logSettings, `originalSchedule has data`)
          
          //Check for items that are deleted: for each schedule found, check the scheduleData if the id is not in the updatedSchedule event list it means it was removed, hence it will be filtered form the original Schedule Data.
          originalSchedule.forEach( sch => {
            sch.scheduleData = sch.scheduleData.filter(event => updatedSchedule.schedule.scheduleData.some(updatedEvent => event.schedulerEventId == updatedEvent.schedulerEventId))
          })
          LogThis(logSettings, `After delete: originalSchedule=${JSON.stringify(originalSchedule)}`)
          //Now updated the updated events for each schedule found:
  
          originalSchedule.forEach( sch => {
            sch.scheduleData = sch.scheduleData.map(event => {
              updatedScheduleData = updatedSchedule.schedule.scheduleData.find(updatedEvent => event.schedulerEventId == updatedEvent.schedulerEventId)
              if(updatedScheduleData){
                return updatedScheduleData
              } else {
                return event
              }
            })
          })
          LogThis(logSettings, `After updating appointments: originalSchedule=${JSON.stringify(originalSchedule)}`)
          let providerIsClientIndex = originalSchedule.findIndex(sch => (sch.providerId == updatedSchedule.schedule.providerId) && (sch.clientId==updatedSchedule.schedule.providerId))
          //Now add the new events the provider has added for himself
          if(providerIsClientIndex > -1){
            LogThis(logSettings, `provider same as client FOUND: originalSchedule[providerIsClientIndex].scheduleData=${JSON.stringify(originalSchedule[providerIsClientIndex].scheduleData)}`)

            const updatedScheduleData = updatedSchedule.schedule.scheduleData.filter( updatedEvent => !originalSchedule.some(sch => sch.scheduleData.some(event => updatedEvent.schedulerEventId==event.schedulerEventId)))

            LogThis(logSettings, `After filtering updatedScheduleData to keep only new appts: updatedScheduleData=${JSON.stringify(updatedScheduleData)}`)

            originalSchedule[providerIsClientIndex].scheduleData = originalSchedule[providerIsClientIndex].scheduleData.concat(updatedScheduleData)
            LogThis(logSettings, `AFTER UPDATING SCHEDULE DATA: originalSchedule[providerIsClientIndex].scheduleData=${JSON.stringify(originalSchedule[providerIsClientIndex].scheduleData)}`)
          } else {
            LogThis(logSettings, `provider same as client not found`)
            const newSchedule = await Schedule.create({
                providerId: updatedSchedule.schedule.providerId, 
                clientId:updatedSchedule.schedule.clientId,
                product: updatedSchedule.product,
                scheduleData: updatedSchedule.schedule.scheduleData.filter( updatedEvent => !originalSchedule.some(sch => sch.scheduleData.some(event => updatedEvent.schedulerEventId==event.schedulerEventId)))
            })
            LogThis(logSettings, `provider same as client created new record: originalSchedule=${JSON.stringify(newSchedule)}`)
          }

          
          

          // {
          //   if((sch.providerId == updatedSchedule.schedule.providerId) && (sch.clientId==updatedSchedule.schedule.providerId)){
          //     sch.scheduleData =sch.scheduleData.filer( event => {
          //       updatedScheduleData = updatedSchedule.schedule.find(updatedEvent => event.schedulerEventId == updatedEvent.schedulerEventId)
          //       if(updatedScheduleData){}
          //     })
          //     updatedSchedule.schedule.scheduleData
          //   } else {
          //     return sch
          //   }
          // })
        



          // LogThis(logSettings, `After updating schedule data: originalSchedule=${JSON.stringify(originalSchedule)}`)
          
          
          // //originalSchedule = await originalSchedule.save()
          
          //originalSchedule.forEach(sch => sch.save())
          let currentSchedule = null
          for (let i=0; i < originalSchedule.length; i++){
            currentSchedule = await originalSchedule[i].save()
          }

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
      //LogThis(logSettings, `logSettings=${JSON.stringify(logSettings)}`)

      LogThis(logSettings, `Started: _providerId=${_providerId}; _clientId=${_clientId}; _product=${_product}`)
      //let providerBlockedSchedule = null
      let providerSchedule = null
      let clientSchedule = null
      let _scheduleData = []
      let schedule = null
      // LogThis(logSettings, `Before ProviderBlockedSchedule.find: _providerId=${_providerId}`)
      // providerBlockedSchedule = await ProviderBlockedSchedule.find({providerId: _providerId})
      // LogThis(logSettings, `After ProviderBlockedSchedule.find: providerBlockedSchedule=${JSON.stringify(providerBlockedSchedule)}`)

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
            let endTime = new Date(event.EndTime)
            let currentTime = new Date()
            //If the if the provider is equal to the client, it means that the provider is the one that is loged in and requesting his own schedule, therefore he is able to see all his appointments with his clients with the original subject line and not as Busy. Also the appoinments will not show as blocked, and can be modified by the provider at will. Also the provider will be able to see past due (even if not confirmed) and future appointments. 
            if(_providerId==_clientId){
              _scheduleData.push(event)
            } else {
              if (endTime >= currentTime){
                event.Subject = 'Busy'
                event.IsBlock = true
                _scheduleData.push(event)
              }
            }
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
                      let endTime = new Date(event.EndTime)
                      let currentTime = new Date()
          
                      if (endTime >= currentTime){
                        event.Subject = 'Busy'
                        event.IsBlock = true
                        _scheduleData.push(event)
                      }
                    }
                )
              } 
              else 
              {
                  sch.scheduleData.forEach(event => {
                  let endTime = new Date(event.EndTime)
                  let currentTime = new Date()
            
                  if (   endTime < currentTime 
                      && event.schedulerEventStatus == EVENT_STATUS_CONFIRMED
                      )
                  {
                    event.IsBlock = true
                    _scheduleData.push(event)
                  }
                  else 
                  {
                    _scheduleData.push(event)
                  }
                })
              }
            }
          )
      }
      LogThis(logSettings, `Client Schedule: _scheduleData=${JSON.stringify(_scheduleData)}`)
      let scheduleResponse = null
      scheduleResponse = {
        providerId: _providerId,
        clientId: _clientId,
        product: _product,
        scheduleData: _scheduleData
      }
      LogThis(logSettings, `After populating scheduleResponse with _scheduleData: scheduleResponse=${JSON.stringify(JSON.stringify(scheduleResponse))}`)
      
      
      //let _otherScheduleData = null
      //if ((schedule&&schedule.length>0)/*||(providerBlockedSchedule&&providerBlockedSchedule.length>0)*/) {
            //LogThis(logSettings, `schedule or providerBlockedSchedule have scheduleData: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
            //LogThis(logSettings, `schedule have scheduleData: schedule.length=${schedule.length}`) 
            //if(schedule.length>0/*&&providerBlockedSchedule.length>0*/){
                // LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
                // _otherScheduleData = providerBlockedSchedule[0].scheduleData.concat(schedule[0].scheduleData)
                // LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0 after concatenation: _otherScheduleData=${JSON.stringify(_otherScheduleData)}`)
                // LogThis(logSettings, `schedule>0 schedule.length=${schedule.length}`) 
                
                // scheduleResponse = {
                //   providerId, 
                //   clientId, 
                //   product, 
                //   scheduleData, 
                // } = schedule[0]
                
                //scheduleResponse.scheduleData = _otherScheduleData
                //scheduleResponse.scheduleData = schedule[0].scheduleData
                //LogThis(logSettings, `schedule>0 and providerBlockedSchedule>0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
                //LogThis(logSettings, `schedule>0 : scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
            /*} else if (schedule.length===0&&providerBlockedSchedule.length>0){

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
            } */
      // } else {
      //     LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: schedule.length=${schedule.length}; providerBlockedSchedule.length=${providerBlockedSchedule.length}`) 
      //     scheduleResponse = {
      //       providerId: _providerId, 
      //       clientId: _clientId,
      //       product: _product,
      //       scheduleData: []
      //     }
      //     LogThis(logSettings, `schedule=0 and providerBlockedSchedule=0: scheduleResponse=${JSON.stringify(scheduleResponse)}`) 
      // }
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