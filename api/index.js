var express = require('express')
  , router = express.Router()

router.use('/login', require('./login'))
router.use('/signup', require('./signup'))
router.use('/verification', require('./verification'))
router.use('/', require('./sendverificationmail'))

module.exports = router
