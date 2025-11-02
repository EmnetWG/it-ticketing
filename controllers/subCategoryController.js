
const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const SubCategory = require('../models/SubCategory')(sequelize, DataTypes)
const Category = require('../models/Category')(sequelize, DataTypes)


const {StatusCodes} = require('http-status-codes')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated') 
const NotFoundError = require('../errors/not-found')
//const { model } = require('mongoose')
const models = require('../models/models');

const getAllSubCategory = async (req, res) => {
    const subcategorys = await models.SubCategory.findAll({
       
        include: [{model:models.Category, as:"list", attributes: [[Sequelize.col('name'), 'categoryName'],
            [Sequelize.col('id'), 'categoryid'],]}]
    } )  
       // const categoryid = subcategorys.category
       // console.log(categoryid)
       // const categoryn = await Category.findByPk(categoryid)
 //const categoryname = categoryn.name
    res.status(StatusCodes.OK).json({subcategorys})
}

const getAllSubCategoryAndName = async(req, res)=>{
    const subcategorys = await models.SubCategory.findAll({include:[{model:models.Category, as:"list", attributes: [[Sequelize.col('name'), 'categoryName'],
    [Sequelize.col('id'), 'categoryid'],]}]})
    //.populate('category', { name: 1, _id:1})
    res.status(StatusCodes.OK).json({subcategorys})
}
const createSubCategory = async (req, res) => {
    
    const subcategory = await models.SubCategory.create(req.body)
    res.status(StatusCodes.CREATED).json({subcategory})

}

const updateSubCategory = async (req, res) => {
    const{id:subCategoryId} = req.params
    

const {name, category} = req.body

if(!name || !category) {
    throw new BadRequestError('Please provide the value')
}

const newData = {
    name:req.body.name,
    category:req.body.category
}
const subcategorys = await models.SubCategory.update(newData, {where:{id:req.params.id}})


if(!subcategorys) {
    throw new NotFoundError(`No category with id : ${req.params.id}`)
}


res.status(StatusCodes.OK).json({subcategorys})

}

const getSingleSubCategory = async (req, res) => {
    const{id:subCategoryId} = req.params
    const subCategory = await models.SubCategory.findOne({where:{id:subCategoryId}, 
        include:[{model:models.Category, as:"list", attributes: [[Sequelize.col('name'), 'categoryName'],
            [Sequelize.col('id'), 'categoryid'],]}]})

    if(!subCategory) {
        throw new NotFoundError(`No subCategorey with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({subCategory})
}

/*
const deleteSubCategory = async (req, res) => {
    const{id:subCategoryId} = req.params
    
    const subcategory = await models.SubCategory.destroy({where:{id:subCategoryId}})

    if(!subcategory) {
        throw new NotFoundError(`No sub category with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).send();
}
*/


const deleteSubCategory = async (req, res) => {
 const { id: subCategoryId } = req.params;

 // 1. Check if any tickets reference this subcategory
 const ticketExists = await models.Ticket.findOne({ where: { subCategory: subCategoryId } });

 if (ticketExists) {
 throw new BadRequestError('Cannot delete subcategory. There are tickets linked to this subcategory.');
 }

 // 2. Delete if no references
 const deleted = await models.SubCategory.destroy({ where: { id: subCategoryId } });

 if (!deleted) {
 throw new NotFoundError(`No subcategory found with id: ${subCategoryId}`);
 }

 res.status(StatusCodes.OK).json({ msg: 'Subcategory deleted successfully.' });
};

module.exports = {
    getAllSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSingleSubCategory,
    getAllSubCategoryAndName
}