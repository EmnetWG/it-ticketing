const sequelize = require('../config/sequelize')
//const Department = require('../models/Department')
const {StatusCodes} = require('http-status-codes')
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const models = require('../models/models');

const createDepartment = async (req, res) => {
  

const departmentObject = {
    name:req.body.name
}
const department = await models.Department.create(departmentObject)

res.status(StatusCodes.CREATED).json({department})
//res.status(201).json({data})

//}).catch(error => {
//res.status(500).json({msg:error})
//})
}

const updateDepartment = async (req, res) => {
    
 const departments = req.body.name

if(!departments) {
    throw new BadRequestError('Please provide the value')
}

const data = await models.Department.findByPk(req.params.id)
if(!data) {
    throw new NotFoundError(`No department with id : ${req.params.id}`)
}
 const newData = {
     name:req.body.name
 }
 const department = await models.Department.update(newData, {where:{id:req.params.id}})
 if(!department) {
   throw new NotFoundError(`Invalid data`)
}


res.status(StatusCodes.OK).json({department})
 //res.send("Updated")
// res.status(201).json({newData})
 
 //}).catch(error => {
 //res.status(500).json({error:error})
 //})
 }

 const getSingleDepartment = async (req, res) => {
   
 
 const department = await models.Department.findByPk( req.params.id)
 //res.send(data)

 if(!department) {
   throw new NotFoundError(`No department with id : ${req.params.id}`)
}
res.status(StatusCodes.OK).json({department})
 
 }

 /*
 const deleteDepartment = async (req, res) => {
    // if(!req.body.name) {
    //   return  res.status(400).send({msg:"Some fields are missing"})
    // }
 //id:req.params
 
 const department = await models.Department.destroy( {where:{id:req.params.id}})
 //res.send("Deleted")
 if(!department) {
   throw new NotFoundError(`No department with id: ${req.params.id}`)
}
res.status(StatusCodes.OK).send();
 //res.status(201).json({message:"deleted"})
 
 
 }
*/

const deleteDepartment = async (req, res) => {
 const { id: departmentId } = req.params;

 // 1. Check if any user is assigned to this department
 const userExists = await models.User.findOne({ where: { department: departmentId } });

 if (userExists) {
 throw new BadRequestError('Cannot delete department. There are users assigned to this department.');
 }

 // 2. Attempt deletion
 const deleted = await models.Department.destroy({ where: { id: departmentId } });

 if (!deleted) {
 throw new NotFoundError(`No department found with id: ${departmentId}`);
 }

 res.status(StatusCodes.OK).json({ msg: 'Department deleted successfully.' });
};

const getAllDepartment = async (req, res) => {
  
   const departments = await models.Department.findAll()
   res.status(StatusCodes.OK).json({departments})
}


module.exports = {
    getAllDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getSingleDepartment
}