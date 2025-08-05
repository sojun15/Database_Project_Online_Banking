let express = require('express');
let router = express.Router();
let connect = require('./connection');

router.post('/cashout',(req,res, next)=>{
    let {phone:agent_phone,amount,pin_code} = req.body;
    let sender_phone = req.session.phone;
    let transfer_amount = parseFloat(amount);

    if(!sender_phone) return res.status(401).send('login expired, please login again');

    let cashout_money = "select Money from online_bank where Phone = ? and Password = ?";
    connect.query(cashout_money,[sender_phone,pin_code],(error,result)=>{
        if(error) return res.status(401).send('Invalid phone or password')

        if(result.length===0) return res.status(401).send('Invalid phone or password');

        let sender_balance = parseFloat(result[0].Money);

        if(sender_balance<transfer_amount)
            return res.status(401).send('insufficient balance');

        connect.beginTransaction(error=>{
            if(error) return next(error);

            let decrease_amount = "update online_bank set Money = Money - ? where Phone = ?";
            connect.query(decrease_amount,[transfer_amount,sender_phone],(error)=>{
                if(error) return connect.rollback(()=> next(error));

                let increase_amount = "update online_bank set Money = Money + ? where Phone = ?";
                connect.query(increase_amount,[transfer_amount,agent_phone],(error)=>{
                    if(error) return connect.rollback(()=> next(error));

                    let cashout_table = "insert into cashout(Phone,Amount) values(?,?)";
                    connect.query(cashout_table,[agent_phone,transfer_amount],(error)=>{
                        if(error) return connect.rollback(()=>next(error));

                        connect.commit((error)=>{
                            if(error) return connect.rollback(()=> next(error));

                            res.redirect('completed.html');
                        })
                    });
                });
            });
        });
    });
});

module.exports = router;