const express = require('express');
const app = express();
const connect = require('./connection');
const bodyParser = require('body-parser');
const cors = require('cors');

const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


// cors single host on but multiple host do block
app.use(cors());
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.redirect('login.html');
});

app.get('/signup',(req,res)=>{
    // res.sendFile(__dirname+'/signup.html');
    res.redirect('signup.html');
});

app.post('/signup',(req,res,next)=>{
    // here disstructuring name and html form name must be same otherwise error
    let {nid_number,name,phone,date_birth,password} = req.body;

    let sql = "insert into online_bank(Nid,Name,Phone,Date_birth,Password) values(?,?,?,?,?)";
    connect.query(sql,[nid_number,name,phone,date_birth,password],(error,result)=>{
        if(error) throw next(error);
        // after passing query we must be send any message as response otherwise there will be error
        res.send('data insert successfully');
    })
});

app.post('/send_money',(req,res,next)=>{
    let {phone:receiver_phone,amount,pin_code} = req.body;
    let sender_phone = req.session.phone;
    let transfer_amount = parseFloat(amount);

    // if user login then there have some value into sender_phone
    if(!sender_phone) return res.status(401).send('session time out, please login again');

    let sending_amount = "select Money from online_bank where Phone = ?";
    // if sender_phone find into database then it keep some value into result
    connect.query(sending_amount,[sender_phone],(error,result)=>{
        if(error) return next(error);
        if(result.length===0) return res.status(401).send('sender not found');
        
        const sender_balance = parseFloat(result[0].Money);
        // if sender have insufficient balance then it will back from here
        if(sender_balance<transfer_amount)
        {
            return res.status(401).send('insufficent balance');
        }

        // transection transfering process starts here
        connect.beginTransaction(error =>{
            if(error) throw next(error);
    
            // sender amount decrease segment
            const decrease_amount = "update online_bank set Money = Money - ? where Phone = ?";
            connect.query(decrease_amount,[transfer_amount,sender_phone],(error=>{
                if(error) return connect.rollback((error)=> next(error));

                // receiver amount increase segment
                const increase_amount = "update online_bank set Money = Money + ? where Phone = ?";
                connect.query(increase_amount,[transfer_amount,receiver_phone],(error=>{
                    if(error) return connect.rollback(()=> next(error));

                    // after increase and decrease insert send_money table those values
                    const record_send_money = "insert into send_money(Phone,Amount) values(?,?)";
                    connect.query(record_send_money,[receiver_phone,transfer_amount],(error=>{
                        if(error) return res.rollback(()=> next(error));

                        // if all of those tasks(increase,decrease,insert) completed then it will update database finally otherwise remain previous state
                        connect.commit(error =>{
                            if(error) return connect.rollback(() => next(error));
                            res.redirect('completed.html');
                        })
                    }))
                }));
            }));
        })
    });
})

app.post('/cashout',(req,res,next)=>{
    let {phone,amount,pin_code} = req.body;

    let sql = "insert into cashout(Phone,Amount) values(?,?)";
    connect.query(sql,[phone,amount],(error,result)=>{
        if(error) throw next(error);
        res.redirect('/completed.html');
    })
})

app.post('/recharge',(req,res,next)=>{
    let {mobile,amount,pin_code} = req.body;

    let sql = "insert into recharge(Phone,Amount) values(?,?)";
    connect.query(sql,[mobile,amount],(error,result)=>{
        if(error) throw next(error);
        res.redirect('/completed.html');
    })
})

app.post('/pay_bill',(req,res,next)=>{
    let {biller_id,biller_type,amount,pin_code} = req.body;

    let sql = "insert into pay_bill(Biller_id,Biller_type,Amount) values (?,?,?)";
    connect.query(sql,[biller_id,biller_type,amount],(error,result)=>{
        if(error) throw next(error);
        res.redirect('/completed.html');
    })
});

app.post('/money_transfer',(req,res,next)=>{
    let {account_number,bank_name,amount,pin_code} = req.body;

    let sql = "insert into money_transfer(Account_number,Bank_name,Amount) values (?,?,?)";
    connect.query(sql,[account_number,bank_name,amount],(error,result)=>{
        if(error) throw next(error);
        res.redirect('/completed.html');
    })
})

app.post('/', (req, res,next) => {
    let { phone, password } = req.body; //! Destructure nid and password from form

    //! let sql = "SELECT * FROM online_bank WHERE Nid = ? AND Password = ?";
    connect.query("SELECT * FROM online_bank WHERE Phone = ?  AND Password = ?",[phone,password], (error, result) => {
        if (error) throw next(error);
        if (result.length > 0) {
            // store my login session
            req.session.phone = phone;
            res.redirect('/homepage.html');
        } else {
            res.redirect('/login.html?error=something_wrong');
        }
    });
});

app.get('/get_amount', (req, res,next) => {
    // here i save my stored login session into a variable
    let loggedPhone = req.session.phone;

    let sql = "SELECT Money FROM online_bank WHERE Phone = ?";
    connect.query(sql, [loggedPhone], (error, result) => {
        // here connect query function check my sql and login phone are matching or not
        if (error) throw next(error);
        if (result.length > 0) {
            res.json({ Money: result[0].Money });
        } else {
            res.status(404).send('No data found');
        }
    });
});

app.listen(5500,()=>{
    console.log('server is running on: http://localhost:5500');
});