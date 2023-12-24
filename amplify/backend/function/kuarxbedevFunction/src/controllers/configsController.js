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

// @desc    Get Address States
// @route   POST /api/AddressStates
// @access  Public
const getSurveyMonkeyToken = asyncHandler(async (req, res) => {
  const logSettings = initLogSettings(
    "configsController",
    "getSurveyMonkeyToken"
  );
  const token = process.env.KUARSIS_SURVEY_MONKEY_TOKEN;
  // LogThisLegacy(
  //   logSettings,
  //   `token=${JSON.stringify(addressStates ?? "undefined")}`
  // );

  if (token) {
    res.json(token);
  } else {
    res
      .status(404)
      .json({ message: "No fue posible conectar con Survey Monkey: token" });
    throw new Error("Survey monkey token not found.");
  }
});

module.exports = {
  getAddressStates,
  getSurveyMonkeyToken,
};
