const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-module', 'root', 'Mysql@123', {
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize;















