//const {Sequelize, DataTypes} = require('sequelize');
//const sequelize = require('../config/sequelize')
//const bcrypt = require('bcryptjs')
//const User = require('./User')
//const Ticket = require('./Ticket')(sequelize, DataTypes)
//const SubCategory = require('./SubCategory')(sequelize, DataTypes);
// const models = require('../models/')

module.exports = (sequelize, DataTypes) => {
const Category = sequelize.define('category', {
name:{
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
        notNull:{msg:'Please provide category'},
    }

}})

Category.associate = function(models ) {
Category.hasMany(models.Ticket, {
    foreignKey: 'category',
    as:'list1'
})
Category.hasMany(models.SubCategory, {
    foreignKey:'category',
   as:"list"
}
)
}

return Category
}
//module.exports = Category