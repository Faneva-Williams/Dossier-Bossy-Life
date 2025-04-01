// models/Rectification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');  // Assurez-vous que le fichier de configuration de la base de données est correct

const Rectification = sequelize.define('rectification', {
    id_rect: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nif: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    raisonsociale: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ligne_erronee: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    commentaire: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING(255),  
        allowNull: true, 
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'En attente',  // Statut de la demande (par ex. "En attente", "Approuvé", "Rejeté")
        allowNull: false,
    },
});

module.exports = Rectification;
