const express = require('express');
const router = express.Router();

const vehicleControllers = require('../controllers/vehicleControllers');

// Collections:
router.get('/vehicles', vehicleControllers.getVehicles);
router.get('/vehicles/:id', vehicleControllers.deleteVehicleById)

// Non Resource URL:
router.post('/register-vehicles', vehicleControllers.registerVehicle);

module.exports = router