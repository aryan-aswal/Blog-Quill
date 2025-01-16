import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { blog_endpoints } from "../apis";
import { setBlogData, setLoading } from "../../redux/slices/blogSlice";

const {
    CREATE_BLOG_API,
    UPLOAD_BY_FILE_API,
    CREATE_DRAFT_BLOG_API,
    FETCH_BLOGS_API,
    FETCH_TRENDING_BLOGS_API,
    FETCH_BLOGS_BY_CATEGORY_API,
    SEARCH_BLOG_BY_QUERY_API,
    FETCH_BLOG_DETAILS_API,
    FETCH_SIMILAR_BLOGS_API,
    LIKE_BLOG_API
} = blog_endpoints;

export const uploadBannerImage = async (file, token) => {
    const toastId = toast.loading("Uploading banner image...");
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiConnector('POST', UPLOAD_BY_FILE_API, formData, { Authorization: 'Bearer ' + token });
        console.log("Banner image uploaded successfully: ", response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        return response.data.file.url;
    } catch (error) {
        console.log("Error while uploading banner image: ", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}


export const createBlog = async (blog, token, navigate, dispatch) => {
    const toastId = toast.loading("Creating blog...");
    try {
        const response = await apiConnector('POST', CREATE_BLOG_API, blog, { Authorization: 'Bearer ' + token });
        console.log("Blog created successfully: ", response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        localStorage.removeItem('blog');

        dispatch(setBlogData({
            _id: '',
            title: '',
            description: '',
            bannerImage: '',
            content: [],
            tags: [],
            author: {
                "personal_info": {},
            },
            activity: { total_comments: 0, total_likes: 0, total_parent_comments: 0, total_reads: 0 },
            publishedAt: "",
        }));

        navigate('/');
    } catch (error) {
        console.log("Error while creating blog: ", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

export const draftBlog = async (blog, token, navigate) => {
    const toastId = toast.loading("Saving draft...");
    try {
        const response = await apiConnector('POST', CREATE_DRAFT_BLOG_API, blog, { Authorization: 'Bearer ' + token });
        console.log("Draft saved successfully: ", response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        localStorage.removeItem('blog');
        navigate('/');

    } catch (error) {
        console.log("Error while saving draft: ", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

export const fetchBlogs = (pageNumber) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        console.log(pageNumber);
        try {

            const response = await apiConnector('GET', FETCH_BLOGS_API, null, null, { pageNumber });
            console.log("Blogs fetched successfully: ", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            return response.data;

        } catch (error) {
            console.log("Error while fetching blogs: ", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
    }
}

export const fetchTrendingBlogs = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', FETCH_TRENDING_BLOGS_API);
            console.log("RESPONSE FROM FETCH TREDNING BLOGS API", response.data);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.log("ERROR OCCURRED AT FETCH_TRENDING_API: ", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
    }
}

export const fetchBlogsByCategory = (tag, pageNumber) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector('GET', FETCH_BLOGS_BY_CATEGORY_API, null, null, { tag, pageNumber });
            console.log("RESPONSE FROM FETCH_BLOGS_BY_CATEGORY_API", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.log("ERROR OCCURRED AT FETCH_BLOGS_BY_CATEGORY_API: ", error);
            toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
    }
}

export const searchBlogByQuery = async (pageNumber, query) => {
    try {
        const response = await apiConnector('GET', SEARCH_BLOG_BY_QUERY_API, null, null, { pageNumber, query });
        console.log("RESPONSE FROM SEARCH_BLOG_BY_QUERY_API: ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("Error while searching blog by query: ", error);
    }
}

export const fetchBlogDetails = async (blogId) => {
    const toastId = toast.loading("Fetching blog details...");
    try {
        const response = await apiConnector('GET', FETCH_BLOG_DETAILS_API, null, null, { _id: blogId });
        console.log("RESPONSE FROM FETCH_BLOG_DETAILS_API: ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        console.log("Error while fetching blog details: ", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

export const fetchSimilarBlogs = async (tagString) => {
    try {
        const response = await apiConnector('GET', FETCH_SIMILAR_BLOGS_API, null, null, { tagString });
        console.log("RESPONSE FROM FETCH_BLOG_DETAILS_API: ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("Error while fetching blog details: ", error);
    }
}

export const likeBlog = async (_id, isLiked, token) => {
    try {
        console.log(_id);
        const response = await apiConnector('PATCH', LIKE_BLOG_API, null, { Authorization: `Bearer ${token}` }, { _id, isLiked });
        console.log("RESPONSE FROM LIKE_BLOG_API: ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("Error while liking blog: ", error);
    }
}