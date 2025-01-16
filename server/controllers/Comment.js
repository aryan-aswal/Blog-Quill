const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");

const addComment = async (req, res) => {
    try {
        const { _id, comment, blog_author, replying_to, notification_id } = req.body;

        if (!_id || !comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const newComment = await Comment.create({ blog_id: _id, blog_author, comment, commented_by: req.user.id, parent: replying_to ? replying_to : null, isReply: replying_to ? true : false });
        await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: newComment._id } });
        await Blog.findOneAndUpdate({ _id }, { $push: { comments: newComment._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 } });
        await Notification.create({ blog: _id, type: replying_to ? "reply" : "comment", notification_for: blog_author, user: req.user.id, comment: newComment._id, replied_on_comment: replying_to ? replying_to : null });

        const commentData = await Comment.findById(newComment._id)
            .populate('children')
            .populate('commented_by', "personal_info.profile_img personal_info.full_name personal_info.username personal_info.email personal_info.fullname")
            .populate('parent')

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            data: commentData
        })
    } catch (error) {
        console.log("Error occurred at addComment controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        });
    }
}

const fetchParentComments = async (req, res) => {
    try {
        const commentsLimit = 5;
        const { _id, commentPage } = req.query;

        if (!_id || !commentPage) {
            return res.status(400).json({
                sucsess: false,
                message: "Please fill all the fields",
            })
        }

        let comments = await Comment.find({ blog_id: _id, isReply: false })
        const totalParentComments = comments.length;

        comments = await Comment.find({ blog_id: _id, isReply: false })
            .populate('commented_by', "personal_info.profile_img personal_info.full_name personal_info.username personal_info.email personal_info.fullname")
            .sort({ commentedAt: -1 })
            .skip((commentPage - 1) * commentsLimit)
            .limit(commentsLimit);

        if (comments.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found",
                data: { commentPage: 0, comments, totalParentComments: 0 }
            })
        }

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: { commentPage, comments, totalParentComments }
        })
    } catch (error) {
        console.log("ERROR OCCURRED AT fetchParentsComments controller", error);
    }
}

const fetchReplyComments = async (req, res) => {
    try {
        const { commentId } = req.query;
        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            })
        }

        let comments = await Comment.find({ parent: commentId })
            .populate('commented_by', "personal_info.profile_img personal_info.full_name personal_info.username personal_info.email personal_info.fullname")
            .sort({ commentedAt: -1 });

        if (comments.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No comments found",
                data: comments,
            })
        }
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: comments,
        })
    } catch (error) {
        console.log("ERROR OCCURRED AT fetchReplyComments controller", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

module.exports = {
    addComment,
    fetchParentComments,
    fetchReplyComments,
}
