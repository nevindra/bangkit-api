const client = require('../config/database');
const bcrypt = require('bcrypt');

exports.confirmationPayment = async (req, res) => {
    const {id_user, verification_pin, payment_status} = req.body;
    try {
        const user = await client.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        if (typeof user.rows[0] === 'undefined') return res.status(404).send({'response': 'user not found'});
        let verification_pin_user = user.rows[0].verification_pin
        const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
        if (isAuth && payment_status === 1) {
            const userBalance = await client.query(
                'SELECT * FROM balance WHERE id_user = $1', [id_user]
            )

            const userTransaction = await client.query(
                'SELECT id_user, SUM(price) as total FROM parking_transactions WHERE id_user = $1 GROUP BY  id_user', [id_user]
            );

            if (typeof userTransaction.rows[0] === 'undefined') return res.status(404).send({'response':'There are no transaction for you.'})

            const saldo = userBalance.rows[0].saldo - userTransaction.rows[0].total;

            await client.query(
             'UPDATE parking_transactions SET "isDone" = true WHERE id_user = 15 AND id_transaction\n' +
                '                IN (\n' +
                '                    SELECT id_transaction\n' +
                '                    FROM parking_transactions\n' +
                '                    WHERE id_user = 15 AND "isDone" = false\n' +
                '                    ORDER BY id_transaction desc\n' +
                '                    LIMIT 1)'
                );

            await client.query(
                'UPDATE balance SET saldo = $1 WHERE id_user = $2', [saldo, id_user]
            );

            return res.status(200).send({'response': 'Payment succeeded'});
        }
        else if (isAuth && payment_status === 2) {
            const {amount} = req.body;

            const userBalance = await client.query(
                'SELECT * FROM balance WHERE id_user = $1', [id_user]
            )

            const saldo = userBalance.rows[0].saldo + amount

            await client.query(
                'UPDATE user_recharge SET "isDone" = true WHERE id_user = 16 AND id_recharge\n' +
                'IN (\n' +
                '    SELECT id_recharge\n' +
                '    FROM user_recharge\n' +
                '    WHERE id_user = 16 AND "isDone" = false\n' +
                '    ORDER BY id_recharge desc\n' +
                '    LIMIT 1);'
            );

            await client.query(
                'UPDATE balance SET saldo = $2 WHERE id_user = $1', [id_user, saldo]
            )

            return res.status(200).send({'response': 'Topup succeeded'});
        } else if (isAuth && payment_status === 3) {
            return res.status(200).send({'response': 'Pin confirmation succeeded'});
        } else {
            return res.status(404).send({'response': 'pin not valid'});
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

exports.getSaldo = async (req, res) => {
    const {id_user} = req.body;

    try {
        const user = await client.query(
            'SELECT * FROM balance WHERE id_user = $1', [id_user]
        )
        res.status(200).send(user.rows[0])
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
}

