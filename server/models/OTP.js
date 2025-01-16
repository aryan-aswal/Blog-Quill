const mongoose = require('mongoose');
const { mailSender } = require('../utils/mailSender');
const { otpEmailTemplate } = require('../mails/otpScript');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        index: { expires: '5m' },
    }
})

otpSchema.pre('save', async function(next) {
    const mailResponse = await mailSender(this.email, "BlogQuill OTP Verification Mail", otpEmailTemplate(this.otp));
    console.log("Mail Response: ", mailResponse);
    next();
});

module.exports = mongoose.model('Otp', otpSchema)