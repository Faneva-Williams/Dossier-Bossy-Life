// models/Virement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.config'); // Assurez-vous que vous avez un fichier config/database.js qui configure Sequelize

const Virement = sequelize.define('Virement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
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
  nifPayeur: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nomPayeur: {
    type: DataTypes.STRING,
    allowNull: false
  },

  datePaiement: {
    type: DataTypes.DATE,
    allowNull: false
  },
  numDecl: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },
  comptebancaire: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  compteimpot: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tvaAPayer: {
    type: DataTypes.DOUBLE,
    allowNull: false,
},
}, {
  tableName: 'virements',
  timestamps: true // Si vous voulez les champs createdAt et updatedAt
});

module.exports = Virement;
