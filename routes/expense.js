const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpense);

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);

router.get('/download', userAuthentication.authenticate,expenseController.getdownloadfile);

router.get('/download-file', userAuthentication.authenticate,expenseController.getallfiles);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;