import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { comment_endpoints } from '../apis'

const {
    ADD_COMMENT_API,
    FETCH_PARENT_COMMENTS,
    FETCH_REPLY_COMMENTS
} = comment_endpoints


export const addComment = async(data, token) => {
    try {
        const response = await apiConnector('POST', ADD_COMMENT_API, data, { Authorization: "Bearer " + token });
        console.log("RESPONSE FROM ADD_COMMENT_API", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM ADD_COMMENT_API: ", error);
    }
}

export const fetchParentComments = async(data) => {
    try {
        const response = await apiConnector('GET', FETCH_PARENT_COMMENTS, null, null, data);
        console.log("RESPONSE FROM FETCH_PARENT_COMMENTS", response);
        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM FETCH_PARENT_COMMENTS: ", error);
    }
}

export const fetchReplyComments = async(data) => {
    try {
        const response = await apiConnector('GET', FETCH_REPLY_COMMENTS, null, null, data);
        console.log("RESPONSE FROM FETCH_REPLY_COMMENTS", response);
        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM FETCH_REPLY_COMMENTS: ", error);
    }
}