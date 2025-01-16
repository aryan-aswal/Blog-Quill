require('dotenv').config();
const User = require('../models/User');
const Blog = require('../models/Blog');
const Otp = require('../models/OTP');

const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// google auth from firebase-admin/auth
const { getAuth } = require('firebase-admin/auth');

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter email",
            })
        }

        const user = await User.findOne({ "personal_info.email": email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        await Otp.create({ email: email, otp: otp });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        })

    } catch (error) {
        console.log("Error in sendOtp Controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error?.message
        })
    }
}

const signUp = async (req, res) => {
    try {
        const { fullName, email, password, otp } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required details",
            })
        }

        const user = await User.findOne({ "personal_info.email": email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const originalOtp = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1);

        if (originalOtp.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP not found!",
            })
        }

        if (Number.parseInt(otp) != originalOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        const username = email.split('@')[0];
        const userDetails = await User.create({ "personal_info": { fullname: fullName, email, password: hashedPassword, username: username } });

        res.status(200).json({
            success: true,
            message: "Account created successfully",
            data: userDetails,
        })

    } catch (error) {
        console.log("Error in SignIn Controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        })
    }
}

const generateToken = (userDetails) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const payload = {
        email: userDetails.personal_info.email,
        id: userDetails._id,
        username: userDetails.username,
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2h",
    });

    // Set token in HTTP-only cookie --> 

    // 1) HTTP-Only Cookie: The httpOnly flag ensures that the cookie cannot be accessed via JavaScript, which protects 
    //    against XSS attacks. The secure flag should be set to true in production to ensure that cookies are only sent over HTTPS.

    // 3) SameSite Attribute: The sameSite attribute helps protect against CSRF attacks by controlling how cookies are sent with 
    //    requests from external sites. Setting it to "strict" or "lax" provides additional security.

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
    };

    userDetails.personal_info.password = undefined;

    return { token, options };
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill the required details",
            })
        }

        const userDetails = await User.findOne({ "personal_info.email": email });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        if (userDetails.google_auth) {
            return res.status(400).json({
                success: false,
                message: "Please login using google",
            })
        }

        // Check if password is correct
        if (await bcrypt.compare(password, userDetails.personal_info.password)) {

            const { token, options } = generateToken(userDetails);
            res.cookie("token", token, options).status(200).json({
                success: true,
                data: { token, userDetails },
                message: "Logged in successfully",
            });

        } else {
            res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}


// google auth controller
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify the token
        const decodedUser = await getAuth().verifyIdToken(token);
        const { email, name, picture: avatarUrl } = decodedUser;

        // Modify avatar URL if needed
        const avatar = avatarUrl.replace("s96-c", "s384-c");

        // Find the user by email
        let userDetails = await User.findOne({ "personal_info.email": email });

        if (userDetails) {
            // If the user exists but does not use Google authentication
            if (!userDetails.google_auth) {
                return res.status(403).json({
                    success: false,
                    message: "User already exists. Sign in using email and password.",
                });
            }

            // Generate a token for the existing user
            const { token, options } = generateToken(userDetails);

            // Send the response with the token
            return res.cookie("token", token, options).status(200).json({
                success: true,
                data: { token, userDetails },
                message: "Logged in successfully",
            });
        } else {
            // If the user does not exist, create a new user
            let username = email.split('@')[0];

            const newUser = await User.create({
                "personal_info": { fullname: name, username, email, profile_img: avatar },
                google_auth: true,
            });

            // Generate a token for the new user
            const { token, options } = generateToken(newUser);

            // Send the response with the token
            return res.cookie("token", token, options).status(200).json({
                success: true,
                data: { token, userDetails: newUser },
                message: "Logged in successfully",
            });
        }
    } catch (error) {
        // Handle errors related to token verification
        if (error.name === "FirebaseAuthError") {
            return res.status(400).json({
                success: false,
                message: "access_token is invalid",
                error: error.message,
            });
        }

        // Handle any other errors
        console.error("Error occurred in googleAuth controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill the input fields"
            })
        }

        const userDetails = await User.findById(req.user.id).select('personal_info.password google_auth');
        
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        if(userDetails.google_auth) {
            return res.status(400).json({
                success: false,
                message: "Please change password from google",
            })
        }

        const password = userDetails.personal_info.password;
        const match = await bcrypt.compare(currentPassword, password);

        if(!match) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password"
            })
        }

        const updatedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { "personal_info.password": updatedPassword});

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })

    } catch (error) {
        console.log("Error occurred at changePassword controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        })
    }
}

module.exports = { sendOtp, signIn, signUp, googleAuth, changePassword };