const mongoose = require('mongoose');
require('dotenv').config();
const DATABASE_URI = process.env.DATABASE_URI;

const dbConnect = () => {
    mongoose.connect(DATABASE_URI)
    .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY");
    })
    .catch((err) => {
        console.log("ERROR OCCURRED AT DB CONNECTION", err);
        process.exit(1);
    })
} 


module.exports = { dbConnect };