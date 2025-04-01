const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("stageL", "root", "", 
{    
    dialect: "mysql",   
    host: "localhost"
})

sequelize.sync(() => {
    console.log('ok')
})
module.exports = sequelize

