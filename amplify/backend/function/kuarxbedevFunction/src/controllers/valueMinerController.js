/**
 * @format
 * @prittier
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const axios = require('axios')

let asyncHandler = require('express-async-handler')

// const {
//    applyStringCriteriaToValue,
//    formatDate,
// } = require('../utils/Functions.js')
const { getBalanceSheets } = require('../utils/alphaVantageAPI.js')

const {
   secEdgarBulkUpdate,
   secEdgarBulkQuarterUpdate,
} = require('../utils/secEdgarAPI.js')

let {
   BalanceSheetAnnual,
   BalanceSheetQuarterly,
} = require('../models/valueMinerModel.js')

let {
   LoggerSettings,
   LogThis,
   LogVars,
   HasDataException,
   LogDebugSection,
   LogVarsFilter,
   j,
   OFF,
   L0,
   L1,
   L2,
   L3,
} = require('../utils/Logger.js')

// let {
//    saveDynamicModelToDB,
//    loadOneDynamicModelFromDB,
//    dynamicModelsMap,
//    convertDataTypeToMongoSchemaDataType,
// } = require('../utils/mongoDbHelper.js')
const srcFileName = 'valueMinerController.js'

// @desc    Creates a new Super Survey configuration
// @route   POST /api/surveys/
// @access  Private/Admin
const postBalanceSheets = asyncHandler(async (req, res) => {
   const functionName = 'postBalanceSheets'
   const log = new LoggerSettings(srcFileName, functionName)

   const { symbols } = req.body

   const letBalanceSheets = await getBalanceSheets(symbols)

   let ownerId = req.user._id

   res.status(201).json({
      letBalanceSheets: letBalanceSheets,
   })
})

const postSecEdgarBulkController = asyncHandler(async (req, res) => {
   const functionName = 'postSecEdgarBulkController'
   const log = new LoggerSettings(srcFileName, functionName)

   const { years } = req.body

   const success = await secEdgarBulkUpdate(years)

   let ownerId = req.user._id

   res.status(201).json({
      success: success,
   })
})

const postSecEdgarBulkUpdateQuarterController = asyncHandler(
   async (req, res) => {
      const functionName = 'postSecEdgarBulkUpdateQuarterController'
      const log = new LoggerSettings(srcFileName, functionName)

      const { quarters } = req.body

      const success = await secEdgarBulkQuarterUpdate(quarters)

      let ownerId = req.user._id

      res.status(201).json({
         success: success,
      })
   },
)

module.exports = {
   postBalanceSheets,
   postSecEdgarBulkController,
   postSecEdgarBulkUpdateQuarterController,
}
