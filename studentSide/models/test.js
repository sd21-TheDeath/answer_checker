const mongoose = require('mongoose');
const dateOnly = require('mongoose-dateonly')(mongoose);
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const TestSchema = mongoose.Schema({
    number: {
      type: String
    },
    batch: {
      type: String,
      required: true
    },
    program: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    qset: [{
        q: String,
        a: String,
        m: String
    }],
    profusername: {
        type: String,
        required: true
    },
    startdate: {
      type: dateOnly,
      required: true
    },
    starthh: {
      type: String,
      required: true
    },
    startmm: {
      type: String,
      required: true
    },
    startss: {
      type: String,
      required: true
    },
    durationhh: {
      type: String,
      required: true
    },
    durationmm: {
      type: String,
      required: true
    },
    durationss: {
      type: String,
      required: true
    },
    tags: [{
      name: String
    }],
    description: {
      type: String
    }
    //total_marks
  });

  const Test = module.exports = mongoose.model('Test', TestSchema);

  module.exports.getTestById = function(id, callback){
    Test.findById(id, callback);
  }

  module.exports.addTest = function(newTest,callback){
    console.log(newTest);
    newTest.save(callback);
  }

  /*module.exports.getTestByDetail = function(, callback){
    const query = {username: username}
    User.findOne(query, callback);
  }*/
