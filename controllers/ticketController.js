//const Ticket = require('../models/Ticket')
// const User = require('../models/User')
const {Sequelize, DataTypes,  Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/sequelize')
//const { Op, fn, col, literal } = require('sequelize');
//const moment = require('moment');

//const Category = require('../models/Category')
//const SubCategory = require('../models/SubCategory')

const {StatusCodes} = require('http-status-codes')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated') 
const NotFoundError = require('../errors/not-found')
const moment = require('moment')
const models = require('../models/models');

const getAllTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

    const tickets = await models.Ticket.findAll({ order: [
      ['createdAt', 'DESC']], offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]});
   
      
    //.populate('category', { name: 1, _id:1})
   // .populate('createdBy', {name:1, _id:1})
   // .populate('approvedBy', {name:1, _id:1})
    //.populate('assignedTo', {name:1, _id:1})
    //.populate('subCategory', { name: 1, _id:1})
    //.skip(skip).limit(limit)
   // const ticketCategory = tickets.category
    //console.log(ticketCategory)
    //const categorys = await Category.find({_id:ticketCategory})
    //console.log(categorys.name)
    //tickets.category = categorys.name
    const totalTickets = await models.Ticket.count({});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages, limitn})
}

const getAllApprovedTickets = async (req, res) => {

  const page = Number(req.query.page) || 1;
const limitn = Number(req.query.limit) || 20;
const skip = (page - 1) * limitn;

  const tickets = await models.Ticket.findAll({where:{approval:'approved'},
    order: [
      ['createdAt', 'DESC']], 
    offset:skip,
    limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
      [Sequelize.col('id'), 'categoryid']],},
      {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
        [Sequelize.col('id'), 'subCategoryid']],},
        {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
          [Sequelize.col('id'), 'createdById']],},
          {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
            [Sequelize.col('id'), 'approvedById']],},
            {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
              [Sequelize.col('id'), 'assignedToId']],},
              {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                [Sequelize.col('id'), 'departmentId']],}]})
    
  
  const totalTickets = await models.Ticket.count({where:{approval:'approved'}});
const numOfPages = Math.ceil(totalTickets / limitn);

  res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}


const getAllPendingTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

 // const tickets = await models.Ticket.findAll({where:{status:'pending', approval:'approved'},
    const tickets = await models.Ticket.findAll({where:{status:'pending'},
      order: [
        ['createdAt', 'DESC']], 
      offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]})
      
   // const totalTickets = await models.Ticket.count({where:{status:'pending', approval:'approved'}});
    const totalTickets = await models.Ticket.count({where:{status:'pending'}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}


const getAllAcceptedTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

   // const tickets = await models.Ticket.findAll({where:{status:"accepted", approval:"approved"},
    const tickets = await models.Ticket.findAll({where:{status:"accepted"},
      order: [
        ['createdAt', 'DESC']],
    offset:skip,
    limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
      [Sequelize.col('id'), 'categoryid']],},
      {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
        [Sequelize.col('id'), 'subCategoryid']],},
        {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
          [Sequelize.col('id'), 'createdById']],},
          {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
            [Sequelize.col('id'), 'approvedById']],},
            {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
              [Sequelize.col('id'), 'assignedToId']],},
              {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                [Sequelize.col('id'), 'departmentId']],}]
    })

    // const totalTickets = await models.Ticket.count({where:{status:'accepted', approval:'approved'}});
    const totalTickets = await models.Ticket.count({where:{status:'accepted'}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}


const getAllResolvedTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

   // const tickets = await models.Ticket.findAll({where:{status:"resolved", approval:"approved"},
    const tickets = await models.Ticket.findAll({where:{status:"resolved"},
      order: [
        ['createdAt', 'DESC']],
    offset:skip,
    limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
      [Sequelize.col('id'), 'categoryid']],},
      {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
        [Sequelize.col('id'), 'subCategoryid']],},
        {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
          [Sequelize.col('id'), 'createdById']],},
          {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
            [Sequelize.col('id'), 'approvedById']],},
            {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
              [Sequelize.col('id'), 'assignedToId']],},
              {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                [Sequelize.col('id'), 'departmentId']],}]
    })
    
   // const totalTickets = await models.Ticket.count({where:{status:'resolved', approval:'approved'}});
    const totalTickets = await models.Ticket.count({where:{status:'resolved'}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}


const getRequestedTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

  const tickets = await models.Ticket.findAll({where:{createdBy:req.user.userId},
    order: [
      ['createdAt', 'DESC']],
    offset:skip,
    limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
      [Sequelize.col('id'), 'categoryid']],},
      {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
        [Sequelize.col('id'), 'subCategoryid']],},
        {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
          [Sequelize.col('id'), 'createdById']],},
          {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
            [Sequelize.col('id'), 'approvedById']],},
            {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
              [Sequelize.col('id'), 'assignedToId']],},
              {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                [Sequelize.col('id'), 'departmentId']],}]
  })
  

  const totalTickets = await models.Ticket.count({where:{createdBy:req.user.userId}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}

const getPendingDepartmentTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

    const userID = req.user.userId
  
    const currentUser = await models.User.findOne({where:{id:userID}})
      const currentDepartment = currentUser.department
  
  
      const tickets = await models.Ticket.findAll({where:{department:currentDepartment, status:'pending'},
        order: [
          ['createdAt', 'DESC']],
        offset:skip,
        limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
          [Sequelize.col('id'), 'categoryid']],},
          {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
            [Sequelize.col('id'), 'subCategoryid']],},
            {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
              [Sequelize.col('id'), 'createdById']],},
              {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
                [Sequelize.col('id'), 'approvedById']],},
                {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                  [Sequelize.col('id'), 'assignedToId']],},
                  {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                    [Sequelize.col('id'), 'departmentId']],}]
      })
   
    const totalTickets = await models.Ticket.count({where:{status:'pending', department:currentDepartment}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
  }

  const getAcceptedDepartmentTickets = async (req, res) => {

    const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

    const userID = req.user.userId
  
    const currentUser = await models.User.findOne({where:{id:userID}})
      const currentDepartment = currentUser.department
  
  
      const tickets = await models.Ticket.findAll({where:{department:currentDepartment, status:'accepted'},
        order: [
          ['createdAt', 'DESC']],
        offset:skip,
        limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
          [Sequelize.col('id'), 'categoryid']],},
          {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
            [Sequelize.col('id'), 'subCategoryid']],},
            {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
              [Sequelize.col('id'), 'createdById']],},
              {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
                [Sequelize.col('id'), 'approvedById']],},
                {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                  [Sequelize.col('id'), 'assignedToId']],},
                  {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                    [Sequelize.col('id'), 'departmentId']],}]
      })
      
   
    const totalTickets = await models.Ticket.count({where:{status:'accepted', department:currentDepartment}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
  }

const getDepartmentTickets = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;
  
  const userID = req.user.userId

  const currentUser = await models.User.findOne({where:{id:userID}})
  //console.log(currentUser)
    const currentDepartment = currentUser.department


    const tickets = await models.Ticket.findAll({where:{department:currentDepartment},
      order: [
        ['createdAt', 'DESC']],
      offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]
    })

    const totalTickets = await models.Ticket.count({where:{ department:currentDepartment}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}

const getAssignedTickets = async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

    const userID = req.user.userId
    //const{assignedID} = req.params.assignedTicket
    console.log(userID)
    const tickets = await models.Ticket.findAll({where:{assignedTo:userID},
      order: [
        ['createdAt', 'DESC']],
      offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]
    })

    const totalTickets = await models.Ticket.count({where:{assignedTo:userID}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})
}

const getPendingAssignedTickets = async(req, res) => {
    const page = Number(req.query.page) || 1;
    const limitn = Number(req.query.limit) || 20;
    const skip = (page - 1) * limitn;

    const userID = req.user.userId
    //const{assignedID} = req.params.assignedTicket
    console.log(userID)
    const tickets = await models.Ticket.findAll({where:{assignedTo:userID, status:'pending'},
      order: [
        ['createdAt', 'DESC']],
      offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]
    })

    
    const totalTickets = await models.Ticket.count({where:{assignedTo:userID, status:'pending'}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})


}

