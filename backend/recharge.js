const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.post('/recharge',(req,res,next)=>{
    let {mobile,amount,pin_code} = req.body;

    let sql = "insert into recharge(Phone,Amount) values(?,?)";
    connect.query(sql,[mobile,amount],(error,result)=>{
        if(error) return next(error);
        res.redirect('../completed.html');
    })
});

module.exports = router;