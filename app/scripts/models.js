var Sequelize = require('sequelize');
var sequelize = new Sequelize('bdgt', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'electron-invoice.db',
});

var Customer = sequelize.define('Customer', {
    name1: Sequelize.STRING,
    name2: Sequelize.STRING,
    street: Sequelize.STRING,
    city: Sequelize.STRING
});

sequelize.sync().then(function() {
  console.log("Database synchronized");
}).catch(function(error) {
  console.log(error);
})
