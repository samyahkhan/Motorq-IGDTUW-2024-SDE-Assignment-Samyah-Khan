require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const vehicleRoutes = require('./vehicleRoutes');
const orgroutes = require('./orgroutes');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(bodyParser.json());

const decodeVinLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, 
    message: "Too many requests, please try again later.",
});

app.use('/vehicles/decode/:vin', decodeVinLimiter);
app.use('/vehicles', vehicleRoutes);
app.use('/Organization', orgroutes);

sequelize.sync()
    .then(() => {
        const port = process.env.PORT || 5500; 
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.log('Error syncing with the database:', err));
    

    