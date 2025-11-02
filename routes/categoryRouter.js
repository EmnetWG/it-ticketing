const express = require('express')
const router = express.Router()

const {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getSingleCategory
} = require('../controllers/categoryController')


const {
    authenticateUser,
authorizePermission
} = require('../middlewares/authentication')

router.get('/', authenticateUser, getAllCategory).post('/', authenticateUser, authorizePermission('supervisor'), createCategory)
router.patch('/:id', authenticateUser, authorizePermission('supervisor'), updateCategory).get('/:id',  authenticateUser, getSingleCategory)
      .delete('/:id', authenticateUser, authorizePermission('supervisor'), deleteCategory)


 //     router.get('/', authenticateUser, getAllCategory).post('/', authenticateUser,authorizePermission('supervisor'), createCategory)
// router.patch('/:id', authenticateUser, authorizePermission('supervisor'), updateCategory).get('/:id', authenticateUser,  getSingleCategory)
 //     .delete('/:id', authenticateUser, authorizePermission('supervisor'), deleteCategory)

      module.exports = router