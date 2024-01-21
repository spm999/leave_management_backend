const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/utils/db');
const cors = require('cors');
const router=require('./router.js');

const app = express();

app.use(router);
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Handle preflight requests
    if ('OPTIONS' === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });

const PORT = process.env.PORT || 5172;

app.use(bodyParser.json());

// login, signup route for employee///////////////////////////////////////////////////////////////////////
const employeeAuthRoutes = require('./src/routes/employee_auth');
const dashboardRoutes = require('./src/routes/employee_dashboard'); // Update the path as needed
const leaveRequest=require("./src/routes/employee_leave")

app.use('/employee', employeeAuthRoutes);
app.use('/employee', dashboardRoutes); // Use the dashboard route
app.use('/employee', leaveRequest); // Corrected route inclusion


//login, signup route for admin///////////////////////////////////////////////////////////////////////////
const adminAuthRoutes = require('./src/routes/admin_auth');
const admindashboardRoutes = require('./src/routes/admin_dashboard'); // Update the path as needed


app.use('/admin', adminAuthRoutes);
app.use('/admin', admindashboardRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
