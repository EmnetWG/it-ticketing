const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const bcrypt = require('bcryptjs')
//const User = require('../models/User')(sequelize, DataTypes)


module.exports = (sequelize, DataTypes) => {
const Department = sequelize.define('department', {
name:{
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
        notNull:{msg:'Please provide department'},
    }

}})

Department.associate = function(models ) {
Department.hasMany(models.User, {
     foreignKey: 'department',
    as:'listDepartment'
}
)

Department.hasMany(models.Ticket, {
    foreignKey: 'department',
    as:'departmentTicket'
})
}

return Department
}
//module.exports = Department

//sequelize seed:generate --name department-seeder
//sequelize db:seed --seed 202408--