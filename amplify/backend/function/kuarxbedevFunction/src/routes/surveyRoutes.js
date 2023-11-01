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
} = require("../controllers/surveyController.js");
let { protect, admin } = require("../middleware/authMiddleware.js");

router
  .route("/:id")
  .put(
    protect,
    admin,
    upload.fields([{ name: "fileNumeric" }, { name: "fileReal" }]),
    superSurveyUploadAnswers
  );
router.route("/").post(protect, admin, superSurveyCreateConfig);

module.exports = router;
