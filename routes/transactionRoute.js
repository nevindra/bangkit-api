const transactionController = require('../controllers/transactionControllers');
const express = require('express');
const router = express.Router();

router.post('/topup', transactionController.topUp);

module.exports = router;