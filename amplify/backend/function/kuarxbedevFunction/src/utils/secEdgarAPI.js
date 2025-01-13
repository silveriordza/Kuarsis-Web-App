/**
 * @format
 * @prittier
 * */

const axios = require('axios')
let {
   LogThis,
   HasDataException,
   LoggerSettings,
   L0,
   L1,
   L2,
   L3,
   LogVars,
   LogThisFilter,
   LogVarsFilter,
   HasData,
   j,
} = require('../utils/Logger.js')
const { validateHasData } = require('./Functions.js')

const {
   applyStringCriteriaToValue,
   formatDate,
} = require('../utils/Functions.js')

const {
   EdgarCompanyFactsAnnual,
   EdgarCikToTickerMaps,
   EgarCompanyFactsQuarter,
} = require('../models/valueMinerModel.js')

const srcFileName = 'secEdgarAPI.js'

const secEdgarBulkUpdate = async years => {
   const log = new LoggerSettings(srcFileName, 'bulkUpdate')
   LogThis(log, `START`)
   try {
      await EdgarCompanyFactsAnnual.deleteMany({ year: years })
      const apiResponses = []

      const headers = {
         'User-Agent': 'Kuarxis Companies silverio.rodriguez@kuarxis.com',
         'Accept-Encoding': 'gzip, deflate, br',
         Host: 'data.sec.gov',
         Accept: '*/*',
      }

      const cikTickerMapCollection = await EdgarCikToTickerMaps.find({}).lean()
      const cikTickerMapData = Object.values(
         cikTickerMapCollection[0].cikTickerMap,
      )
      const edgarCompanyFactsAnnualArray = []
      for (const year of years) {
         const apiResponse = await axios.get(
            `https://data.sec.gov/api/xbrl/frames/us-gaap/InterestExpense/USD/CY${year}.json`,
            { headers: headers },
         )
         if (!HasData(apiResponse?.data?.data)) {
            return false
         }

         for (const interestData of apiResponse?.data?.data) {
            const edgarCompanyFactAnnual = new EdgarCompanyFactsAnnual()
            edgarCompanyFactAnnual.cik = interestData.cik
            edgarCompanyFactAnnual.symbol = cikTickerMapData.find(
               data => data.cik_str === interestData.cik,
            )?.ticker
            if (!HasData(edgarCompanyFactAnnual.symbol)) {
               edgarCompanyFactAnnual.symbol = 'KUARXISNOTFOUND'
            }
            edgarCompanyFactAnnual.year = year
            edgarCompanyFactAnnual.InterestExpense = interestData.val
            edgarCompanyFactsAnnualArray.push(edgarCompanyFactAnnual)
         }
      }
      await EdgarCompanyFactsAnnual.insertMany(edgarCompanyFactsAnnualArray)

      return true
   } catch (ex) {
      throw Error(ex)
   }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const secEdgarBulkQuarterUpdate = async quarters => {
   const log = new LoggerSettings(srcFileName, 'secEdgarBulkQuarterUpdate')
   LogThis(log, `START`)
   try {
      const headers = {
         'User-Agent': 'Kuarxis Companies silverio.rodriguez@kuarxis.com',
         'Accept-Encoding': 'gzip, deflate, br',
         Host: 'data.sec.gov',
         Accept: '*/*',
      }

      const apiResponses = []

      const cikTickerMapCollection = await EdgarCikToTickerMaps.find({}).lean()
      const cikTickerMapData = Object.values(
         cikTickerMapCollection[0].cikTickerMap,
      )
      const entityArray = []
      let AreThereMoreYears = true
      for (const year of Object.keys(quarters)) {
         if (!AreThereMoreYears) {
            break
         }

         for (const quarter of quarters[year]) {
            await EgarCompanyFactsQuarter.deleteMany({
               year: year,
               quarter: quarter,
            })

            const apiResponse = await axios.get(
               `https://data.sec.gov/api/xbrl/frames/us-gaap/InterestExpense/USD/CY${year}Q${quarter}.json`,
               { headers: headers },
            )
            await sleep(120)
            if (!HasData(apiResponse?.data?.data)) {
               AreThereMoreYears = false
               break
            }

            for (const interestData of apiResponse?.data?.data) {
               const entity = new EgarCompanyFactsQuarter()
               entity.cik = interestData.cik
               entity.symbol = cikTickerMapData.find(
                  data => data.cik_str === interestData.cik,
               )?.ticker
               if (!HasData(entity.symbol)) {
                  entity.symbol = 'KUARXISNOTFOUND'
               }
               entity.year = year
               entity.quarter = quarter
               entity.startDate = interestData.start
               entity.endDate = interestData.end
               entity.InterestExpense = interestData.val
               entityArray.push(entity)
            }
         }
      }
      await EgarCompanyFactsQuarter.insertMany(entityArray)

      return true
   } catch (ex) {
      throw Error(ex)
   }
}

module.exports = {
   secEdgarBulkUpdate,
   secEdgarBulkQuarterUpdate,
}
