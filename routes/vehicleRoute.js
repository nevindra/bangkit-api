const express = require('express');
const router = express.Router();

const vehicleControllers = require('../controllers/vehicleControllers');

// Collections:
router.get('/vehicles/:id_user', vehicleControllers.getVehicles);
router.get('/vehicles/:id_user/:id_vehicle', vehicleControllers.getVehiclesById)

// Non Resource URL:
router.post('/register-vehicles', vehicleControllers.registerVehicle);

router.delete('/vehicles', vehicleControllers.deleteVehicleById)

module.exports = router