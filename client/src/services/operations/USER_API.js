import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { user_endpoints } from '../apis';
import { setUser } from '../../redux/slices/authSlice';

const { 
    SEARCH_USER_API,
    SEARCH_USER_DETAILS_API,
    CHECK_IS_BLOG_LIKED_API,
    UPLOAD_PROFILE_IMAGE_API,
    UPDATE_USER_DETAILS_API,
    FETCH_USER_BLOGS,
} = user_endpoints;


export const searchUser = async(user) => {
    try {
        const response = await apiConnector('GET', SEARCH_USER_API, null, null, { user });
        console.log("RESPONSE FROM SEARCH USER API: ", response);
        if(!response.data.success) {
            throw new Error(response.data.error);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR OCCURRED AT SEARCH_USER_API: ", error);
    }
}

export const fetchUserDetails = async(username) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector('GET', SEARCH_USER_DETAILS_API, null, null, { username });
        console.log("RESPONSE FROM SEARCH USER DETAILS API: ", response);

        if(!response.data.success) {
            throw new Error(response.data.error);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        return response.data
    } catch (error) {
        console.log("ERROR OCCURRED AT SEARCH_USER_DETAILS_API: ", error);
        toast.error(error?.response?.data?.message)
    }
    toast.dismiss(toastId);
}

export const checkIsBlogLiked = async(_id, token) => {
    try {
        const response = await apiConnector('GET', CHECK_IS_BLOG_LIKED_API, null, {Authorization: `Bearer ${token}`}, { _id });
        console.log("RESPONSE FROM CHECK IS BLOG LIKED API: ", response);
        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;

    } catch (error) {
        console.log("ERROR OCCURRED AT CHECK_IS_BLOG_LIKED_API: ", error);
    }
}

export const uploadProfileImage = (file, token) => {
    return async(dispatch) => {
        const toastId = toast.loading("Uploading...");
        try {
            const formData = new FormData();
            formData.append('profile_img', file);
            const response = await apiConnector('POST', UPLOAD_PROFILE_IMAGE_API, formData, { Authorization: `Bearer ${token}`});
            console.log("RESPONSE FROM UPLOAD PROFILE IMAGE API: ", response);
    
            if(!response.data.success) {
                throw new Error(response.data.error);
            }
            console.log(response.data.data);
            toast.dismiss(toastId);
            toast.success(response.data.message);
            dispatch(setUser(response.data.data));
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
            console.log("ERROR OCCURRED AT UPLOAD_PROFILE_IMAGE_API: ", error);
            toast.error(error?.response?.data?.message);
        }
        toast.dismiss(toastId);
    }
}

export const updateUserDetails = (updates, token) => {
    return async(dispatch) => { 
        const toastId = toast.loading("Updating...");
        try {
            const response = await apiConnector('POST', UPDATE_USER_DETAILS_API, updates, { Authorization: `Bearer ${token}`});
            console.log("RESPONSE FROM UPDATE USER DETAILS API: ", response);
    
            if(!response.data.success) {
                throw new Error(response.data.error);
            }
            
            console.log(response.data.data);
            toast.dismiss(toastId);
            toast.success(response.data.message);
            dispatch(setUser(response.data.data));
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
            console.log("ERROR OCCURRED AT UPDATE_USER_DETAILS_API: ", error);
            toast.error(error?.response?.data?.message);
        }
        toast.dismiss(toastId);
    }
}

export const fetchUserBlogs = async(draft, token) => {
    const toastId = toast.loading("Updating...");
    console.log(draft);
    try {
        const response = await apiConnector('GET', FETCH_USER_BLOGS, null, { Authorization: `Bearer ${token}`}, { draft });
        console.log("RESPONSE FROM FETCH USER BLOGS API: ", response);
        if(!response.data.success) {
            throw new Error(response.data.error);
        }
        toast.dismiss(toastId);
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        console.log("ERROR OCCURRED AT FETCH USER BLOGS: ", error);
        toast.error(error?.response?.data?.message);
    }
    toast.dismiss(toastId);
}