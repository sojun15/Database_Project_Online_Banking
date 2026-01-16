const express = require('express');
const router = express.Router();
const connect = require('./connection');
const bcrypt = require('bcrypt');

router.post('/signup',async (req,res,next)=>{
    // here disstructuring name and html form name must be same otherwise error
    let {nid_number,name,phone,date_birth,password} = req.body;
    let money = 0;

    // how many times the password will be hashed thats called saltRounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let sql = "insert into online_bank(Nid,Name,Phone,Date_birth,Password,Money) values(?,?,?,?,?,?)";
    connect.query(sql,[nid_number,name,phone,date_birth,hashedPassword,money],(error,result)=>{
        if(error) throw error;
        // after passing query we must be send any message as response otherwise there will be error
        res.redirect('/login.html');
    })
});

module.exports = router;