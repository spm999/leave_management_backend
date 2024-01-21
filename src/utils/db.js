const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mshari7185:Abhi%40430@gallary.xducnkc.mongodb.net/leave_m')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

