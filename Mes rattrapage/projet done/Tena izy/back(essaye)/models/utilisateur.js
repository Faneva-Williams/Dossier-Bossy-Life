const { DataTypes } = require('sequelize')
const sequelize = require('../db.config')

const User = sequelize.define('utilisateur', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
       autoIncrement: true
   },
    nom :{
        type: DataTypes.STRING(100),
        defaultValue : '',
        allowNull: false
},
email: {
        type: DataTypes.STRING(100),
        defaultValue : '',
        allowNull: false
},

password : {
    type: DataTypes.STRING(100),
    defaultValue : '',
    allowNull: false
},
})
User.sync()
module.exports = User