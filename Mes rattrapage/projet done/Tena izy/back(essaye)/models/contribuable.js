const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Contribuable = sequelize.define('contribuable', {
    nif: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false
    },
    raisonsociale: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        allowNull: false
    },
    mdp: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    cin: {
        type: DataTypes.STRING(15),
        defaultValue: '',
        allowNull: false
    },
    numStat: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        allowNull: false
    },
    activite: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        allowNull: false
    }
});

module.exports = Contribuable;
