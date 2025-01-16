import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { addComment } from '../../../services/operations/COMMENT_API';

const NotificationCommentField = ({_id, blog_author, index=undefined, replying_to=undefined, setReplying, notification_id, notificationData }) => {
    const { token } = useSelector((state) => state.auth);
    const [comment, setComment] = useState('');
    
    const handleComment = async() => {
        if (!comment.length) return toast.error("Comment can't be empty!");
        const response = await addComment({ _id, comment, blog_author, replying_to }, token);
        console.log(response);
        if(response === undefined) {
            return toast.error("Something went wrong...")
        }
        toast.success("replied successfully...");
        setComment('');
        setReplying(false);
    }

    let { id: user_id} = blog_author;
    let { notifications, notifications: { result }, setNotifications } = notificationData;
    return (
        <div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Leave a reply...'
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            >
            </textarea>

            <button className='btn-dark mt-5 px-10' onClick={handleComment}>Reply</button>
        </div>
    )
}

export default NotificationCommentField