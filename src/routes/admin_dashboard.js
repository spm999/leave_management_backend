// admin_dashboard.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../utils/authenticateToken');
const Admin = require('../models/Admin');
const LeaveRequest = require('../models/LeaveRequest');
const mongoose = require('mongoose');

// Route to approve or reject leave request
router.put('/:admid/approveLeave/:leaveRequestId', authenticateToken, async (req, res) => {
    const admId = req.params.admid;
    const leaveRequestId = req.params.leaveRequestId;
    const { approvalStatus } = req.body;

    try {
        // Check if the admin exists
        const admin = await Admin.findOne({ admid: parseInt(admId, 10) });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if leaveRequestId is a valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(leaveRequestId)) {
            return res.status(400).json({ message: 'Invalid leaveRequestId' });
        }

        // Update the approval status of the leave request
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
            leaveRequestId,
            { approvalStatus: approvalStatus },
            { new: true }
        );

        if (!updatedLeaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.json({ message: 'Leave request updated successfully', updatedLeaveRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin Dashboard route
router.get('/:admid/dashboard', authenticateToken, async (req, res) => {
    const admId = req.params.admid;

    try {
        // Retrieve the admin information from the database using the admId
        const admin = await Admin.findOne({ admid: parseInt(admId, 10) });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Fetch all leave requests for admin approval
        const leaveRequests = await LeaveRequest.find({ });

        // You can access additional information about the admin from the 'admin' variable
        res.json({ 
            message: `Welcome to the admin dashboard, ${admin.name}!`,
            leaveRequests: leaveRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