const getAcceptedAssignedTickets = async(req, res) => {
    const page = Number(req.query.page) || 1;
    const limitn = Number(req.query.limit) || 20;
    const skip = (page - 1) * limitn;

    const userID = req.user.userId
    //const{assignedID} = req.params.assignedTicket
    console.log(userID)
    const tickets = await models.Ticket.findAll({where:{assignedTo:userID, status:'accepted'},
      order: [
        ['createdAt', 'DESC']],
      offset:skip,
      limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]
    })
    const totalTickets = await models.Ticket.count({where:{assignedTo:userID, status:'accepted'}});
  const numOfPages = Math.ceil(totalTickets / limitn);

    res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})


}


const getResolvedAssignedTickets = async(req, res) => {
  const page = Number(req.query.page) || 1;
  const limitn = Number(req.query.limit) || 20;
  const skip = (page - 1) * limitn;

  const userID = req.user.userId
  //const{assignedID} = req.params.assignedTicket
  console.log(userID)
  const tickets = await models.Ticket.findAll({where:{assignedTo:userID, status:'resolved'},
    order: [
      ['createdAt', 'DESC']],
    offset:skip,
    limit:limitn,  include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
      [Sequelize.col('id'), 'categoryid']],},
      {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
        [Sequelize.col('id'), 'subCategoryid']],},
        {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
          [Sequelize.col('id'), 'createdById']],},
          {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
            [Sequelize.col('id'), 'approvedById']],},
            {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
              [Sequelize.col('id'), 'assignedToId']],},
              {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                [Sequelize.col('id'), 'departmentId']],}]
  })
  const totalTickets = await models.Ticket.count({where:{assignedTo:userID, status:'resolved'}});
const numOfPages = Math.ceil(totalTickets / limitn);

  res.status(StatusCodes.OK).json({tickets, totalTickets, numOfPages})


}

