require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const fileUpload = require('express-fileupload');

// Firebase admin and serviceAccount
const admin = require('firebase-admin');
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

const authRouter = require('./routes/auth');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const notificationRouter = require('./routes/notification');

const { dbConnect } = require('./config/database');
const { cloduinaryConnect } = require('./config/cloudinary');

const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const app = express();

// Enable CORS
app.use(cors());

// Enable parsing of JSON and URL-encoded data with limits
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Enable file uploads using express-fileupload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
}));



// Enable cookie parsing
app.use(cookieParser());

// Define routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/notification', notificationRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Connect to the database and Cloudinary
dbConnect();
cloduinaryConnect();
