const { DataTypes } = require('sequelize');
const sequelize = require('../db.config');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message:{
      type: DataTypes.STRING(500),
      allowNull: false
      },
    nombre: {
    type: DataTypes.INTEGER,
    defaultValue: 0
},
    });
  

module.exports = Notification;