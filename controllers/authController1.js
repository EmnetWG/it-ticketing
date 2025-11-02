//const User = require('../models/User')
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const {createJWT, isValidToken} = require('../utils/jwt')
const {StatusCodes} = require('http-status-codes')
const models = require('../models/models');
//const {Sequelize, DataTypes } = require('sequelize');
//const sequelize = require('../config/sequelize')

 const register = async (req, res) => {
    // if(!req.body.name) {
    //   return  res.status(400).send({msg:"Some fields are missing"})
    // }
   
    const firstAccount = (await models.User.count({ })) === 0;
    console.log(firstAccount)
    const role = firstAccount ? 'supervisor': 'user'

    // const emailExist = await models.User.findOne({where:{email:req.body.email},
    //    include:[{model:models.Department, as:"list", attributes: [[Sequelize.col('name'), 'departmentName'],
   //         [Sequelize.col('id'), 'departmentid'],]}]})
   //  if(emailExist) {
   //  throw new BadRequestError("Email already exist")   
    // }
       // else {
        const userObject = {
            name:req.body.name,
            department:req.body.department,
            location:req.body.location,
            position:req.body.position,
            email:req.body.email,
            password:req.body.password,
            role:role
            
        }
//userObject.role=role
            

            const user = await models.User.create(userObject)
           // User.create(userObject).then(data => {
           // res.status(201).json({data})
           const tokenUser = {name: user.name, userId: user.id, role: user.role}
        
        const token = createJWT({payload:tokenUser})

    res.status(StatusCodes.CREATED).json({user:user, token})     
            
            
 }

 
 const login =async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError("Please provide email and password")
    } 
    const user = await models.User.findOne( {where:{email:req.body.email}})
        //res.send(data)
        if(!user) { 
            throw new UnauthenticatedError('Invalid Credentials')    
 }
    
 const isMatch = await user.comparePassword(password)
if(!isMatch){
    throw new UnauthenticatedError('Invalid Credentials')
}

const tokenUser = {name: user.name, userId: user.id, role: user.role}
const token = createJWT({payload:tokenUser})
//res.redirect('/dashboard')
 res.status(StatusCodes.OK).json({user:user, token})

 }

 module.exports = {
    register, login
 }