const getSingleTicket = async (req, res) => {

  
    const{id:ticketId} = req.params
    const ticket = await models.Ticket.findOne({where:{id:ticketId},
        include:[{model:models.Category, as:"list1", attributes: [[Sequelize.col('name'), 'categoryName'],
        [Sequelize.col('id'), 'categoryid']],},
        {model:models.SubCategory, as:"sub2", attributes: [[Sequelize.col('name'), 'subCategoryName'],
          [Sequelize.col('id'), 'subCategoryid']],},
          {model:models.User, as:"createdByUser", attributes: [[Sequelize.col('name'), 'createdBy'],
            [Sequelize.col('id'), 'createdById']],},
            {model:models.User, as:"approvedByUser", attributes: [[Sequelize.col('name'), 'approvedBy'],
              [Sequelize.col('id'), 'approvedById']],},
              {model:models.User, as:"assignedToUser", attributes: [[Sequelize.col('name'), 'assignedTo'],
                [Sequelize.col('id'), 'assignedToId']],},
                {model:models.Department, as:"departmentTicket", attributes: [[Sequelize.col('name'), 'department'],
                  [Sequelize.col('id'), 'departmentId']],}]
                }) 

    if(!ticket) {
        throw new NotFoundError(`No ticket with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({ticket})
}

const createTicket = async (req, res) => {
    req.body.createdBy = req.user.userId
    const userDepartment = await models.User.findOne({where:{id:req.user.userId}})
    req.body.department=userDepartment.department
    const ticket = await models.Ticket.create(req.body)
    res.status(StatusCodes.CREATED).json({ticket})

}

const updateTicket = async (req, res) => {
    const{id:ticketId} = req.params
    const userID = req.user.userId

const {subject, category, subCategory, 
    location
} = req.body

const ticketCategory = await models.Category.findOne({where:{name:category}})
const categoryid = ticketCategory.id
 

if(!category) {
    throw new BadRequestError('Please provide all values')
}

//const ticket = await Ticket.findByIdAndUpdate({_id:ticketId, createdBy:userID},
 //   req.body,
 //   { new: true, runValidators: true} )
 const ticket = await models.Ticket.findOne({where:{id:ticketId, createdBy:userID}})
  ticket.subject = subject
  //ticket.department = department
  ticket.location = location
    ticket.category = categoryid
    ticket.subCategory=null
    /*
    if(subCategory) {
      const ticketSubCategory = await models.SubCategory.findOne({where:{name:subCategory}})
const subCategoryid = ticketSubCategory.id
ticket.subCategory=subCategoryid
    }
    else {
      ticket.subCategory=null
    }
*/
if(!ticket) {
    throw new NotFoundError(`No ticket with id : ${req.params.id}`)
}

await ticket.save() 
res.status(StatusCodes.OK).json({ticket})

}

//update status and remark
const updateStatus = async (req, res) => {
const {id:ticketId}= req.params
const {status, remark, subCategory} = req.body

const ticket= await models.Ticket.findOne({where:{id:ticketId}})
    if(!ticket) {
        throw new NotFoundError(`No ticket with id : ${req.params.id}`)
    }
    
  ticket.status = status
  ticket.remark = remark
  ticket.subCategory = subCategory
  await ticket.save()  
    res.status(StatusCodes.OK).json({ticket})

}

const assignTicket = async (req, res) => {
    const {id:ticketId}= req.params
    let {assignedTo} = req.body
    //console.log(req.body)
    const ticket= await models.Ticket.findOne({where:{id:ticketId}})
        if(!ticket) {
            throw new NotFoundError(`No ticket with id : ${req.params.id}`)
        }
       const user = await models.User.findOne({where:{id:assignedTo}})
       //console.log(user)
       assignedUser = user.id
        ticket.assignedTo = assignedUser
        ticket.status = "pending"
     
      await ticket.save()  
        res.status(StatusCodes.OK).json({ticket})
    
    }

const updateApproval = async (req, res) => {
   // const {id:ticketId}= req.params
    const {approval, location, category, subject} = req.body
    const userID = req.user.userId
    console.log(userID)
    const ticket= await models.Ticket.findOne({where:{id:req.params.id}})
        if(!ticket) {
            throw new NotFoundError(`No ticket with id : ${req.params.id}`)
        }
        
      ticket.approval = approval
      ticket.approvedBy = userID
      if(ticket.createdBy == userID){
        ticket.subject=subject
        ticket.category=category
        ticket.location=location
       
          ticket.subCategory=null
        
      }
      await ticket.save()  
        res.status(StatusCodes.OK).json({ticket})
    
    }

    const updateRemark = async (req, res) => {
        const {id:ticketId}= req.params
        const {remark} = req.body
        
        const ticket= await models.Ticket.findOne({where:{id:ticketId}})
            if(!ticket) {
                throw new NotFoundError(`No ticket with id : ${req.params.id}`)
            }
            
          ticket.remark = remark
          
          await ticket.save()  
            res.status(StatusCodes.OK).json({ticket})
        
        }

const deleteTicket = async (req, res) => {
    const{id:ticketId} = req.params
   // const {userID} = req.user.userId
    const ticket = await models.Ticket.destroy({where:{id:ticketId, createdBy:req.user.userId}})

    if(!ticket) {
        throw new NotFoundError(`No ticket with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).send();
}

const uploadImage = async (req, res) => {
    if (!req.files) {
      throw new CustomError.BadRequestError('No File Uploaded');
    }
    const ticketImage = req.files.image;
  
    if (!ticketImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please Upload Image');
    }
  
    const maxSize = 1024 * 1024;
  
    if (ticketImage.size > maxSize) {
      throw new CustomError.BadRequestError(
        'Please upload image smaller than 2MB'
      );
    }
  
    const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${ticketImage.name}`
    );
    await mage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${ticketImage.name}` });
  };

  //const userID = req.user.userId

  const showAssignedStaffStats = async (req, res) => {
    const userID = req.user.userId

//const currentUser = await models.User.findOne({where:{id:userID}})
//console.log(currentUser)
 // const currentDepartment = currentUser.department
    // Step 1: Get Stats
    let stats = await models.Ticket.findAll({
      where: { assignedTo:userID },
      attributes: ['status', [fn('COUNT', col('status')), 'count']],
      group: ['status']
    });
  
    // Convert the stats to a more usable format
    stats = stats.reduce((acc, curr) => {
      const { status, count } = curr.dataValues;
      acc[status] = count;
      return acc;
    }, {});
  
    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      resolved: stats.resolved || 0,
    };
    res.status(StatusCodes.OK).json({ defaultStats})
  
  }  


    const showDepartmentStats = async (req, res) => {
      const userID = req.user.userId

  const currentUser = await models.User.findOne({where:{id:userID}})
  //console.log(currentUser)
    const currentDepartment = currentUser.department
      // Step 1: Get Stats
      let stats = await models.Ticket.findAll({
        where: { department:currentDepartment },
        attributes: ['status', [fn('COUNT', col('status')), 'count']],
        group: ['status']
      });
    
      // Convert the stats to a more usable format
      stats = stats.reduce((acc, curr) => {
        const { status, count } = curr.dataValues;
        acc[status] = count;
        return acc;
      }, {});
    
      const defaultStats = {
        pending: stats.pending || 0,
        accepted: stats.accepted || 0,
        resolved: stats.resolved || 0,
      };
      res.status(StatusCodes.OK).json({ defaultStats})
    
    }  


  const showApprovedStats = async (req, res) => {
    // Step 1: Get Stats
    let stats = await models.Ticket.findAll({
      where: { approval: 'approved' },
      attributes: ['status', [fn('COUNT', col('status')), 'count']],
      group: ['status']
    });
  
    // Convert the stats to a more usable format
    stats = stats.reduce((acc, curr) => {
      const { status, count } = curr.dataValues;
      acc[status] = count;
      return acc;
    }, {});
  
    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      resolved: stats.resolved || 0,
    };
    res.status(StatusCodes.OK).json({ defaultStats})
  
  }  


