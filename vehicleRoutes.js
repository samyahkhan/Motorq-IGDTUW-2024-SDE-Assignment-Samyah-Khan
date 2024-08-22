const express = require('express');
const { addVehicle, getVehicle, decodeVin } = require('./vehicleController');

const router = express.Router();

router.get('/decode/:vin', decodeVin);

router.post('/', addVehicle);

router.get('/:vin', getVehicle);

module.exports = router;
