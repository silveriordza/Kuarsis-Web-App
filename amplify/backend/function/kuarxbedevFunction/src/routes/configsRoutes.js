let express = require('express')
const router = express.Router()
let {
  getAddressStates
} = require('../controllers/configsController.js')

// This is comming from /api/getAddressStates
router.route('/addressstates').get(getAddressStates)
module.exports = router
