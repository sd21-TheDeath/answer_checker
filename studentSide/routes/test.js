const express = require('express');
const router = express.Router();

router.post('/getbatchexams', (req, res, next)=>{
    res.json({success:true,tests:[
    {
        "number" : "1",
        "batch" : "2016",
        "program" : "BTech",
        "code" : "IT314",
        "qset" : [{"q": "question1 paper1", "a" : "ans1 paper1"},{"q": "question2 paper1", "a" : "ans2 paper1"}],
        "profusername" : "Saurabh Tiwari",
        "startdate" : "20190327",
        "starthh" : "15",
        "startmm" : "33",
        "startss" : "0",
        "durationhh" : "3",
        "durationmm" : "0",
        "durationss" : "0"
    },
    {
        "number" : "1",
        "batch" : "2016",
        "program" : "BTech",
        "code" : "CS314",
        "qset" : [{"q": "question1 paper2", "a" : "ans1 paper2"},{"q": "question2 paper2", "a" : "ans2 paper2"}],
        "profusername" : "Saurabh Tiwari 2",
        "startdate" : "20190327",
        "starthh" : "22",
        "startmm" : "10",
        "startss" : "0",
        "durationhh" : "3",
        "durationmm" : "0",
        "durationss" : "0"
    }]})
});

module.exports = router;
// "number" : "1",
// "batch" : "2016",
// "program" : "BTech",
// "code" : "IT314",
// "qset" : [{"q": "question1 paper1", "a" : "ans1 paper1"},{"q": "question2 paper1", "a" : "ans2 paper1"}],
// "profusername" : "Saurabh Tiwari",
// "startdate" : "",
// "starthh" "7",
// "startmm" : "0",
// "startss" : "0",
// "durationhh" : "3",
// "durationmm" : "0",
// "durationss" : "0"
