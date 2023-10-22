/** @format */

let express = require("express");
const router = express.Router();
let {
  surveyProcessing,
  createSurveyConfiguration,
} = require("../controllers/surveyController.js");
let { protect, admin } = require("../middleware/authMiddleware.js");

router.route("/:id").put(protect, admin, surveyProcessing);
router.route("/").post(protect, admin, createSurveyConfiguration);

module.exports = router;
