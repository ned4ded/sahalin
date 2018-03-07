const user = require('../models/user.logic');
const credentials = require('./credentials');

const mongoose = require('mongoose');
mongoose.connect(credentials.server.db, function (err) {
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

user.create(userData, (err, user) => {
  if(err) throw err;
  db.close();
});
