const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Student = require('../models/student');
const config = require('../config/database');
var nodemailer = require('nodemailer')
// var email   = require("emailjs");
// const xoauth2 = require('xoauth2');
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name : req.body.name,
    email : req.body.email,
    username : req.body.username,
    profession : req.body.profession,
    password : req.body.password
  });
  User.findOne({username: newUser.username}, function(err, document) {
    if(!document){
      User.addUser(newUser, (err, user)=>{
        if(err){
          res.json({success:false, msg : 'failed to register user\n'})
        }
        else{
          console.log("send mail")
          console.log("at runpy");

          var spawn = require("child_process").spawn;
          var process = spawn('python', ["./sendMail.py",
            newUser.username,
            // "  201601441",
            req.body.password,
          ]);
          // console.log(process);
          console.log("ended")
          // res.json({success:true, msg : 'successfully registerd\n'})
          process.stdout.on('data', function (data) {
            // let a = data.toString();
            console.log("in here")
            var str = data.toString();
            console.log(str);
            // var arr = str.split("\n");
            // arr = arr.map(function (val) { return parseFloat(val); });
            // console.log(arr);
          });
          res.json({success:true, msg : 'successfully registerd\n'})
        }
      })
    }
    else{
      console.log('not null');
      res.json({success:false, msg : 'user with username ' + req.body.username + ' is already registered\n'})
    }
    });
});

router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user)=>{
    if(err) throw err;
    if(!user){
      return res.json({success:false, msg:'user not found'});
    }
    User.comparePassword(password, user.password, (err, isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800
        });
        // console.log('----------------')
        // console.log(user)
        res.json({
          success:true,
          token:'JWT ' + token,
          user : {
            id:user._id,
            name : user.name,
            username : user.username,
            email : user.email,
            profession : user.profession
          }
        })
      }
      else{
        return res.json({success:false, msg:'wrong password'});
      }
    });
  })
});

router.post('/profile', (req, res, next) => {
  console.log('asdasd');
  // console.log(req.headers.myheader);
  console.log(req.body.headers.requestedUsername);
  User.getUserByUsername(req.body.headers.requestedUsername, (err, user)=>{
    if(err) throw err;
    if(!user){
      return res.json({success:false, msg:'user not found'});
    }
    res.json({
      success:true,
      user : {
        id:user._id,
        name : user.name,
        username : user.username,
        email : user.email
      }
    })
  })
});

router.post('/studentprofile', (req, res, next) => {
  Student.getStudentBySid(req.body.headers.requestedUsername, (err, studentProfile) => {
    if(err) throw err;
    console.log(studentProfile);
    res.json(studentProfile);
  });
});

router.post('/storestudentprofile', (req, res, next) => {
  console.log(req.body);
  let student = new Student({
    sid : req.body.sid,
    name : req.body.name,
    email : req.body.email,
    batch : req.body.batch,
    program : req.body.program,
    code : req.body.code,
    exam_number : req.body.exam_number,
    marks : req.body.marks,
    total_marks : req.body.total_marks
  });
  Student.addStudent(student, (err, s) => {
    if(err){
      console.log("error storing user cred")
    }
    else{
      res.json({success:true, msg : 'user cred saved successfully\n'})
    }
  })
});

router.post('/exam', (req, res, next) => {
  console.log("exam js works!");
  res.json({
    success:true,
    questions : [
      {"q":"whats ur name", "a":"kalpit"},
      {"q":"where do u live", "a":"India"},
      {"q":"where am i", "a":"India"}
    ]
  })
});

router.post('/changepassword', (req, res, next) => {
  let newUser = new User({
    username : req.body.username,
    password : req.body.password,
    newPassword : req.body.newPassword
  });
  User.findOne({username: newUser.username}, function(err, document) {
    if(!document){
      console.log("no such user")
    }
    else{
      console.log("deleteing 028")
      let newRegisterUser = new User({
        name : document.name,
        email : document.email,
        username : document.username,
        profession : document.profession,
        password : req.body.newPassword
      });
      User.deleteOne({username : document.username}, function(err, document){
        console.log(document)
      });
      User.addUser(newRegisterUser, (err, user)=>{
        if(err){
          res.json({success:false, msg : 'failed to change password\n'})
        }
        else{
          res.json({success:true, msg : 'password changed successfully\n'})
        }
      })
    }
    });
});

router.post('/sendotp', (req, res, next) => {
  // console.log(req);
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./sendOTP.py",
    req.body.username,
    // "201601441",
    req.body.otp,
  ]);
  // process.stdout.on('data', function (data) {
  //   console.log("in here")
  //   var str = data.toString();
  //   console.log(str);
  // });
  res.json({success:true, msg : 'OTP sent successfully\n'})
});

router.post('/changepasswordotp', (req, res, next) => {
User.findOne({username: req.body.username}, function(err, document) {
  console.log(document)
  if(!document){
    res.json({success:false, msg : 'no such user\n'})
  }
  else{
    let newRegisterUser = new User({
      name : document.name,
      email : document.email,
      username : document.username,
      profession : document.profession,
      password : req.body.newPassword
    });
    User.deleteOne({username : document.username}, function(err, document){
      console.log(document)
    });
    User.addUser(newRegisterUser, (err, user)=>{
      if(err){
        res.json({success:false, msg : 'failed to change password\n'})
      }
      else{
        res.json({success:true, msg : 'password changed successfully\n'})
      }
    })
  }
  });
});

router.post('/trainmodel',(req,res,next)=>{
  console.log(req.body.tags);
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./corpusAndTrainCombined.py",
    req.body.tags,
    req.body.batch,
    req.body.course,
    req.body.program,
    req.body.examNo
  ]);
  process.stdout.on('data', function (data) {
  console.log("***********")
  console.log(data)
  res.json({success:true, msg : 'Model created successfully\n'});
  });
});

router.post('/checkanswers',(req,res,next)=> {
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./checkAndMakePdfAndSend.py",
    req.body.examNo ,
    req.body.username ,
    req.body.batch ,
    req.body.course ,
    req.body.studentAnswers ,
    req.body.professorAnswers ,
    req.body.examDate ,
    req.body.program
  ]);
  process.stdout.on('data', function (data) {
    console.log("in here")
    var str = data.toString();
    console.log(str);
    res.json({success:true, msg : 'OTP sent successfully\n'})
  });
  
});


module.exports = router;