const showAllStats = async (req, res) => {
  try {
    // Step 1: Get Stats for total counts of pending, accepted, and resolved
    let stats = await models.Ticket.findAll({
      attributes: ['status', [fn('COUNT', col('status')), 'count']],
      group: ['status']
    });

    stats = stats.reduce((acc, curr) => {
      const { status, count } = curr.dataValues;
      acc[status] = count;
      return acc;
    }, {});

    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      resolved: stats.resolved || 0,
    };

    // Step 2: Handle Monthly Stats with Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;  // Adjust limit as needed
    const offset = (page - 1) * limit;

    // Monthly Applications Aggregation with Pagination
    const monthlyApplications = await models.Ticket.findAll({
      where: { status: 'resolved' },
      attributes: [
        [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
        [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
        [literal('COUNT(*)'), 'count'],
      ],
      include: [
        {
          model: models.Category,
          attributes: ['name', 'id'],
          as: 'list1',
        }
      ],
      group: [
        literal('YEAR(`Ticket`.`createdAt`)'),
        literal('MONTH(`Ticket`.`createdAt`)'),
        'list1.name',
        'list1.id'
      ],
      order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']],
      offset: offset,  // Apply pagination offset
      limit: limit,    // Apply pagination limit
    });

    // Map the results to the desired format
    const formattedMonthlyApplications = monthlyApplications.map((item) => {
      const { year, month, count } = item.dataValues;
      const category = item.list1.name;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, category, count };
    }).reverse();

    // Get total count of monthly applications to handle pagination on the frontend
    const totalMonthlyApplications = await models.Ticket.findAll({
      where: { status: 'resolved' },
      attributes: [
        [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
        [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
        [literal('COUNT(*)'), 'count'],
      ],
      include: [
        {
          model: models.Category,
          attributes: ['name', 'id'],
          as: 'list1',
        }
      ],
      group: [
        literal('YEAR(`Ticket`.`createdAt`)'),
        literal('MONTH(`Ticket`.`createdAt`)'),
        'list1.name',
        'list1.id'
      ],
    });

    const totalMonthlyCount = totalMonthlyApplications.length;
    const totalPages = Math.ceil(totalMonthlyCount / limit)

    // Send response with the stats and paginated monthly applications
    res.status(StatusCodes.OK).json({
      defaultStats,
      monthlyApplications: formattedMonthlyApplications,
      totalPages,  // Total count for pagination
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching stats' });
  }
};


/*
const showAllStats = async (req, res) => {
  // Step 1: Get Stats
  let stats = await models.Ticket.findAll({
    attributes: ['status', [fn('COUNT', col('status')), 'count']],
    group: ['status']
  });

  // Convert the stats to a more usable format
  stats = stats.reduce((acc, curr) => {
    const { status, count } = curr.dataValues;
     acc[status] = count;
// acc[status] = parseInt(count, 10) || 0; 
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    accepted: stats.accepted || 0,
    resolved: stats.resolved || 0,
  };

  // Step 2: Monthly Applications Aggregation
  const monthlyApplications = await models.Ticket.findAll({
    where: { status: 'resolved' },
    attributes: [
      [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
      [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
      [literal('COUNT(*)'), 'count'],
    ],
    include: [
      {
        model: models.Category,
        attributes: ['name', 'id'],
        as: 'list1'
      }
    ],
    //group: ['year', 'month', 'list1.name'],
    //order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']]
//SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    group: [
      literal('YEAR(`Ticket`.`createdAt`)'),
      literal('MONTH(`Ticket`.`createdAt`)'),
      'list1.name',
      'list1.id'   // Add list1.id here
    
    ],
    order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']]
  });

  // Map the results to the desired format
  const formattedMonthlyApplications = monthlyApplications.map((item) => {
    const { year, month, count } = item.dataValues;
    const category = item.list1.name;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM Y');
    return { date, category, count };
  }).reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications: formattedMonthlyApplications });
};

*/
/////
const showStaffStats = async (req, res) => {
  try {
    // Step 1: Get Stats
    let stats = await models.Ticket.findAll({
      where: { assignedTo: req.user.userId },
      attributes: [
        'status',
        [fn('COUNT', col('status')), 'count']
      ],
      group: ['status']
    });

    // Convert the stats to a more usable format
    stats = stats.reduce((acc, curr) => {
      const { status, count } = curr.dataValues;
      acc[status] = count;
      return acc;
    }, {});

    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      resolved: stats.resolved || 0,
    };

    // Step 2: Monthly Applications Aggregation
 const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;  // Adjust limit as needed
    const offset = (page - 1) * limit;

    const monthlyApplications = await models.Ticket.findAll({
      where: { status: 'resolved', assignedTo: req.user.userId },
      attributes: [
        [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
        [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
        [literal('COUNT(*)'), 'count'],
      ],
      include: [
        {
          model: models.Category,
          attributes: ['name', 'id'],
          as: 'list1'
        }
      ],
      group: [
        literal('YEAR(`Ticket`.`createdAt`)'),
        literal('MONTH(`Ticket`.`createdAt`)'),
        'list1.name',
        
      'list1.id'
      
      ],
      order: [
        [literal('year'), 'DESC'],
        [literal('month'), 'DESC'],
        
        
      ],
       offset: offset,  // Apply pagination offset
      limit: limit,    // Apply pagination limit
    });

    // Map the results to the desired format
    const formattedMonthlyApplications = monthlyApplications.map((item) => {
      const { year, month, count } = item.dataValues;
      const category = item.list1.name;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, category, count };
    }).reverse();

    // Get total count of monthly applications to handle pagination on the frontend
    const totalMonthlyApplications = await models.Ticket.findAll({
      where: { status: 'resolved', assignedTo: req.user.userId },
      attributes: [
        [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
        [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
        [literal('COUNT(*)'), 'count'],
      ],
      include: [
        {
          model: models.Category,
          attributes: ['name', 'id'],
          as: 'list1',
        }
      ],
      group: [
        literal('YEAR(`Ticket`.`createdAt`)'),
        literal('MONTH(`Ticket`.`createdAt`)'),
        'list1.name',
        'list1.id'
      ],
    });

    const totalMonthlyCount = totalMonthlyApplications.length;
    const totalPages = Math.ceil(totalMonthlyCount / limit)

    // Send response with the stats and paginated monthly applications
    res.status(StatusCodes.OK).json({
      defaultStats,
      monthlyApplications: formattedMonthlyApplications,
      totalPages,  // Total count for pagination
    });

   // res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications: formattedMonthlyApplications });

  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching stats.' });
  }
};



////StaffStats
  
///
const showStaffDetail = async (req, res) => {
  

  // Step 1: Get Stats
  let stats = await models.Ticket.findAll({where:{assignedTo:req.params.id},
    attributes: ['status', [fn('COUNT', col('status')), 'count']],
    group: ['status']
  });


  // Convert the stats to a more usable format
  stats = stats.reduce((acc, curr) => {
    const { status, count } = curr.dataValues;
    acc[status] = count;
    return acc;
  }, {});
 
 
  const defaultStats = {
    pending: stats.pending || 0,
    accepted: stats.accepted || 0,
    resolved: stats.resolved || 0,
  };

// Step 2: Monthly Applications Aggregation

const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;  // Adjust limit as needed
    const offset = (page - 1) * limit;

const monthlyApplications = await models.Ticket.findAll({
  where: { status: 'resolved', assignedTo:req.params.id },
  attributes: [
    [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
    [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
    [literal('COUNT(*)'), 'count'],
  ],
  include: [
    {
      model: models.Category,
      attributes: ['name', 'id'],
      as: 'list1'
    }
  ],
  //group: ['year', 'month', 'list1.name'],
  //order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']]
//SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

  group: [
    literal('YEAR(`Ticket`.`createdAt`)'),
    literal('MONTH(`Ticket`.`createdAt`)'),
    'list1.name',
    
      'list1.id'
  ],
  order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']],
   offset: offset,  // Apply pagination offset
      limit: limit, 
});

// Map the results to the desired format
const formattedMonthlyApplications = monthlyApplications.map((item) => {
  const { year, month, count } = item.dataValues;
  const category = item.list1.name;
  const date = moment()
    .month(month - 1)
    .year(year)
    .format('MMM Y');
  return { date, category, count };
}).reverse();

// Get total count of monthly applications to handle pagination on the frontend
    const totalMonthlyApplications = await models.Ticket.findAll({
      where: { status: 'resolved', assignedTo:req.params.id },
      attributes: [
        [literal('YEAR(`Ticket`.`createdAt`)'), 'year'],
        [literal('MONTH(`Ticket`.`createdAt`)'), 'month'],
        [literal('COUNT(*)'), 'count'],
      ],
      include: [
        {
          model: models.Category,
          attributes: ['name', 'id'],
          as: 'list1',
        }
      ],
      group: [
        literal('YEAR(`Ticket`.`createdAt`)'),
        literal('MONTH(`Ticket`.`createdAt`)'),
        'list1.name',
        'list1.id'
      ],
    });

    const totalMonthlyCount = totalMonthlyApplications.length;
    const totalPages = Math.ceil(totalMonthlyCount / limit)

    // Send response with the stats and paginated monthly applications
    res.status(StatusCodes.OK).json({
      defaultStats,
      monthlyApplications: formattedMonthlyApplications,
      totalPages,  // Total count for pagination
    });


// res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications: formattedMonthlyApplications });



}

//

///////
  const showAssignedStats = async (req, res) => {
    let stats = await Ticket.aggregate([
      //{ $match: { department: mongoose.Types.ObjectId(req.user.department) } },
      { $group: { _id:{ status:'$status', assignedTo:'$assignedTo', count: { $sum: 1 } } } },
    ]);
  
    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});
   console.log(stats)
    const defaultStats = {
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      resolved: stats.resolved || 0,
    };
  
    let monthlyApplications = await Ticket.aggregate([
      //{ $match: { department: mongoose.Types.ObjectId(req.user.department) } },
      {
        $group: {
          _id: { category:'$category', assignedTo:'$assignedTo', year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      
    ]);
  
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month, assignedTo, category },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format('MMM Y');
        return { assignedTo, date, category, count };
      })
      .reverse();
  
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  };

module.exports = {
    getAllTickets,
    getSingleTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    updateStatus,
    assignTicket,
    updateApproval,
    updateRemark,
    uploadImage,
    getDepartmentTickets,
    getAssignedTickets,
    showAllStats,
    showStaffStats,
    showAssignedStats,
    showStaffDetail,
    getRequestedTickets,
    getAllPendingTickets,
    getAllAcceptedTickets,
    getAllResolvedTickets,
    getPendingAssignedTickets,
    getAcceptedAssignedTickets,
    getPendingDepartmentTickets,
    getAcceptedDepartmentTickets,
    getAllApprovedTickets,
    showApprovedStats,
    showDepartmentStats,
    showAssignedStaffStats,
    getResolvedAssignedTickets
}