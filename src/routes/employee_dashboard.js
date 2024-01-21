const express = require('express');
const router = express.Router();
const authenticateToken = require('../utils/authenticateToken');
const Employee = require('../models/Employee'); // Import your Employee model
const LeaveRequest = require('../models/LeaveRequest');

// Dashboard route
router.get('/:empid/dashboard', authenticateToken, async (req, res) => {
    const empId = req.params.empid;
    // console.log(empId)
    try {
        // Retrieve the employee information from the database using the admId
        const employee = await Employee.findOne({ empid: parseInt(empId, 10) });

        if (!employee) {
            return res.status(404).json({ message: 'employee not found' });
        }
        res.json({ 
            message: `Welcome to the employee dashboard, ${employee.name}!`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ... (previous code)

router.get('/:empid/leaverequests', authenticateToken, async (req, res) => {
    const employeeId = req.params.empid;

    try {
        // Retrieve all leave requests for the employee identified by empid
        const leaveRequests = await LeaveRequest.find({ employeeId });

        res.json(leaveRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ... (remaining code)


module.exports = router;