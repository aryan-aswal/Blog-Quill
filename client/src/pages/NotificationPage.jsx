import React, { useEffect, useState } from 'react';
import NotificationFilter from '../utils/NotificationFilter.json';
import Loader from '../components/common/Loader';
import NoData from '../components/core/HomePage/NoData';
import AnimationWrapper from '../components/common/AnimationWrapper';
import NotificationCard from '../components/core/NotificationPage/NotificationCard';
import { useSelector } from 'react-redux';
import { fetchNotifications } from '../services/operations/NOTIFICATION_API';
import toast from 'react-hot-toast';

const NotificationPage = () => {
    const { token } = useSelector((state) => state.auth);
    const [activeButton, setActiveButton] = useState('All');

    const [notifications, setNotifications] = useState(null);

    const getNotifications = async () => {
        const response = await fetchNotifications(token, activeButton.toLowerCase());
        if (!response) {
            return toast.error("Failed to fetch notifications");
        }
        setNotifications(response.data);
    }

    useEffect(() => {
        if (token) {
            getNotifications();
        }
    }, [token, activeButton])

    return (
        <div>
            <h1 className=''>Recent Notifications</h1>
            <div className='my-8 flex gap-6'>
                {
                    NotificationFilter.map((notification, index) => {
                        return (
                            <button
                                key={index}
                                value={notification.button}
                                className={`py-2 ${activeButton === notification.button ? 'btn-dark' : 'btn-light'}`}
                                onClick={(e) => setActiveButton(e.target.innerText)}
                            >
                                {notification.button}
                            </button>
                        )
                    })
                }
            </div>
            {
                notifications == null ?
                    (<Loader />)
                    :
                    (
                        <div>
                            {
                                notifications.length === 0 ?
                                    <NoData message={"Nothing Available"} />
                                    :
                                    (
                                        notifications.map((notification, index) => {
                                            return (
                                                <AnimationWrapper key={index} transition={{ delay: index * 0.08 }}>
                                                    <NotificationCard notification={notification} index={index} notificationState={{ notifications, setNotifications }} notifications={notifications} setNotifications={setNotifications} />
                                                </AnimationWrapper>
                                            )
                                        })
                                    )
                            }
                        </div>
                    )
            }
        </div>
    )
}

export default NotificationPage