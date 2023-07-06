const express = require('express');

const auth = require('../middleware/auth');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/sign-up', userController.postUser);

router.post('/login', userController.postLogin);

router.get('/check-premium', auth.authenticate, userController.checkPremium);

router.get('/download',userController.getdownloadfile);

module.exports = router;

