const express = require('express');
const app = express();
const connect = require('./backend/connection');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const sendMoneyRoute = require('./backend/sendMoney');
const cashoutRoute = require('./backend/cashout');
const getAmountRoute = require('./backend/getAmount');
const payBillRoute = require('./backend/payBill');
const rechargeRoute = require('./backend/recharge');
const loginRoute = require('./backend/login');
const signupRoute = require('./backend/signup');

// Session management such as req.session.phone
const session = require('express-session');
require('dotenv').config();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// cors single host on but multiple host do block
app.use(cors());
app.use(express.static(__dirname));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.redirect('login.html');
});

app.get('/signup',(req,res)=>{
    // res.sendFile(__dirname+'/signup.html');
    res.redirect('signup.html');
});


// Use the loginRoute for handling login requests
app.use(loginRoute);
// Use the signupRoute for handling signup requests
app.use(signupRoute);
// Use the sendMoneyRoute for handling send money requests
app.use(sendMoneyRoute);
// Use the cashoutRoute for handling cashout requests
app.use(cashoutRoute);
// Use the getAmountRoute for handling get amount requests
app.use(getAmountRoute);
// Use the payBillRoute for handling pay bill requests
app.use(payBillRoute);
// Use the rechargeRoute for handling recharge requests
app.use(rechargeRoute);

// it use to see in command line if server is running or not
app.listen(5500,()=>{
    console.log('server is running on: http://localhost:5500');
});