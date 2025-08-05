const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.post('/pay_bill',(req,res,next)=>{
    let {biller_id,biller_type,biller_month,amount,pin_code} = req.body;

    let sql = "insert into pay_bill(Biller_id,Biller_type,Biller_month,Amount) values (?,?,?,?)";
    connect.query(sql,[biller_id,biller_type,biller_month,amount],(error,result)=>{
        if(error) throw next(error);
        res.redirect('/completed.html');
    })
});

module.exports = router;