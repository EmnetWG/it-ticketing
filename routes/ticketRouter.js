const express = require('express')
const router = express.Router()



// const userController = require('../controllers/userController')

const {
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
    getRequestedTickets,
    showStaffStats,
    showAllStats,
    showStaffDetail,
    showAssignedStats,
    getAllPendingTickets,
    getAllAcceptedTickets,
    getAllResolvedTickets,
    getPendingAssignedTickets,
    getAcceptedAssignedTickets,
    getResolvedAssignedTickets,
    getPendingDepartmentTickets,
    getAcceptedDepartmentTickets,
    getAllApprovedTickets,
    showApprovedStats,
    showDepartmentStats,
    showAssignedStaffStats,

} = require('../controllers/ticketController')

const {
    authenticateUser,
authorizePermission
} = require('../middlewares/authentication')

router.get('/', authenticateUser, authorizePermission('supervisor'), getAllApprovedTickets).post('/', authenticateUser, createTicket)
//router.get('/', authenticateUser, authorizePermission('supervisor'), getAllApprovedTickets)
router.get('/departmentStats', authenticateUser, authorizePermission('manager'), showDepartmentStats)
router.get('/pendingTickets', authenticateUser, authorizePermission('supervisor'), getAllPendingTickets)
router.get('/acceptedTickets', authenticateUser, authorizePermission('supervisor'), getAllAcceptedTickets)
router.get('/resolvedTickets', authenticateUser, authorizePermission('supervisor'), getAllResolvedTickets)
router.post('/uploadImage', authenticateUser, uploadImage)
router.get('/requestedTickets', authenticateUser, getRequestedTickets)
router.get("/departmentTickets", authenticateUser, authorizePermission('manager'), getDepartmentTickets)
router.get("/departmentPendingTickets", authenticateUser, authorizePermission('manager'), getPendingDepartmentTickets)
router.get("/departmentAcceptedTickets", authenticateUser, authorizePermission('manager'), getAcceptedDepartmentTickets)
router.get("/assignedTickets", authenticateUser, authorizePermission('IT staff'), getAssignedTickets)
router.get("/assignedPendingTickets", authenticateUser, authorizePermission('IT staff'), getPendingAssignedTickets)
router.get("/assignedResolvedTickets", authenticateUser, authorizePermission('IT staff'), getResolvedAssignedTickets)
router.get("/assignedAcceptedTickets", authenticateUser, authorizePermission('IT staff'), getAcceptedAssignedTickets)
router.get('/staffStats', authenticateUser, authorizePermission('IT staff'), showStaffStats)
router.get('/staffAssignedStats', authenticateUser, authorizePermission('IT staff'), showAssignedStaffStats)
router.get('/allStats', authenticateUser, authorizePermission('supervisor'), showAllStats)
router.get('/approvedStats', authenticateUser, authorizePermission('supervisor'), showApprovedStats)
router.get('/:id/staffDetail', authenticateUser, authorizePermission('supervisor'), showStaffDetail)
router.get('/assignedStats', authenticateUser, authorizePermission('supervisor'), showAssignedStats)
router.get('/:id', authenticateUser, getSingleTicket).patch('/:id', authenticateUser, updateTicket).delete('/:id', authenticateUser, deleteTicket)
      

router.patch('/:id/updateStatus', authenticateUser, authorizePermission('IT staff'), updateStatus)
router.patch('/:id/assignTicket', authenticateUser, authorizePermission('supervisor'), assignTicket)
router.patch('/:id/updateApproval', authenticateUser, authorizePermission('manager'), updateApproval)
router.patch('/:id/updateRemark', authenticateUser, authorizePermission('IT staff'), updateRemark)


module.exports = router