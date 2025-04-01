const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Paiement = sequelize.define('paiement', {
    num_paie:{
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nif: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    raisonsociale: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false,
    },
    datedeclaration: {
        type: DataTypes.DATE,  // Changed to DATE type
        allowNull: false,
    },
    datedepaiement: {
        type: DataTypes.DATE,  // Changed to DATE type
        allowNull: false,
    },
    tvaAPayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    statut: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false,
    },

});
module.exports = Paiement;