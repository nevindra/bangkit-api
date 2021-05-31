const transactionController = require('../controllers/transactionControllers');
const express = require('express');
const router = express.Router();

router.get('/transactions/done/:id', transactionController.historyTransactionNotDone);
router.get('/transactions/not-done/:id', transactionController.historyTransactionIsDone);
router.get('/balances', transactionController.getSaldo);
router.post('/topup', transactionController.topUp);

router.post('/confirm-pin', transactionController.confirmationPayment)

module.exports = router;