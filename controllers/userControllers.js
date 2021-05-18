// const Profile = require("../models/User");
const bcrypt = require("bcrypt");
const client = require('../config/database')

exports.getUsers = async (req, res, next) => {

    try {
        const results = await client.query('SELECT * FROM users');
        res.send(results.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

};

exports.getUserByEmail = async (req, res, next) => {
    const email = req.params.email;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        res.send(user.rows);

        if (!user) res.status(404).send();

    } catch (e) {
        res.status(500).send();
    }
};

exports.getUserByID = async (req, res, next) => {
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
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
        const encryptedVerification = bcrypt.hashSync(verification_pin, salt);
        const user = await client.query(
            'INSERT INTO users(full_name,email,password,phone_number,verification_pin) VALUES($1,$2,$3,$4,$5)',
            [full_name, email, encryptedPassword, phone_number, encryptedVerification]
        )

        const registeredUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        res.status(201).send(registeredUser)
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
};

// exports.editUser = async (req, res) => {
//
//     const updates = Object.keys(req.body);
//     const validOperations = ['username', 'email'];
//     const isValid = updates.every((update) => validOperations.includes(update))
//
//     if (!isValid) {
//         return res.status(400).send({'error': 'Invalid updates.'})
//     }
//
//     try {
//         const user = await Profile.findByIdAndUpdate(req.params.id, req.body, {new: true});
//
//         if(!user) res.status(404).send();
//
//         res.send(user)
//     } catch (e) {
//         console.log(e)
//
//         res.status(400).send();
//     }
// };
//

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

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user) {
            return res.status(404).send();
        } else {
            const isAuth = await bcrypt.compareSync(password, user.rows[0].password);
            if (isAuth){
                res.status(200).send(user.rows);
            } else {
                res.status(401).send();
            }
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

