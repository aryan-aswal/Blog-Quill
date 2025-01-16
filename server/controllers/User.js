const User = require("../models/User");
const Blog = require('../models/Blog');
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const { imageUploader } = require("../utils/imageUploader");

const searchUsers = async (req, res) => {
    try {
        const { user } = req.query;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please Provide required information."
            })
        }
        const users = await User.find({ "personal_info.username": { $regex: user, $options: 'i' } })
            .limit(50)
            .select("personal_info.username personal_info.fullname personal_info.profile_img");

        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        })
    } catch (error) {
        console.log("Error occurred at searchUser controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        })
    }
}

const getUserDetails = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Please provide a username"
            })
        }

        const user = await User.findOne({ "personal_info.username": username })
            .select("personal_info.username personal_info.fullname personal_info.email personal_info.bio personal_info.profile_img social_links account_info blogs")
            .populate([
                { path: "social_links" },
                { path: "account_info" },
                {
                    path: "blogs",
                    populate: { path: "author" },
                    match: { draft: false }
                }
            ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        console.log("Error occurred at getUserDetails controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const checkIsBlogLiked = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a blog id"
            })
        }

        const notification = await Notification.findOne({ blog: _id, type: "like", user: req.user.id });


        if (!notification) {
            return res.status(200).json({
                success: true,
                message: "Blog is not liked by user",
                data: { isLiked: false },
            })
        }

        res.status(200).json({
            success: true,
            message: "Blog is liked by user",
            data: { isLiked: true },
        })

    } catch (error) {
        console.log("Error occurred at checkIsBlogLiked controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        });
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        const { profile_img } = req.files;
        if (!profile_img) {
            return res.status(400).json({
                success: false,
                message: "Please provide an image"
            })
        }
        const response = await imageUploader(profile_img);
        const userDetails = await User.findByIdAndUpdate(req.user.id, { "personal_info.profile_img": response.secure_url }, {new: true});

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            data: userDetails,
        });
    } catch (error) {
        console.log("Error occurred at uploadProfileImage controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const updates = req.body;
        
        if (!Object.keys(updates).length) {
            return res.status(400).json({
                success: false,
                message: "Please provide details to update"
            })
        }
        const user = await User.findOne({ "personal_info.username": updates.personal_info.username });

        if(user && user._id.toString() !== req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

        res.status(200).json({
            success: true,
            message: "User details updated successfully",
            data: updatedUser,
        })
    } catch (error) {
        console.log("Error occurred at updateUserDetails controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const fetchUserBlogs = async(req, res) => {
    try {
        const userId = req.user.id;
        const { draft } = req.query;
        console.log(userId, draft);

        const blogs = await Blog.find({author: userId, draft: draft})
            .sort({createdAt: -1})
            .select('title bannerImage publishedAt blog_id activity description draft');

        console.log(blogs);
        if(blogs.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No Blogs found",
                blogs: [],
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        })
    } catch (error) {
        console.log("Error occurred at fetchUserBlogs controller", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    searchUsers,
    getUserDetails,
    checkIsBlogLiked,
    uploadProfileImage,
    updateUserDetails,
    fetchUserBlogs
}