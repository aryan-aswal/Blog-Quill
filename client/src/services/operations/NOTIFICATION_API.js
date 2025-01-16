import { notification_endpoints } from '../apis';
import { apiConnector } from '../apiConnector';
import toast from 'react-hot-toast';

const {
    FETCH_NOTIFICATION_COUNT,
    FETCH_NOTIFICATIONS,
    DELETE_NOTIFICATION,
    
} = notification_endpoints;

export const fetchNotificationsCount = async (token) => {
    try {
        const response = await apiConnector('GET', FETCH_NOTIFICATION_COUNT, null, { Authorization: "Bearer " + token });
        console.log("RESPONSE FROM FETCH_NOTIFICATION_COUNT_API", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM FETCH_NOTIFICATION_COUNT: ", error);
    }
}

export const fetchNotifications = async (token, filter) => {
    try {
        const response = await apiConnector('GET', FETCH_NOTIFICATIONS, null, { Authorization: "Bearer " + token }, { filter });
        console.log("RESPONSE FROM FETCH_NOTIFICATIONS_API", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM FETCH_NOTIFICATIONS: ", error);
        toast.error(error.response.data.message);
    }
}

export const deleteNotification = async (token, notification_id) => {
    try {
        const response = await apiConnector('DELETE', DELETE_NOTIFICATION, { id: notification_id }, { Authorization: "Bearer " + token });
        console.log("RESPONSE FROM DELETE_NOTIFICATION_API", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log("ERROR FROM DELETE_NOTIFICATION: ", error);
        toast.error(error.response.data.message);
    }
}