const User = require("../models/User");
const Notification = require("../models/Notification");
const Blog = require('../models/Blog');
const mongoose = require("mongoose");


const fetchNotificationsCount = async (req, res) => {
    try {
        const notificationDetails = await Notification.find({ notification_for: req.user.id, seen: false, user: { $ne: req.user.id } });

        if (!notificationDetails || notificationDetails.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found",
                data: false
            })
        }

        res.status(200).json({
            success: true,
            message: "Notifications count fetched successfully",
            data: true
        })

    } catch (error) {
        console.log("Error occurred at fetchNotificationsCount controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const fetchNotifications = async (req, res) => {
    try {
        const { filter } = req.query;
        
        const notificationDetails = await Notification.find({ notification_for: req.user.id, user: { $ne: req.user.id }, type: filter !== 'all' ? filter : { $ne: 'all' } })
            .populate('user', 'personal_info.username personal_info.profile_img personal_info.fullname')
            .populate('blog', 'title')
            .populate('comment', 'comment')
            .populate('replied_on_comment', 'comment')
            .populate('reply', 'comment')
            .sort({ createdAt: -1 });

        await Notification.updateMany({ notification_for: req.user.id, seen: false, user: { $ne: req.user.id } }, { seen: true });


        if(!notificationDetails || notificationDetails.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notificationDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide notification id"
            })
        }
        const userId = req.user.id;
        console.log(id, userId);
        const notificationDetails = await Notification.findOneAndDelete({_id: id, notification_for: userId, user: { $ne: userId } });

        if(!notificationDetails) {
            return res.status(404).json({
                success: false,
                message: "No notification found with the provided id"
            })
        }

        console.log(notificationDetails);

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
            data: notificationDetails
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

module.exports = {
    fetchNotificationsCount,
    fetchNotifications,
    deleteNotification
}