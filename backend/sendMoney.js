// Use sendMoney.js in different route for removing complexity
const express = require('express');
const router = express.Router();
const connect = require('./connection');

router.post('/send_money', (req, res, next) => {
    let { phone: receiver_phone, amount, pin_code } = req.body;
    let sender_phone = req.session.phone;
    let transfer_amount = parseFloat(amount);

    if (!sender_phone) return res.status(401).send('session time out, please login again');

    let sending_amount = "SELECT Money FROM online_bank WHERE Phone = ? AND Password = ?";
    connect.query(sending_amount, [sender_phone, pin_code], (error, result) => {
        if (error) return next(error);
        if (result.length === 0) return res.status(401).send('Invalid number or password');

        const sender_balance = parseFloat(result[0].Money);
        if (sender_balance < transfer_amount) {
            return res.status(401).send('insufficient balance');
        }

        connect.beginTransaction(error => {
            if (error) return next(error);

            const decrease_amount = "UPDATE online_bank SET Money = Money - ? WHERE Phone = ?";
            connect.query(decrease_amount, [transfer_amount, sender_phone], (error) => {
                if (error) return connect.rollback(() => next(error));

                const increase_amount = "UPDATE online_bank SET Money = Money + ? WHERE Phone = ?";
                connect.query(increase_amount, [transfer_amount, receiver_phone], (error) => {
                    if (error) return connect.rollback(() => next(error));

                    const record_send_money = "INSERT INTO send_money(Phone, Amount) VALUES (?,?)";
                    connect.query(record_send_money, [receiver_phone, transfer_amount], (error) => {
                        if (error) return connect.rollback(() => next(error));

                        connect.commit(error => {
                            if (error) return connect.rollback(() => next(error));
                            res.redirect('completed.html');
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
