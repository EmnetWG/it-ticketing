const express = require('express')
const router = express.Router()

const {
    getAllSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSingleSubCategory,
    getAllSubCategoryAndName
} = require('../controllers/subCategoryController')


const {
    authenticateUser,
authorizePermission
} = require('../middlewares/authentication')
//const { getAllSubCategories, getAllSubCategoriesWithCategoryName } = require('../controllers/subCategoryController')

router.get('/',  authenticateUser, getAllSubCategory).post('/', authenticateUser, createSubCategory)
router.get(`/name`, authenticateUser,  getAllSubCategoryAndName)
router.route('/:id')
      .patch(authenticateUser, updateSubCategory)
      .delete(authenticateUser, deleteSubCategory)
      .get(authenticateUser,  getSingleSubCategory)

//router.get('/', authenticateUser, getAllSubCategory).post('/', authenticateUser,authorizePermission('supervisor'), createSubCategory)
//router.get(`/name`, authenticateUser,  getAllSubCategoryAndName)
//router.route('/:id')
     // .patch(authenticateUser, authorizePermission('supervisor'), updateSubCategory)
     // .delete(authenticateUser, authorizePermission('supervisor'), deleteSubCategory)
    //  .get(authenticateUser,  getSingleSubCategory)


      module.exports = router