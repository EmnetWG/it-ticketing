const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
// const bcrypt = require('bcryptjs');  // Uncomment if you need bcrypt
// const User = require('./User');     // Uncomment if you need User model
// const Ticket = require('./Ticket')(sequelize, DataTypes); // Uncomment if you need Ticket model
// const models = require('../models/');

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide category' },
      },
    },
  });

  Category.associate = function(models) {
    Category.hasMany(models.SubCategory, {
      foreignKey: 'categoryId', // Adjust foreign key if needed
      as: 'subCategories', // Alias for better readability
    });

    // Uncomment and configure if necessary
    // Category.belongsToMany(models.Ticket, {
    //   through: 'CategoryTickets',
    //   foreignKey: 'categoryId',
    //   otherKey: 'ticketId',
    // });
  };

  return Category;
};
