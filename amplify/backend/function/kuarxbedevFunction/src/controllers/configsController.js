let asyncHandler = require('express-async-handler')
let Configs = require('../models/configsModel.js')
let LogThis = require('../utils/Logger.js')

// @desc    Get Address States
// @route   POST /api/AddressStates
// @access  Public
const getAddressStates = asyncHandler(async (req, res) => {
  const addressStates = await Configs.find({ name: 'AddressStates' })
  LogThis(`configsController, getAddressStates: addressStates=${JSON.stringify(addressStates??'undefined')}`)
  if (addressStates) {
    res.json(addressStates)
  } else {
    res.status(404)
    throw new Error('Address States not found in Configs')
  }
})

module.exports = {
  getAddressStates
}
