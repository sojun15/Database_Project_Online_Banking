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
    res.sendFile(__dirname+'/signup.html');
});

app.post('/',(req,res)=>{
    // here disstructuring name and html form name must be same otherwise error
    let {nid_number,name,phone,date_birth} = req.body;

    connect.connect((error)=>{
        if(error) throw error;

        let sql = "insert into online_bank(Nid,Name,Phone,Date_birth) values(?,?,?,?)";
        connect.query(sql,[nid_number,name,phone,date_birth],(error,result)=>{
            if(error) throw error;
            // after passing query we must be send any message as response otherwise there will be error
            res.send('data insert successfully');
        })
    })
});

app.listen(5500,()=>{
    console.log('server is running on: http://localhost:5500');
});