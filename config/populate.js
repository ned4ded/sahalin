if(process.argv.length <= 2) {
  console.log('Add more arguments to procceed; Use next syntax for each argument: login:password');
  return;
};

const arr = process.argv.slice(2)
  .reduce((acc, v, i, arr) => {
    const [username, password, ...rest] = v.split(':');

    if(!password) {
      console.log('INVALID ARGUMENT: No pass was provided for ' + v);
      return acc;
    }

    if(rest.length > 0) {
      console.log('INVALID ARGUMENT: Too much params were provided for ' + v);
      return acc;
    }

    if(acc.find(e => e.username === username)) {
      console.log('INVALID ARGUMENT: You have used dublicated login for ' + v);
      return acc;
    }

    return [...acc, { username, password }];
  }, []);

  if(!arr.length) {
    return console.log('All provided arguments are invalid.');
  }

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

const creation = (arr) => {
  if(!arr.length) return db.close();
  const [cur, ...rest] = arr;

  user.create(cur, (err, user) => {
    if(err) {
      console.log(err.errmsg + '\nUser "' + cur.username + '" was not added!');
    } else {
      console.log('User added: ' + user.username + '\nID: ' + user._id);
    }

    return creation(rest);
  });
}

creation(arr);
