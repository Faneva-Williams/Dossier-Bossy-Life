const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Declaration = sequelize.define('declaration', {
    num_decl: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nif: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   
    
    raisonsociale: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false,
    },
    periode: {
        type: DataTypes.DATE,  // Changed to DATE type
        allowNull: false,
    },
    vente: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    achats: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    tvaAPayer: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
});



module.exports = Declaration;
