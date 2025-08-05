const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.post('/', (req, res,next) => {
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

module.exports = router;