const express = require('express');
const app = express();
const multer = require('multer');
const db = require('./config/database')
const fs = require('fs');
const path = require('path')

const PORT = process.env.PORT;


if (!fs.existsSync('./images')) {
    fs.mkdir(
        path.join(__dirname, 'images'), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        })
}

const fileStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './images')
        },
        filename: function (req, file, cb) {
            cb(null, req.body.plate_number + "_" + req.body.id_user + "_" + req.body.car_type + "." + file.originalname.split(".")[1])
        }
    }
);

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ['*']);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '50mb'}))
app.use(multer({
    storage: fileStorage, fileFilter: fileFilter
}).single('image'))

const userRoutes = require('./routes/userRoute');
const vehicleRoutes = require('./routes/vehicleRoute');
const transactionRoutes = require('./routes/transactionRoute');

app.use('/api/', userRoutes);
app.use('/api/', vehicleRoutes);
app.use('/api/', transactionRoutes);

db.connect();
const server = app.listen(process.env.PORT, err => {
    if (err) console.log(err);
    console.log(`Connected to port ${PORT} `)
});

module.exports = server