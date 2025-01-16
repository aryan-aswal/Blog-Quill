var cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloduinaryConnect = async() => {
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET,
        });
    } catch (error) {
        console.log("Error occurred at cloudinaryConnect", error);
    }
}


module.exports = { cloduinaryConnect };