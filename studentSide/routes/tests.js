const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const Test = require('../models/test');
const config = require('../config/database');
var nodemailer = require('nodemailer');

router.post('/createtest',(req,res,next)=>{
    let newTest = new Test({
        number: "",
        batch: req.body.batch,
        program: req.body.program,
        code: req.body.code,
        qset: req.body.qset,
        profusername: "XYZ",
        startdate: req.body.startdate,
        starthh: req.body.starthh,
        startmm: req.body.startmm,
        startss: req.body.startss,
        durationhh: req.body.durationhh,
        durationmm: req.body.durationmm,
        durationss: req.body.durationss,
        tags: req.body.tags,
        description: req.body.description
    });
    Test.count({batch: req.body.batch,
    program: req.body.program,
    code: req.body.code}, (err, count)=>{
        newTest.number=count+1;
        console.log("count: ",count); // problem with number
        //console.log(err);
        newTest.startdate = moment(newTest.startdate).format('MM/DD/YYYY');
        //console.log("data: ",newTest);
        Test.addTest(newTest, (err)=>{
            if(err){
                res.json({success:false, msg: "Create Test Failed\n"});
            }
            else{
                res.json({success:true, msg : "Test Created\n", examNo : newTest.number});
            }
        });
    });
    //res.json("Hii\n");
    //console.log(newTest.startdate.getDate());
    //console.log(newTest.startdate.getMonth());
    //console.log(newTest.startdate.getFullYear());
    //res.json(cnt_test);
});

router.post('/gettest', (req, res, next) => {

    Test.find({"batch":req.body.batch, "program" : req.body.program}, function(err, d) {
        //console.log(d)
        res.json({success:true, tests : d});
    });

});




module.exports = router;
