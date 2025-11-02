const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const bcrypt = require('bcryptjs')
const Department = require('../models/Department')(sequelize, DataTypes);
const User = require('../models/User')(sequelize, DataTypes);
const Category = require('../models/Category')(sequelize, DataTypes);
const SubCategory = require('../models/SubCategory')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
const Ticket = sequelize.define('ticket', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },

    subject:{
        type:DataTypes.STRING,
        allowNull: true,
        
        
    },
    department: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{msg:'Please provide department'}
            },
        references:{
            model:Department,
            key:'id'
        }
    },
    location:{
        type:DataTypes.STRING,
        allowNull: true,
        
        
    },
    
    
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        }

    },
    category:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:{msg:'Please provide category'}
            },
        references:{
            model:Category,
            key:'id'
        }
    },
        subCategory:{
            type:DataTypes.INTEGER,
           
            references:{
                model:SubCategory,
                key:'id'
            },
        
        },
    approval:{
        type:DataTypes.ENUM,
        values:['approved', "not approved", 'pending'],
        defaultValue:'pending',
        
    },
    approvedBy:{
        type:DataTypes.INTEGER,
       
        references:{
            model:User,
            key:'id'
        }
       // required:false
    },
    assignedTo:{
        type:DataTypes.INTEGER,
       
        references:{
            model:User,
            key:'id'
        }
       // required:false
    },
    status:{
        type:DataTypes.ENUM,
        values:['pending', 'accepted', 'resolved'],
        allowNull:false,
        
        defaultValue:'pending'
    },
    ticketImage:{
        type:String, type:DataTypes.STRING,
       
        
        default:'public/upload/example.png'
    },
    remark:{
        type:DataTypes.STRING,
       
       
    }
}, {
    hooks:{
        beforeCreate:async function () {
            if (this.subCategory) {
              try {
                const check = await SubCategory.findByPk(this.subCategory);
                if (!check || JSON.stringify(check.category) !== JSON.stringify(this.category)) {
                  throw new Error('Check your Category and/or SubCategory');
                }
                
              } catch (error) {
                throw error;
              }
            }
            //next();
            return
          } 
}
}
)

Ticket.associate = function(models ) {
    Ticket.belongsTo(models.Category, {
        foreignKey: 'category',
        as:'list1'
})
    Ticket.belongsTo(models.SubCategory, {
        foreignKey: 'subCategory',
        as:'sub2'
    }
    )
    Ticket.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as:'createdByUser'
    })
    Ticket.belongsTo(models.User, {
        foreignKey: 'approvedBy',
        as:'approvedByUser'
    })
    Ticket.belongsTo(models.User, {
        foreignKey: 'assignedTo',
        as:'assignedToUser'
    })
    Ticket.belongsTo(models.Department, {
        foreignKey: 'department',
        as:'departmentTicket'
    })
    }
return Ticket
}
//module.exports = Ticket