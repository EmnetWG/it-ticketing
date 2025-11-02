const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const bcrypt = require('bcryptjs')
const Department = require('../models/Department')(sequelize, DataTypes)

module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('user', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },

    name:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{msg:'Please provide name'},
            min:3,
            max:50,
           // msg:"The character length must be between 3 and 50"
        }
        
    },
    department: {
        type:DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{msg:'Please provide department'}
            },
        reference:{
            model:Department,
            key:'id'
        }
    },
    position:
    {
        type:DataTypes.STRING
    },
    location:
    {
        type:DataTypes.STRING
    },
    email:
    {
        type:DataTypes.STRING,
        allowNull: false,
        unique:true,
        // args: true,
      //msg: 'Email address already in use!'
      //  },
        validate:{
            
                notNull:{msg:'Please provide email'},
            isEmail:{
          args:true,
            msg:"Please provide valid email"
        }
    }
},
    role:
    {
        type:DataTypes.ENUM,
        values:['user', 'manager', 'IT staff', 'supervisor'],
        defaultValue:'user'
        //console.log(Model.rawAttributes.states.values);
},
password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{msg:'Please provide password'},
        min:3
    }
}}, {
hooks:{
    beforeCreate: async function (user ) {
    
        if(!user.changed('password')) return
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

    },
    beforeUpdate: async function (user) {
    
        if(!user.changed('password')) return
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

    }

},
instanceMethods:{
    comparePassword:async function (candidatePassword)  {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    }
    }
});

User.associate = function(models) {
User.belongsTo(models.Department, {
    foreignKey: 'department',
    as:'list'
})
User.hasMany(models.Ticket, {
    foreignKey: 'createdBy'
})
}
User.prototype.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

return User
}
//module.exports = User
