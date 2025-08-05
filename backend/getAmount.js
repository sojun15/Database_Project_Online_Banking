const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.get('/get_amount', (req, res,next) => {
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

module.exports = router;