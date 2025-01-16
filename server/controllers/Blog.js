const User = require('../models/User');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const { imageUploader } = require('../utils/imageUploader');
const { linkTool } = require('../utils/linkTool');
const mongoose = require('mongoose');

const createBlog = async (req, res) => {
    try {
        const { title, description, tags, content, bannerImage, _id } = req.body;

        if (!title || !description || !tags.length || !content.blocks.length || !bannerImage) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log(_id);

        if (!_id) {
            const blogDetails = await Blog.create({ title, description, tags, content, bannerImage, author: user._id })
            await User.findByIdAndUpdate(req.user.id, { $push: { blogs: blogDetails._id }, $inc: { "account_info.total_posts": 1 } });

            const blog = await Blog.findById(blogDetails._id).populate('author', "personal_info.profile_img personal_info.username personal_info.fullname _id");
            return res.status(200).json({
                success: true,
                message: "Blog created successfully",
                data: blog
            })
        }

        const blogDetails = await Blog.findByIdAndUpdate(_id, { title, description, tags, content, bannerImage, author: user._id, draft: false }, { new: true })
            .populate('author', "personal_info.profile_img personal_info.username personal_info.fullname _id");

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blogDetails,
        })

    } catch (error) {
        console.log("Error while creating blog: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error?.message,
        });
    }
}

const createDraftBlog = async (req, res) => {
    try {
        let { title, description, tags, content, bannerImage, _id } = req.body;

        if (!title || !bannerImage) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!_id) {
            const blogDetails = await Blog.create({ title, description, tags, content, bannerImage, author: user._id, draft: true });
            await User.findByIdAndUpdate(req.user.id, { $push: { blogs: blogDetails._id } });
            blogDetails.author = user;
            return res.status(200).json({
                success: true,
                message: "Blog created successfully",
                data: blogDetails
            })
        }

        const blogDetails = await Blog.findOneAndUpdate({ _id }, { title, description, tags, content, bannerImage, author: user._id, draft: true }, { new: true }).populate('author');
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blogDetails
        })
    } catch (error) {
        console.log("Error while creating blog: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error?.message,
        });
    }
}

const fetchBlogs = async (req, res) => {
    try {
        const { pageNumber } = req.query;
        const blogLimit = 10;

        if (!pageNumber) {
            return res.status(400).json({
                success: false,
                message: "Page Number is requierd",
                data: [],
            })
        }
        const blogs = await Blog.find({ draft: false })
            .populate('author', "personal_info.profile_img personal_info.username personal_info.fullname _id")
            .sort({ publishedAt: -1 })
            .skip((pageNumber - 1) * blogLimit)
            .limit(blogLimit);

        if (!blogs.length) {
            return res.status(404).json({
                success: false,
                message: "No More blogs found"
            });
        }
        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.log("Error while fetching blogs: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error?.message,
        });
    }
}

const fetchTrendingBlogs = async (req, res) => {
    const blogLimit = 10;
    try {
        const blogs = await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname")
            .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 })
            .limit(blogLimit)
            .select("title publishedAt _id");

        console.log(blogs);
        if (!blogs.length) {
            return res.status(404).json({
                success: false,
                message: "No Blogs Available"
            })
        }
        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
        })
    } catch (error) {
        console.log("Error occurred at blog ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        })
    }
}

