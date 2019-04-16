const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const moment = require('moment');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');
const test = require('./routes/test');
const tests = require('./routes/tests');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/test', test);
app.use('/tests', tests);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

var nodemailer = require('nodemailer')
app.get('/sendmail', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daiict.exam.portal@gmail.com',
      pass: '@daiictexamportal@'
    }
  });
  var mailOptions = {
    from: 'daiict.exam.portal@gmail.com',
    to: 'kalpitshah0078@gmail.com',
    subject: 'Exam mail',
    text: 'its!'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send('done');  
});

app.post('/runpy', (req, res) =>{
  console.log("at runpy");
  
  var spawn = require("child_process").spawn;
  //  MAKE THESE ARGUMENTS DYNAMIC!!!!
  var process = spawn('python', ["./check_ans.py",
    req.body.check_1,
    req.body.check_2,
  ]);
  // console.log(process);
  process.stdout.on('data', function (data) {
    // let a = data.toString();
    var str = data.toString();
    var arr = str.split("\n");
    arr = arr.map(function (val) { return parseFloat(val); });
    console.log(arr);
    res.json({success:true, marks:arr})
  });
  console.log("ended")
  
});
// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
