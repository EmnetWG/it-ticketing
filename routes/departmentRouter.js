const express = require('express')

const router = express.Router()

const {
    authenticateUser,
authorizePermission
} = require('../middlewares/authentication')

const departmentController = require('../controllers/departmentController')

router.get('/',  departmentController.getAllDepartment)
router.get('/:id', authenticateUser, departmentController.getSingleDepartment)
router.patch('/:id', authenticateUser, authorizePermission('supervisor'), departmentController.updateDepartment)
router.delete('/:id', authenticateUser, authorizePermission('supervisor'), departmentController.deleteDepartment)
router.post('/', authenticateUser, authorizePermission('supervisor'), departmentController.createDepartment)

module.exports = router