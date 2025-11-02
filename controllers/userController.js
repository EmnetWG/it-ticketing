
// const User = require('../models/User')
const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
//const Department = require('../models/Department')(sequelize, DataTypes)
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const {StatusCodes} = require('http-status-codes')
const models = require('../models/models');
//const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {createJWT} = require('../utils/jwt')


 const updateUser = async (req, res)=> {
     // if(!req.body.name) {
     //   return  res.status(400).send({msg:"Some fields are missing"})
     // }
  //id:req.params
  const {name, department, position, 
    email
    } = req.body
    if((!name) || (!department)
    || (!email))
    {
        throw new BadRequestError("Please provide all")
    }
  const newData = {
      name:req.body.name,
      department:req.body.department,
      position:req.body.position,
      email:req.body.email
  }

 const affectedRows = await models.User.update(newData, {where:{id:req.params.id}})
  //User.update(newData, {where:{id:req.params.id}}).then(()=> {
  //res.send("Updated")

  // If no rows were affected, that means the user was not found or no change occurred
        if (affectedRows === 0) {
            return res.status(404).json({ msg: "User not found or no changes made" });
        }

        // Retrieve the updated user from the database
        const updatedUser = await models.User.findByPk(req.params.id);


  const tokenUser = {name: updatedUser.name, userId: updatedUser.id, role: updatedUser.role}
const token = createJWT({payload:tokenUser})

// res.status(StatusCodes.OK).json({user})

// Respond with the updated user and the new token
        res.status(200).json({
            user: {
                name: updatedUser.name,
                department: updatedUser.department,
                position: updatedUser.position,
                email: updatedUser.email,
                role: updatedUser.role,
            },
            token
        });
  // res.status(201).json({newData})
  
 // }).catch(error => {
 // res.status(500).json({error:error})
 // })
  }
 
  const getSingleUser  = async (req, res) => {
     // if(!req.body.name) {
     //   return  res.status(400).send({msg:"Some fields are missing"})
     // }
  //id:req.params
  
 const user = await models.User.findOne( {where:{id:req.params.id}, include:[{model:models.Department, as:"listDepartment", attributes: [[Sequelize.col('name'), 'departmentName'],
  [Sequelize.col('id'), 'departmentid'],]}]})
  //res.send(data)

  if(!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`)
}
res.status(StatusCodes.OK).json({user})
  //res.status(201).json({data})
  
  
  }
 /*
  const deleteUser = async (req, res) => {
    
  
  const user = await models.User.destroy( {where:{id:req.params.id}})

  if(!user) {
   throw new NotFoundError(`No user with id: ${req.params.id}`)
}
  
  res.status(201).json({message:"deleted"})
  
  
  }
 


const deleteUser = async (req, res) => {
 
 const userId = String(req.params.id);
 const ticketCount = await models.Ticket.count({
 where: { createdBy: userId }
 });

 if (ticketCount > 0) {
 throw new BadRequestError(
 `User cannot be deleted because they have ${ticketCount} associated ticket(s).`
 );
 }
 const user = await models.User.destroy( {where:{id:req.params.id}})

 if(!user) {
throw new NotFoundError(`No user with id: ${req.params.id}`)
}

 res.status(201).json({message:"deleted"})
 
 
 }

*/



const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // 1 Check if user exists
    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found.' });
    }

    // 2 Prevent deletion if user is IT Manager
    if (user.role && user.role.toLowerCase() === 'supervisor') {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'Cannot delete Supervisor account.' });
    }

    // 3 Check if user has any related tickets
    const userTickets = await models.Ticket.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { createdBy: userId },
          { assignedTo: userId },
        ],
      },
    });

    if (userTickets) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Cannot delete user. This user is linked to existing tickets.',
      });
    }

    // 4 Proceed with deletion if checks pass
    const deleted = await models.User.destroy({ where: { id: userId } });

    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'User not found or already deleted.' });
    }

    return res
      .status(StatusCodes.OK)
      .json({ msg: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error.' });
  }
};

//////////////////////



  
 const getAllUsers = async (req, res) => {
   
    const { search, role } = req.query;
    const queryObject = {
        
      };
    if (search) {
       // queryObject.name = { $regex: search, $options: 'i' };
       queryObject.name={ [Op.like]: `%${search}%` }


      }

      if (role) {
        queryObject.role = role;
      }

       const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

      let users = await models.User.findAll({where:queryObject, order: [
        ['createdAt', 'ASC']],
        offset:skip,
        limit:limitn,  
        include:[{model:models.Department, as:"listDepartment", attributes: [[Sequelize.col('name'), 'departmentName'],
          [Sequelize.col('id'), 'departmentid']],}]});
     

  //result = result.skip(skip).limit(limit); 'DESC

 // const users = await result.sort('-createdAt');

  const totalUsers = await models.User.count({where:queryObject});
  const numOfPages = Math.ceil(totalUsers / limitn);

  res.status(StatusCodes.OK).json({ users, totalUsers, numOfPages });

    // User.findAll().then(data => {
        // res.send(data)
        // res.status(201).json({data})
         
        // }).catch(error => {
         //    res.status(500).json({error:error})
        // })
 }
 
 const updateRole = async (req, res) => {
    //const {id:userId} = req.params
    const {role} = req.body
    if(!role) {
        throw new BadRequestError("Please provide the value")
    }
    const user = await models.User.findOne({where:{id:req.params.id}})
    const newData ={
    role:role
    }
    const useru = await models.User.update(newData, {where:{id:req.params.id}})
    //await user.save()
    res.status(StatusCodes.OK).json({msg: "Update is successful"})

}

const getITStaffs = async (req, res) => {
    const users = await models.User.findAll({where:{role:'IT staff'}, include:[{model:models.Department, as:"listDepartment", attributes: [[Sequelize.col('name'), 'departmentName'],
      [Sequelize.col('id'), 'departmentid']],}] })
    res.status(StatusCodes.OK).json({users}) 
}

const showCurrentUser = async (req, res) => {
   // const user=req.user
   // const {id:userID} = user._id
    res.status(StatusCodes.OK).json({ user:req.user });
  };

  const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword) {
        throw new BadRequestError("Please provide all values")
    }
    const user = await models.User.findOne({where:{id:req.user.userId}})
    const isCorrect = await user.comparePassword(oldPassword)
    
    if(!isCorrect) {
throw new UnauthenticatedError("Invalid Credentials")
    }

    //const newData ={
    //    password:newPassword
      //  }
     //   const useru = await models.User.update(newData, {where:{id:req.user.userId}})
    user.password = newPassword
   await user.save()
    res.status(StatusCodes.OK).json({msg: "Update is successful"})

}


const resetPassword = async (req, res) => {
	
	const newPassword = "1234"
const user = await models.User.findOne({where:{id:req.params.id}})

if(!user){
	throw new NotFoundError(`No user with id: ${req.params.id}`)
}

user.password = newPassword
await user.save()
res.status(StatusCodes.OK).json({msg:"Update is successful"})
}

 module.exports = {
     getAllUsers,
     updateUser,
     deleteUser,
     getSingleUser,
     updatePassword,
     updateRole,
     getITStaffs,
     showCurrentUser,
	 resetPassword
 }