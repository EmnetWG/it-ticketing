const Category = require('../models/Category');
// const Ticket = require('../models/Ticket')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define('subcategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide sub category' },
      },
    },
    // Uncomment if category ID is part of the subcategory model
    // category: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notNull: { msg: 'Please provide category' },
    //   },
    //   references: {
    //     model: Category,
    //     key: 'id',
    //   },
    // },
  });

  SubCategory.associate = function(models) {
    SubCategory.belongsTo(models.Category, {
      foreignKey: 'category',
    });

    // Uncomment if you need the many-to-many relationship with Ticket
    // SubCategory.belongsToMany(models.Ticket, {
    //   foreignKey: {
    //     name: 'subCategory',
    //   },
    // });
  };

  return SubCategory;
};
