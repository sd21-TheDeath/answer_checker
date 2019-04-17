const mongoose = require('mongoose');
const dateOnly = require('mongoose-dateonly')(mongoose);
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const StudentSchema = mongoose.Schema({
  sid: {
    type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  batch: {
    type: String
  },
  program: {
    type: String
  },
  code: {
    type: String
  },
  exam_number: {
    type: String
  },
  marks: {
    type: String
  },
  total_marks: {
    type: String
  }
});

const Student = module.exports = mongoose.model('Student',StudentSchema);

module.exports.getStudentById = function(id, callback){
  Student.findById(id, callback);
}

module.exports.addStudent = function(newUser, callback){
  console.log("saving user " + newUser);
  newUser.save(callback);
  console.log("saved user " + newUser);

}
module.exports.getStudentBySid = function(sid, callback){
  const query = {sid: sid}
  //Student.findOne(query, callback); Need to find all
  Student.find(query,callback);
}
