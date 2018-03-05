const User = require('../models/user.model');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/sahalin', function (err) {
   if (err) throw err;
   console.log('DB Successfully connected');
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userData = {
  username: 'admin',
  password: 'admin'
}

User.create(userData, (err, user) => {
  if(err) console.log(err);
});
