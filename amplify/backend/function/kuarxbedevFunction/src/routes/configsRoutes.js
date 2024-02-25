/** @format */

let express = require('express')
const router = express.Router()
let {
   getAddressStates,
   getSurveyMonkeyToken,
   generateToken,
} = require('../controllers/configsController.js')

let { protect, admin } = require('../middleware/authMiddleware.js')

// This is comming from /api/getAddressStates
router.route('/addressstates').get(getAddressStates)
router.route('/surveymonkey').get(protect, admin, getSurveyMonkeyToken)
router.route('/generatetoken').get(protect, admin, generateToken)
module.exports = router
