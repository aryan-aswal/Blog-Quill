require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const options = {
    folder: process.env.ASSET_FOLDER,
    unique_filename: true,
    resource_type: "auto",

}

const imageUploader = async(file) => {
    try {
        const imageInfo = await cloudinary.uploader.upload(file.tempFilePath, options);
        return imageInfo;
    } catch (error) {
        console.log("Error occurred at imageUploader: ", error);
    }
}

module.exports = { imageUploader };