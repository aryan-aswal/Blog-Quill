import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../../../utils/dateConverter'
import NotificationCommentField from './NotificationCommentField'
import { deleteNotification } from '../../../services/operations/NOTIFICATION_API'
import { useSelector } from 'react-redux'

const NotificationCard = ({ notification, index, notificationState, notifications, setNotifications }) => {
    let { seen, blog: { _id, title }, createdAt, replied_on_comment, type, comment, user, user: { personal_info: { profile_img, username, fullname } }, _id: notification_id } = notification;
    const { token } = useSelector((state) => state.auth);
    const [ isReplying, setIsReplying ] = useState(false);

    const handleReply = () => {
        setIsReplying(prev => !prev);
    }
    const handleDelete = async() => {
        const response = await deleteNotification(token, notification_id);
        const updatedNotification = notifications.filter((notification) => notification._id !== response.data._id);
        setNotifications(updatedNotification);
    }
    
    return (
        <div className={`p-6 border-6 border-grey border-l-black ${!seen ? "border-l-2" : ""}`}>
            <div className='flex gap-5 mb-3 '>
                <img src={profile_img} className='w-14 h-14 flex-none rounded-full' />
                <div className='w-full'>
                    <h1 className='font-medium text-xl text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                        <Link to={`user/${username}`} className='mx-1 text-black underline'>@{username}</Link>
                        <span className='font-normal'>
                            {
                                type == 'like' ? ' liked your blog' : type == 'comment' ? ' commented on your blog' : ' replied on'
                            }
                        </span>
                    </h1>
                    {
                        type == 'reply' ?
                            (
                                <div className='p-4 mt-4 rounded-md bg-grey '>
                                    <p>{replied_on_comment.comment}</p>
                                </div>
                            )
                            :
                            (
                                <Link to={`/blog/${_id}`} className='font-medium text-dark-grey hover:underline line-clamp-1'>
                                    {`"${title}"`}
                                </Link>
                            )
                    }
                </div>
            </div>

            {
                type != 'like' ?
                    (
                        <p className='ml-14 pl-5 font-gelasio text-xl my-5'>{comment.comment}</p>
                    )
                    :
                    (<></>)
            }

            <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
                <p>{getDay(createdAt)}</p>

                {
                    type != 'like' ?
                        (
                            <>
                                <button className='underline hover:text-black' onClick={handleReply}>Reply</button>
                                <button className='underline hover:text-black' onClick={handleDelete}>Delete</button>
                            </>
                        )
                        :
                        (<></>)
                }
            </div>

            {
                isReplying ? 
                <div className='mt-8 ml-16'>
                    <NotificationCommentField
                        _id={_id}
                        blog_author={user}
                        index={index}
                        replying_to={comment._id}
                        setReplying={setIsReplying}
                        notification_id={notification_id}
                        notificationData={notificationState}
                     />
                </div> : ""
            }
        </div>
    )
}

export default NotificationCard