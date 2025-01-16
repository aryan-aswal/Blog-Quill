const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const mailSender = async (user, subject, htmlBody) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user,
            subject: subject,
            html: htmlBody,
        });
        return info;
    } catch (error) {
        console.log("Error while sending mail", error);
    }
}

module.exports = { mailSender };