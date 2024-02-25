/** @format */

let asyncHandler = require("express-async-handler");
let Configs = require("../models/configsModel.js");
let { LogThisLegacy, initLogSettings } = require("../utils/Logger.js");

// @desc    Get Address States
// @route   POST /api/AddressStates
// @access  Public
const getAddressStates = asyncHandler(async (req, res) => {
  const logSettings = initLogSettings("configsController", "getAddressStates");
  const addressStates = await Configs.find({ name: "AddressStates" });
  LogThisLegacy(
    logSettings,
    `addressStates=${JSON.stringify(addressStates ?? "undefined")}`
  );

  if (addressStates) {
    res.json(addressStates);
  } else {
    res.status(404);
    throw new Error("Address States not found in Configs");
  }
});

module.exports = {
  getAddressStates,
};
