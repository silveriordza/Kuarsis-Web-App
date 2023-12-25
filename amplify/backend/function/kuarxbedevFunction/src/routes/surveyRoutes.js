/** @format */

let express = require("express");
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
let {
  superSurveyUploadAnswers,
  superSurveyCreateConfig,
  superSurveyTests,
  getSuperSurveyConfigs,
  superSurveyGetList,
  superSurveySaveOutput,
  superSurveyDeleteOutputValues,
  superSurveyGetOutputValues,
  superSurveyGetRespondentIds,
  superSurveyUpdateOutput,
  updateSurveyMonkeyConfigs,
  superSurveyCreateConfigIntegratedWithMonkey,
} = require("../controllers/surveyController.js");
let { protect, admin } = require("../middleware/authMiddleware.js");

router.route("/:id/configs").get(protect, admin, getSuperSurveyConfigs);

//router.route("/:id/outputs").get(protect, admin, superSurveyGetOutputValues);
router
  .route("/:id/outputs")
  .post(protect, admin, superSurveySaveOutput)
  .delete(protect, admin, superSurveyDeleteOutputValues)
  .get(protect, admin, superSurveyGetOutputValues);

router
  .route("/:id/respondentidsinfo")
  .get(protect, admin, superSurveyGetRespondentIds);

router
  .route("/:id")
  .put(
    protect,
    admin,
    upload.fields([{ name: "fileNumeric" }, { name: "fileReal" }]),
    superSurveyUploadAnswers
  );

router
  .route("/:id/surveymonkey")
  .put(protect, admin, updateSurveyMonkeyConfigs);

router
  .route("/surveymonkey")
  .post(protect, admin, superSurveyCreateConfigIntegratedWithMonkey);

router
  .route("/")
  .get(protect, admin, superSurveyGetList)
  .post(protect, admin, superSurveyCreateConfig);

module.exports = router;
