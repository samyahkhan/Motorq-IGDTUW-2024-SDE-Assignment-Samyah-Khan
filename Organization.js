const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Organization = sequelize.define('Organization', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
    },
    fuelReimbursementPolicy: {
        type: DataTypes.STRING,
        defaultValue: '1000',
    },
    speedLimitPolicy: {
        type: DataTypes.STRING,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Organizations', 
            key: 'id',
        },
    },
});

Organization.belongsTo(Organization, { as: 'Parent', foreignKey: 'parentId' });

module.exports = Organization;
