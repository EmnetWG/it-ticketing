const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcryptjs');
const Department = require('../models/Department')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide name' },
        len: { args: [3, 50], msg: 'Name must be between 3 and 50 characters' },
      },
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide department' },
      },
      references: {
        model: Department,
        key: 'id',
      },
    },
    position: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Please provide email' },
        isEmail: { args: true, msg: 'Please provide a valid email' },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'manager', 'IT staff', 'supervisor'],
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide password' },
        len: { args: [3, 100], msg: 'Password must be at least 3 characters' },
      },
    },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Correct instance method for comparing passwords
  User.prototype.comparePassword = async function(candidatePassword) {
    if (!candidatePassword) {
      throw new Error('Password is undefined or not provided');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  
  

  User.associate = function(models) {
    User.belongsTo(models.Department, {
      foreignKey: 'department',
      as: 'listDepartment',
    });
    User.hasMany(models.Ticket, {
      foreignKey: 'createdBy',
      as:'createdByUser'
    });
    User.hasMany(models.Ticket, {
      foreignKey: 'approvedBy',
      as:'approvededByUser'
    });
    User.hasMany(models.Ticket, {
      foreignKey: 'assignedTo',
      as:'assignedToUser'
    });
  };

  return User;
};
