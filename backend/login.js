const express = require('express');
const router = express.Router();
const connect = require('./connection');
const bcrypt = require('bcrypt');

router.post('/', (req, res,next) => {
    let { phone, password } = req.body; //! Destructure phone and password from form

    //! let sql = "SELECT * FROM online_bank WHERE Phone = ?;
    connect.query("SELECT * FROM online_bank WHERE Phone = ?",[phone], async (error, result) => {
        if (error) throw next(error);

        if (result.length === 0) {
            return res.redirect('/login.html?error=invalid_user_information');
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.redirect('/login.html?error=invalid_user_information');
        }
            
        // store my login session
        req.session.phone = phone;
        res.redirect('/homepage.html');
    });
});

module.exports = router;