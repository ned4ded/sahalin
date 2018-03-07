const express = require('express');
const app = express();
const credentials = require('./config/credentials');

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const Store = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');

//DB setup
const mongoose = require('mongoose');
mongoose.connect(credentials.server.db, function (err) {
   if (err) throw err;
   console.log('DB Successfully connected');
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
const hbs = require('express-handlebars').create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.secret.cookie));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: credentials.secret.cookie,
  store: new Store({ mongooseConnection: mongoose.connection }),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//server setup
app.set('port', process.env.PORT || credentials.server.port);
app.set('host', credentials.server.host);
app.use(express.static(path.join(__dirname, 'www')));

// routes
const isLoggedIn = (req, res, next) => ensureLogin.ensureLoggedIn('/login')(req, res, next);

const index = require('./routes/index');
const home = require('./routes/home');
const login = require('./routes/login');
const logout = require('./routes/logout');

app.use('/login', login);
app.use('/', isLoggedIn, index);
app.use('/home', isLoggedIn, home);
app.use('/logout', isLoggedIn, logout);


app.use((req, res) => {
  res.status(404).send('404');
});

app.use((err, req, res, next) => {
  res.status(500).send(err.stack);
});

app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Express is running on ${app.get('host')}, port: ${app.get('port')}, env: ${app.get('env')}
Press Ctrl+C to stop;`);
});
