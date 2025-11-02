const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize')
//const bcrypt = require('bcryptjs')
//const User = require('./User')
const Category = require('../models/Category')(sequelize, DataTypes)
//const Ticket = require('../models/Ticket')(sequelize, DataTypes)

module.exports = (sequelize, DataTypes) => {
const SubCategory = sequelize.define('subcategory', {
name:{
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
        notNull:{msg:'Please provide sub category'},
    }
},
    category:{
        type:DataTypes.INTEGER,
        allowNull: false,
      validate:{
            notNull:{msg:'Please provide category'},
     }, 
        references:{
        model:Category,
        key:'id'
       }

    }

}

)

SubCategory.associate = function( models) {
SubCategory.belongsTo(models.Category, {
   // targetKey:'id',
    foreignKey:'category',
   as:"list"
}

)
        


SubCategory.hasMany(models.Ticket, {
    foreignKey: 'subCategory',
    as:"sub2"
}
)
}
return SubCategory
}

//module.exports = SubCategory