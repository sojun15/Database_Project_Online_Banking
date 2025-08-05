const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.post('/signup',(req,res,next)=>{
    // here disstructuring name and html form name must be same otherwise error
    let {nid_number,name,phone,date_birth,password} = req.body;
    let money = 0;

    let sql = "insert into online_bank(Nid,Name,Phone,Date_birth,Password,Money) values(?,?,?,?,?,?)";
    connect.query(sql,[nid_number,name,phone,date_birth,password,money],(error,result)=>{
        if(error) throw error;
        // after passing query we must be send any message as response otherwise there will be error
        res.send('data insert successfully');
    })
});

module.exports = router;