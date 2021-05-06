const express = require('express');
const app = express();

const db = require('./config/database')

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '50mb'}))

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', ['*']);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

const userRoutes = require('./routes/userRoute');

app.use(userRoutes)

db.connect();
app.listen(process.env.PORT, err => {
    if (err) console.log(err);
    console.log(`Connected to port ${PORT} `)
});