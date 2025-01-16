/** @format */

let express = require('express')
const multer = require('multer')

// Configure multer for handling file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { LogThis, LoggerSettings, L0 } = require('../utils/Logger.js')

const router = express.Router()
let {
   postBalanceSheets,
   postSecEdgarBulkController,
   postSecEdgarBulkUpdateQuarterController,
   postEdgarBulkCompanyFactsUpdateController,
} = require('../controllers/valueMinerController.js')

let { protect, admin, hasAccess } = require('../middleware/authMiddleware.js')
//const { LoggerSettings } = require("../utils/Logger.js");

router.route('/AlphaVantageBulk').post(protect, admin, postBalanceSheets)
router
   .route('/edgar/bulkupdateannual')
   .post(protect, admin, postSecEdgarBulkController)

router
   .route('/edgar/bulkupdatequarter')
   .post(protect, admin, postSecEdgarBulkUpdateQuarterController)

router
   .route('/edgar/edgarbulkcompanyfactsupdate')
   .post(protect, admin, postEdgarBulkCompanyFactsUpdateController)

module.exports = router
