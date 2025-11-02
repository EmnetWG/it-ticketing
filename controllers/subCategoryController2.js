const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const SubCategory = require('../models/SubCategory')(sequelize, DataTypes);
const Category = require('../models/Category')(sequelize, DataTypes);

const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

const getAllSubCategories = async (req, res) => {
    const subcategories = await SubCategory.findAll({
        include: Category
    });
    res.status(StatusCodes.OK).json({ subcategories });
};

const getAllSubCategoriesWithCategoryName = async (req, res) => {
    const subcategories = await SubCategory.findAll({
        include: [Category]
    });
    res.status(StatusCodes.OK).json({ subcategories });
};

const createSubCategory = async (req, res) => {
    const subcategory = await SubCategory.create(req.body);
    res.status(StatusCodes.CREATED).json({ subcategory });
};

const updateSubCategory = async (req, res) => {
    const { id: subCategoryId } = req.params;
    const { name, category } = req.body;

    if (!name || !category) {
        throw new BadRequestError('Please provide the value');
    }

    const newData = {
        name,
        category
    };

    const [updatedRows] = await SubCategory.update(newData, { where: { id: subCategoryId } });

    if (updatedRows === 0) {
        throw new NotFoundError(`No subcategory with id: ${subCategoryId}`);
    }

    res.status(StatusCodes.OK).json({ message: 'SubCategory updated successfully' });
};

const getSingleSubCategory = async (req, res) => {
    const { id: subCategoryId } = req.params;
    const subCategory = await SubCategory.findOne({
        where: { id: subCategoryId },
        include: [Category]
    });

    if (!subCategory) {
        throw new NotFoundError(`No subcategory with id: ${subCategoryId}`);
    }

    res.status(StatusCodes.OK).json({ subCategory });
};

const deleteSubCategory = async (req, res) => {
    const { id: subCategoryId } = req.params;

    const deletedRows = await SubCategory.destroy({ where: { id: subCategoryId } });

    if (deletedRows === 0) {
        throw new NotFoundError(`No subcategory with id: ${subCategoryId}`);
    }

    res.status(StatusCodes.OK).send();
};

module.exports = {
    getAllSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSingleSubCategory,
    getAllSubCategoriesWithCategoryName
};
