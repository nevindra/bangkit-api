const transactionController = require('../controllers/transactionControllers');
const express = require('express');
const router = express.Router();

router.post('/topup', transactionController.topUp);
router.post('/confirm-pin', transactionController.confirmationPayment)
module.exports = router;