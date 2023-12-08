const mongoose = require('mongoose');
require ('dotenv').config();

//const url = "mongodb://127.0.0.1/notasdb"
const url = process.env.MONGODB_URL;

mongoose.connect(url)
    .then( db => console.log("Base de datos conectada"))
    .catch(err => console.error(err));