var express = require('express')
  , router = express.Router()
const AuthController = require('../../middlewares/auth');
const passport = require('passport');

router.post('/', AuthController.authenticateUser);
router.get('/users', passport.authenticate('jwt', { session: false }), AuthController.getUsers);

module.exports = router;
