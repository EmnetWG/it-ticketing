
//const Category = require('../models/Category')
//const SubCategory = require('../models/SubCategory')

const {StatusCodes} = require('http-status-codes')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated') 
const NotFoundError = require('../errors/not-found')
const models = require('../models/models');

const getAllCategory = async (req, res) => {
    const categorys = await models.Category.findAll({})
    //const categorys = await Category.find({} , '-_id name')
    //const {categoryName} = categorys.name
    res.status(StatusCodes.OK).json({categorys})
}

const getSingleCategory = async (req, res) => {
    const{id:categoryId} = req.params
    const category = await models.Category.findOne({where:{id:categoryId}})

    if(!category) {
        throw new NotFoundError(`No categorey with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({category})
}



const createCategory = async (req, res) => {
    
    const category = await models.Category.create(req.body)
    res.status(StatusCodes.CREATED).json({category})

}

const updateCategory = async (req, res) => {
    const{id:categoryId} = req.params
    

const categorys = req.body.name

if(!categorys) {
    throw new BadRequestError('Please provide the value')
}

const data = await models.Category.findByPk(req.params.id)
if(!data) {
    throw new NotFoundError(`No category with id : ${req.params.id}`)
}
const newData = {
    name:req.body.name
}
const category = await models.Category.update(newData, {where:{id:req.params.id}})

if(!category) {
    throw new NotFoundError(`No category with id : ${req.params.id}`)
}


res.status(StatusCodes.OK).json({category})

}

/*
const deleteCategory = async (req, res) => {
    const{id:categoryId} = req.params
    
    const category = await models.Category.destroy( {where:{id:req.params.id}})

    if(!category) {
        throw new NotFoundError(`No category with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).send();
}
*/



const deleteCategory = async (req, res) => {
 const { id: categoryId } = req.params;

 // 1. Check if any tickets are linked to this category
 const ticketExists = await models.Ticket.findOne({ where: { category: categoryId } });
 if (ticketExists) {
 throw new BadRequestError('Cannot delete category. There are tickets assigned to this category.');
 }

 // 2. Optionally check for subcategories under this category
 const subCategoryExists = await models.SubCategory.findOne({ where: { category: categoryId } });
 if (subCategoryExists) {
 throw new BadRequestError('Cannot delete category. There are subcategories under this category.');
 }

 // 3. Proceed with deletion
 const deleted = await models.Category.destroy({ where: { id: categoryId } });

 if (!deleted) {
 throw new NotFoundError(`No category found with id: ${categoryId}`);
 }

 res.status(StatusCodes.OK).json({ msg: 'Category deleted successfully.' });
};

module.exports = {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getSingleCategory
}