const express = require('express')

const router = express.Router()
const { authenticateUser,
    authorizePermission } = require('../middlewares/authentication')

const userController = require('../controllers/userController')

router.get('/', userController.getAllUsers)

router.get('/', authenticateUser, authorizePermission('supervisor'), userController.getAllUsers)
router.get(`/ITStaff`, authenticateUser, authorizePermission('supervisor'), userController.getITStaffs)
router.get(`/showMe`, authenticateUser, userController.showCurrentUser);
router.get(`/:id`, authenticateUser, userController.getSingleUser)
router.patch('/updatePassword', authenticateUser, userController.updatePassword) 
router.patch(`/:id`, authenticateUser, userController.updateUser)

router.patch(`/:id/updateRole`, authenticateUser, authorizePermission('supervisor'), userController.updateRole)
router.patch(`/:id/resetPassword`, authenticateUser, authorizePermission('supervisor'), userController.resetPassword)
router.delete(`/:id`, authenticateUser, authorizePermission('supervisor'), userController.deleteUser)

module.exports = router