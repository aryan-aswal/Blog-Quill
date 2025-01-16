const router = require('express').Router();
const { sendOtp, signIn, signUp, googleAuth, changePassword } = require('../controllers/Auth');
const { auth } = require('../middlewares/auth');

router.post('/send-otp', sendOtp);
router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/google-auth', googleAuth);
router.post('/change-password', auth, changePassword);

module.exports = router;