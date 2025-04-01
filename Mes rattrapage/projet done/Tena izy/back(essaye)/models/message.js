// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');  // Assurez-vous que le fichier de configuration de la base de données est correct

const Message = sequelize.define('message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Non lu',  // Statut du message, par ex. "Non lu", "Lu"
    }
}, {
    timestamps: true,  // Inclure createdAt et updatedAt
});

module.exports = Message;
