const express = require('express');
const app = express();
const connect = require('./connection');
const bodyParser = require('body-parser');
const cors = require('cors');

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
        res.redirect('/completed.html')
    })
})

app.post('/', (req, res) => {
    let { nid_number, password } = req.body; // Destructure nid and password from form

    // let sql = "SELECT * FROM online_bank WHERE Nid = ? AND Password = ?";
    connect.query("SELECT * FROM online_bank WHERE Nid = ?  AND Password = ?",[nid_number,password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.redirect('/homepage.html');
        } else {
            res.redirect('/login.html?error=something_wrong');
        }
    });
});


app.listen(5500,()=>{
    console.log('server is running on: http://localhost:5500');
});