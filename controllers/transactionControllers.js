const client = require('../config/database')

exports.confirmationPayment = async (req, res) => {

    const {email, verification_pin} = req.body;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user) {
            return res.status(404).send();
        } else {
            let verification_pin_user = user.rows[0].verification_pin
            console.log(verification_pin_user)
            const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
            if (isAuth){
                res.status(200);
            } else {
                res.status(401).send();
            }
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.historyTransaction = async (req, res) => {

    const {id_user} = req.body;

    try {
        const user = await client.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        if (!user) {
            return res.status(404).send();
        } else {
            res.status(200);
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};