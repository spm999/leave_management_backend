const express = require('express');
const router = express.Router();
const authenticateToken = require('../utils/authenticateToken');
const LeaveRequest = require('../models/LeaveRequest');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mbrrkn@gmail.com',
        pass: 'eezz ajhz ukyr nolf',
    },
});

router.post('/:empid/leaveRequest', authenticateToken, async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.params.empid;

    try {
        const leaveRequest = new LeaveRequest({
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        await leaveRequest.save();

        const emailOptions = {
            from: 'mbrrkn@gmail.com',
            to: 'msurya9701@gmail.com',
            subject: 'Leave Request Created',
            text: `Leave request created for employee ID ${employeeId}. 
                   Leave Type: ${leaveType}, 
                   Start Date: ${startDate}, 
                   End Date: ${endDate}, 
                   Reason: ${reason}`,
        };

        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.error('Email sending error:', error);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Email sent:', info.response);
                res.status(201).json({ message: 'Leave request created successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
