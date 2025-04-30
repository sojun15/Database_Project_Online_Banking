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

app.post('/signup',(req,res)=>{
    // here disstructuring name and html form name must be same otherwise error
    let {nid_number,name,phone,date_birth,password} = req.body;

    let sql = "insert into online_bank(Nid,Name,Phone,Date_birth,Password) values(?,?,?,?,?)";
    connect.query(sql,[nid_number,name,phone,date_birth,password],(error,result)=>{
        if(error) throw error;
        // after passing query we must be send any message as response otherwise there will be error
        res.send('data insert successfully');
    })
});

app.post('/send_money',(req,res)=>{
    let {phone,amount,pin_code} = req.body;

    let sql = "insert into send_money(Phone,Amount) values(?,?)";
    connect.query(sql,[phone,amount],(error,result)=>{
        if(error) throw error;
        res.redirect('/completed.html');
    })
})

app.post('/cashout',(req,res)=>{
    let {phone,amount,pin_code} = req.body;

    let sql = "insert into cashout(Phone,Amount) values(?,?)";
    connect.query(sql,[phone,amount],(error,result)=>{
        if(error) throw error;
        res.redirect('/completed.html');
    })
})

app.post('/recharge',(req,res)=>{
    let {mobile,amount,pin_code} = req.body;

    let sql = "insert into recharge(Phone,Amount) values(?,?)";
    connect.query(sql,[mobile,amount],(error,result)=>{
        if(error) throw error;
        res.redirect('/completed.html');
    })
})

app.post('/pay_bill',(req,res)=>{
    let {biller_id,biller_type,amount,pin_code} = req.body;

    let sql = "insert into pay_bill(Biller_id,Biller_type,Amount) values (?,?,?)";
    connect.query(sql,[biller_id,biller_type,amount],(error,result)=>{
        if(error) throw error;
        res.redirect('/completed.html');
    })
});

app.post('/money_transfer',(req,res)=>{
    let {account_number,bank_name,amount,pin_code} = req.body;

    let sql = "insert into money_transfer(Account_number,Bank_name,Amount) values (?,?,?)";
    connect.query(sql,[account_number,bank_name,amount],(error,result)=>{
        if(error) throw error;
        res.redirect('/completed.html');
    })
})

app.post('/', (req, res) => {
    let { phone, password } = req.body; //! Destructure nid and password from form

    //! let sql = "SELECT * FROM online_bank WHERE Nid = ? AND Password = ?";
    connect.query("SELECT * FROM online_bank WHERE Phone = ?  AND Password = ?",[phone,password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // store my login session
            req.session.phone = phone;
            res.redirect('/homepage.html');
        } else {
            res.redirect('/login.html?error=something_wrong');
        }
    });
});

app.get('/get_amount', (req, res) => {
    // here i save my stored login session into a variable
    let loggedPhone = req.session.phone;

    let sql = "SELECT Money FROM online_bank WHERE Phone = ?";
    connect.query(sql, [loggedPhone], (error, result) => {
        // here connect query function check my sql and login phone are matching or not
        if (error) throw error;
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