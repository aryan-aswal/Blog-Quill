const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req?.body?.token || req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error while verifying token: ", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        });
    }
};

module.exports = { auth };
