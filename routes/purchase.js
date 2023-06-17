const express = require('express');

const purchaseController = require('../controllers/purchase');
const purchaseAuthentication = require('../middleware/auth')

const router = express.Router();

router.get('/premiummember', purchaseAuthentication.authenticate, purchaseController.purchasepremium);

router.post('/updatemembership', purchaseAuthentication.authenticate, purchaseController.updatetransactionstatus);

module.exports = router;