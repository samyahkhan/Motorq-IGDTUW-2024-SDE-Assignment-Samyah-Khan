const axios = require('axios');
const Vehicle = require('./vehicle');
const Organization = require('./Organization');
require('dotenv').config();

const decodeVin = async (req, res) => {
    try {
        const { vin } = req.params;
        if (vin.length !== 17) {
            return res.status(400).json({ error: 'Invalid VIN. VIN must be 17 characters long.' });
        }
        const { data } = await axios.get(`${process.env.NHTSA_API_URL}/${vin}?format=json`);
        const vehicleData = data.Results.reduce((acc, result) => {
            if (result.Variable === 'Make') acc.manufacturer = result.Value;
            if (result.Variable === 'Model') acc.model = result.Value;
            if (result.Variable === 'Model Year') acc.year = result.Value;
            return acc;
        }, {});

        res.json(vehicleData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to decode VIN' });
    }
};

const addVehicle = async (req, res) => {
    try {
        const { vin, org } = req.body;
        if (!vin || vin.length !== 17) {
            return res.status(400).json({ error: 'Invalid VIN. VIN must be 17 characters long.' });
        }
        if (!org) {
            return res.status(400).json({ error: 'VIN and Organization are required' });
        }

        const organization = await Organization.findByPk(org);
        if (!organization) {
            return res.status(400).json({ error: 'Invalid Organization ID' });
        }

        const { data } = await axios.get(`${process.env.NHTSA_API_URL}/${vin}?format=json`);
        const vehicleData = data.Results.reduce((acc, result) => {
            if (result.Variable === 'Make') acc.manufacturer = result.Value;
            if (result.Variable === 'Model') acc.model = result.Value;
            if (result.Variable === 'Model Year') acc.year = result.Value;
            return acc;
        }, {});

        const vehicle = await Vehicle.create({
            vin,
            manufacturer: vehicleData.manufacturer,
            model: vehicleData.model,
            year: vehicleData.year,
            organizationId: organization.id,
        });

        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
};

const getVehicle = async (req, res) => {
    try {
        const { vin } = req.params;
        if (vin.length !== 17) {
            return res.status(400).json({ error: 'Invalid VIN. VIN must be 17 characters long.' });
        }
        const vehicle = await Vehicle.findOne({ where: { vin } });

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
};

module.exports = {
    decodeVin,
    addVehicle,
    getVehicle,
};
