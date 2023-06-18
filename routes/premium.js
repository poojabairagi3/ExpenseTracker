const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');
const premiumAuthentication = require('../middleware/auth')

router.get('/leaderboard', premiumAuthentication.authenticate, premiumController.getPremium);
module.exports = router;