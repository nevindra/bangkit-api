const client = require('../config/database');
const bcrypt = require('bcrypt');

exports.confirmationPayment = async (req, res) => {
    const {id_user, verification_pin} = req.body;
    try {
        const user = await client.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        if (typeof user.rows[0] === 'undefined') return res.status(404).send({'response': 'user not found'});
        let verification_pin_user = user.rows[0].verification_pin
        const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
        if (isAuth) {
            res.status(200).send({'response': 'succeeded'});
        } else {
            res.status(404).send({'response': 'pin not valid'});
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.historyTransactionNotDone = async (req, res) => {

    const id_user = req.params.id

    try {
        const user = await client.query('SELECT * FROM parking_transactions WHERE id_user = $1 AND parking_transactions."isDone" = false ', [id_user]);
        if (typeof user.rows[0] === 'undefined') {
            return res.status(404).send();
        } else {
            res.status(200).send(user.rows);
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.historyTransactionIsDone = async (req, res) => {

    const id_user = req.params.id

    try {
        const user = await client.query('SELECT * FROM parking_transactions WHERE id_user = $1 AND parking_transactions."isDone" = true ', [id_user]);
        if (typeof user.rows[0] === 'undefined') {
            return res.status(404).send();
        } else {
            res.status(200).send(user.rows);
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.topUp = async (req, res) => {
    const {id_user, amount, card_number} = req.body;

    try {
        await client.query(
            'INSERT INTO user_recharge(id_user,amount,card_number) VALUES($1,$2,$3)',
            [id_user, amount, card_number]
        )
        res.status(201).send({'response': 'succeeded'})
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

