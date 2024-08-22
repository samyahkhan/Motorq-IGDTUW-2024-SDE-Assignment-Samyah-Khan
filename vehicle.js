const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Organization = require('./Organization');

const Vehicle = sequelize.define('Vehicle', {
    vin: {
        type: DataTypes.STRING(17),
        allowNull: false,
        unique: true,
    },
    manufacturer: {
        type: DataTypes.STRING,
    },
    model: {
        type: DataTypes.STRING,
    },
    year: {
        type: DataTypes.STRING,
    },
    organizationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Organization,
            key: 'id',
        },
    },
});

Vehicle.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports = Vehicle;
