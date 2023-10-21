/** @format */

let express = require("express");
const router = express.Router();
let { surveyProcessing } = require("../controllers/surveyController.js");
let { protect, admin } = require("../middleware/authMiddleware.js");

router.route("/:id").put(protect, admin, surveyProcessing);

module.exports = router;
