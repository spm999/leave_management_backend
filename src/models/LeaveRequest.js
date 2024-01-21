const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  approvalStatus: { type: String, default: 'Pending' },
  reason: { type: String, required: true },
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
