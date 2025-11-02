const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcryptjs');  // Uncomment if needed
const Department = require('./Department');
const User = require('./User');
const Category = require('./Category')(sequelize, DataTypes);
const SubCategory = require('./SubCategory')(sequelize, DataTypes);

const Ticket = sequelize.define('ticket', {
    subject: {
        type: DataTypes.STRING,
        allowNull: true,
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
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Please provide category' },
        },
        references: {
            model: Category,
            key: 'id',
        },
    },
    subCategory: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: 'id',
        },
    },
    approval: {
        type: DataTypes.ENUM,
        values: ['approved', 'not approved', 'pending'],
        defaultValue: 'pending',
    },
    approvedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'accepted', 'resolved'],
        allowNull: false,
        defaultValue: 'pending',
    },
    ticketImage: {
        type: DataTypes.STRING,
        defaultValue: 'public/upload/example.png',
    },
    remark: {
        type: DataTypes.STRING,
    },
}, {
    hooks: {
        beforeCreate: async function (ticket, options) {
            if (ticket.subCategory) {
                const subCategory = await SubCategory.findByPk(ticket.subCategory);
                if (!subCategory || subCategory.category !== ticket.category) {
                    throw new Error('Check your Category and/or SubCategory');
                }
            }
        },
    },
});

Ticket.associate = function (models) {
    Ticket.belongsTo(models.Category, {
        foreignKey: 'category',
        as: 'categoryDetails',
    });
    Ticket.belongsTo(models.SubCategory, {
        foreignKey: 'subCategory',
        as: 'subCategoryDetails',
    });
    Ticket.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
    });
    Ticket.belongsTo(models.User, {
        foreignKey: 'approvedBy',
        as: 'approver',
    });
    Ticket.belongsTo(models.User, {
        foreignKey: 'assignedTo',
        as: 'assignee',
    });
};

module.exports = Ticket;
