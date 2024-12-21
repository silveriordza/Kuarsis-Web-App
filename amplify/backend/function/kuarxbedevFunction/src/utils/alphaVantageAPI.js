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
   BalanceSheetAnnual,
   BalanceSheetQuarterly,
} = require('../models/valueMinerModel.js')

const srcFileName = 'alphaVantageAPI.js'

const getBalanceSheets = async symbols => {
   const log = new LoggerSettings(srcFileName, 'getBalanceSheets')
   const apiKey = process.env.KUARSIS_VALUEMINER_ALPHAVANTAGE_APIKEY

   if (!apiKey || apiKey == '') {
      throw new Error(`Alpha Vantage apikey is empty.`)
   }

   // const apiConfig = {
   //    //responseType: "arraybuffer",
   //    headers: {
   //       //"Content-Type": "multipart/form-data",
   //       Authorization: `Bearer ${monkeyToken}`,
   //       Accept: 'application/json',
   //    },
   // }
   const params = {
      function: 'BALANCE_SHEET',
      symbol: 'HPAI',
      apikey: 'DKNJPXH33DBI2HQC',
   }
   let apiResponses = null

   await BalanceSheetAnnual.deleteMany({})
   await BalanceSheetQuarterly.deleteMany({})

   for (const symbol of symbols) {
      params.symbol = symbol
      try {
         apiResponses = await axios.get(`https://www.alphavantage.co/query`, {
            params,
         })
      } catch (ex) {
         LogThis(log, ex.message)
         break
      }

      const annualReports = apiResponses?.data?.annualReports
      const quarterlyReports = apiResponses?.data?.quarterlyReports
      // for (const annualReport in annualReports) {
      //    annualReport.symbol = params.symbol
      // }
      if (annualReports) {
         annualReports.forEach(x => {
            x.symbol = params.symbol
         })
         await BalanceSheetAnnual.insertMany(annualReports)
      }

      if (quarterlyReports) {
         quarterlyReports.forEach(x => {
            x.symbol = params.symbol
         })
         await BalanceSheetQuarterly.insertMany(quarterlyReports)
      }
   }

   return apiResponses?.data
}

module.exports = {
   getBalanceSheets,
}
