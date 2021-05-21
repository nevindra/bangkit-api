const client = require('../config/database');

exports.registerVehicle = async (req, res, next) => {
    const {id_user, plate_number, car_type} = req.body
    const image = req.file;
    const imageUrl = image.path;

    try {
        await client.query(
            'INSERT INTO user_vehicle(id_user,plate_number,car_type,img_stnk) VALUES($1,$2,$3,$4)',
            [id_user, plate_number, car_type,imageUrl]
        )
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
};

exports.getVehicles = async (req, res, next) => {
    const {id_user} = req.body

    try {
        const results = await client.query('SELECT * FROM user_vehicle WHERE id_user = $1', [id_user]);
        res.send(results.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.getVehiclesById = async (req, res, next) => {

    const {id_user, id_vehicle} = req.body

    try {
        const results = await client.query('SELECT * FROM user_vehicle WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
        res.send(results.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.deleteVehicleById = async (req, res, next) => {
// test webhooks github
    const {id_user, id_vehicle} = req.body

    try {
        const results = await client.query('SELECT * FROM user_vehicle WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
        if (results.rows.length === 1) {
            res.send(404);
        } else {
            await client.query('DELETE FROM user_vehicle WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
            res.status(200);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};