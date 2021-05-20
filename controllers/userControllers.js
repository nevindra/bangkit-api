// const Profile = require("../models/User");
const bcrypt = require("bcrypt");
const client = require('../config/database')

exports.getUsers = async (req, res) => {

    try {
        const results = await client.query('SELECT * FROM users');
        res.send(results.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

};

exports.getUserByID = async (req, res) => {
    const id_user = parseInt(req.params.id);

    try {
        const user = await client.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        res.send(user.rows);

        if (!user) res.status(404).send();
        console.log(user.rows[0].email)
    } catch (e) {
        res.status(500).send();
    }
};

exports.postRegistration = async (req, res) => {
    const {full_name, email, password, phone_number, verification_pin} = req.body;
    const saltRounds = 12;
    try {
        const checkUser = await client.query('SELECT * FROM users WHERE email = $1', [email])
        if (checkUser.rows.length === 1) {
            res.status(409).send()
        } else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const encryptedPassword = bcrypt.hashSync(password, salt);
            const encryptedVerification = bcrypt.hashSync(verification_pin, salt);

            await client.query(
                'INSERT INTO users(full_name,email,password,phone_number,verification_pin) VALUES($1,$2,$3,$4,$5)',
                [full_name, email, encryptedPassword, phone_number, encryptedVerification]
            );

            const registeredUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

            await client.query(
                'INSERT INTO balance(id_user,saldo) VALUES($1,0)',
                [registeredUser.rows[0].id_user]
            );

            res.status(201).send(registeredUser.rows[0]);
        }

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).send();
        } else {
            const isAuth = await bcrypt.compareSync(password, user.rows[0].password);
            let id_user = user.rows[0].id_user;
            if (isAuth){
                const userData = await client.query('SELECT users.id_user, users.full_name, users.phone_number, users.email, balance.saldo ' +
                    'FROM users JOIN balance ' +
                    'ON (users.id_user = $1) ' +
                    'GROUP BY users.id_user, balance.saldo;',[id_user])
                res.status(200).send(userData.rows);
            } else {
                res.status(401).send();
            }
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.deleteUser = async (req, res) => {
    const id_user = parseInt(req.params.id)

    try {
        const user = await client.query('DELETE FROM users WHERE id_user = $1', [id_user])

        if(!user) return res.status(404).send();

        res.send(`User deleted with ID: ${id_user}`)
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

