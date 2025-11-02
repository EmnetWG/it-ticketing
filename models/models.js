const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
//const Department = require('../models/Department');

const models = {
  Category: require('../models/Category')(sequelize, Sequelize.DataTypes),
  User: require('../models/User')(sequelize, Sequelize.DataTypes),
  Ticket: require('../models/Ticket')(sequelize, Sequelize.DataTypes),
  Department: require('../models/Department')(sequelize, Sequelize.DataTypes),
  SubCategory: require('../models/SubCategory')(sequelize, Sequelize.DataTypes),
  // Add other models here
};

// Run associate if associations are defined
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