const searchBlogByTag = async (req, res) => {
    const maxLimit = 10;
    try {
        const { pageNumber, tag } = req.query;

        if (!pageNumber) {
            return res.status(400).json({
                success: false,
                message: "Page Number is requierd",
                data: [],
            })
        }

        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Please provide a tag"
            })
        }

        const query = { draft: false, tags: `${tag.toLowerCase()}` };
        const blogs = await Blog.find(query)
            .populate('author', "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ "publishedAt": -1 })
            .select("title description bannerImage activity tags publishedAt")
            .skip((pageNumber - 1) * maxLimit)
            .limit(maxLimit);

        if (!blogs.length) {
            return res.status(404).json({
                success: false,
                message: "No Blogs found",
                data: [],
            })
        }

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
        })
    } catch (error) {
        console.log("Error occurred at searchBlogByTag controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const searchBlogByQuery = async (req, res) => {
    const maxLimit = 10;
    try {
        const { pageNumber, query } = req.query;

        if (!pageNumber) {
            return res.status(400).json({
                success: false,
                message: "Page Number is requierd",
                data: [],
            })
        }

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Please provide a query"
            })
        }


        // regular expression search in mongodb
        const titleBlogs = await Blog.find({ draft: false, title: { $regex: query, $options: 'i' } })
            .populate('author', "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ "publishedAt": -1 })
            .select("title description bannerImage activity tags publishedAt")
            .skip((pageNumber - 1) * maxLimit)
            .limit(maxLimit);

        const tagBlogs = await Blog.find({ draft: false, tags: query })
            .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ publishedAt: -1 })
            .select("title description bannerImage activity tags publishedAt")
            .skip((pageNumber - 1) * maxLimit)
            .limit(maxLimit);

        const blogs = new Set([...titleBlogs, ...tagBlogs]);

        if (!blogs.size) {
            return res.status(404).json({
                success: false,
                message: "No Blogs found",
                data: [],
            })
        }

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: [...blogs],
        })

    } catch (error) {
        console.log("Error occurred at searchBlogByQuery controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const fetchBlogDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a blog id"
            });
        }

        const blog = await Blog.findByIdAndUpdate(_id, { $inc: { "activity.total_reads": 1 } }, { new: true })
            .populate('author', "personal_info.fullname personal_info.username personal_info.profile_img")
            .select("title description content tags bannerImage publishedAt activity comments");

        await User.findByIdAndUpdate(blog.author._id, { $inc: { "account_info.total_reads": 1 } }, { new: true });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        console.log("Error while fetching blog: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error?.message,
        });
    }
}

const fetchSimilarBlogs = async (req, res) => {
    try {
        const { tagString } = req.query;

        const tags = tagString.split(',');

        const maxLimit = 6;
        if (!tags || !tags.length) {
            return res.status(400).json({
                success: false,
                message: "Please provide tags"
            });
        }
        const blogs = await Blog.find({ tags: { $in: tags }, draft: false })
            .populate('author', "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ publishedAt: -1 })
            .select("title description bannerImage activity tags publishedAt")
            .limit(maxLimit);

        if (!blogs.length) {
            return res.status(404).json({
                success: false,
                message: "No Blogs found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
        });
    } catch (error) {
        console.log("Error occurred at fetchSimilarBlogs controller: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        });
    }
}
const fetchDataFromLink = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Please provide a url"
            });
        }
        const response = await linkTool(url);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error while fetching data: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const likeBlog = async (req, res) => {
    try {
        const { _id, isLiked } = req.query;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid blog ID",
            });
        }


        if (isLiked !== "true" && isLiked !== "false") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid value for isLiked (true or false)",
            });
        }

        const likeValue = isLiked === "true" ? 1 : -1;
        

        const blog = await Blog.findByIdAndUpdate(_id, { $inc: { "activity.total_likes": likeValue } }, { new: true })
            .populate('author', "personal_info.fullname personal_info.username personal_info.profile_img");

        if(!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
       
        if(isLiked === "false") await Notification.findOneAndDelete({blog: blog._id, user: req.user.id});
        else await Notification.create({ user: req.user.id, type: "like", blog: _id, notification_for: blog.author._id, message: "liked your blog" });

        res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            data: blog
        });
    } catch (error) {
        console.log("Error occurred at :", error);
        res.status(500).json({
            success: true,
            message: "Internal server error",
            error: error?.message
        })
    }
}

const uploadByFile = async (req, res) => {
    try {
        const { image } = req.files;
        
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Please provide an image"
            });
        }
        const imageInfo = await imageUploader(image);
        const response = {
            type: imageInfo.resource_type,
            success: 1,
            file: {
                url: imageInfo.secure_url,
            },
            message: "Image uploaded successfully",
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message,
        })
    }
}

const uploadByUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Please provide an image url"
            });
        }
        const response = {
            success: 1,
            file: {
                url,
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error?.message
        })
    }
}

module.exports = {
    createBlog,
    fetchDataFromLink,
    uploadByFile,
    uploadByUrl,
    createDraftBlog,
    fetchBlogs,
    fetchTrendingBlogs,
    searchBlogByTag,
    searchBlogByQuery,
    fetchBlogDetails,
    fetchSimilarBlogs,
    likeBlog,
};