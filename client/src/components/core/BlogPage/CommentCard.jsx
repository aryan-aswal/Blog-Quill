import React, { useState } from 'react'
import { getDay } from '../../../utils/dateConverter';
import { useSelector } from 'react-redux';
import CommentField from './CommentField';
import toast from 'react-hot-toast';
import { fetchReplyComments } from '../../../services/operations/COMMENT_API';

const CommentCard = ({ comment, index, leftVal, commentArr, setCommentArr, blog, setBlog }) => {
    const { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt } = comment;
    const { token } = useSelector(state => state.auth);

    const [isReplying, setIsReplying] = useState(false);

    const loadReplies = async () => {
        const response = await fetchReplyComments({ commentId: comment._id });
        if (!response || !response.data) return;
    
        // Set additional properties for each reply
        const replies = response.data.map((reply) => ({
            ...reply,
            childrenLevel: comment.childrenLevel + 1,
            parentIndex: index,
            hideReplies: true,
        }));
    
        // Update current comment to show replies
        comment.hideReplies = false;
    
        // Insert replies after the parent comment
        const updatedComments = [...commentArr];
        updatedComments.splice(index + 1, 0, ...replies);
    
        setCommentArr(updatedComments);
    };
    
    const removeReplies = () => {
        // Calculate number of replies to remove based on current children count
        const numReplies = comment.children.length;
    
        // Set hideReplies to true to mark replies as hidden
        comment.hideReplies = true;
    
        // Create a copy of the array and remove the replies
        const updatedComments = [...commentArr];
        updatedComments.splice(index + 1, numReplies);
    
        setCommentArr(updatedComments);
    };
    
      

    const handleReplyClick = () => {
        if (!token) return toast.error("Please login to leave a comment");
        setIsReplying(!isReplying);
    }

    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex gap-3 items-center mb-8'>
                    <img src={profile_img} className='w-6 h-6 rounded-full ' />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(commentedAt)}</p>
                </div>
                <p className='font-gelasio text-xl ml-3'>{comment.comment}</p>
                <div className='flex items-center'>
                    {
                        comment.children.length > 0 ?
                            (
                                comment.hideReplies ?
                                    (
                                        <button
                                            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                            onClick={loadReplies}
                                        >
                                            <i className='fi fi-rs-comment-dots'></i>
                                            Show Replies
                                        </button>
                                    )
                                    :
                                    (
                                        <button
                                            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                            onClick={removeReplies}
                                        >
                                            <i className='fi fi-rs-comment-dots'></i>
                                            Hide Replies
                                        </button>
                                    )
                            ) :
                            ("")
                    }
                    <span className='p-2 px-3 flex items-center gap-2'>
                        <button className='underline' onClick={handleReplyClick}>Reply</button>
                    </span>
                </div>



                {
                    isReplying ?
                        (
                            <div className='mt-8'>
                                <CommentField
                                    action={"reply"}
                                    replying_to={comment._id}
                                    blog_author={comment.blog_author}
                                    index={index}
                                    setIsReplying={setIsReplying}
                                    commentArr={commentArr}
                                    setCommentArr={setCommentArr}
                                    blog={blog}
                                    setBlog={setBlog}
                                />
                            </div>
                        )
                        :
                        ("")
                }

            </div>
        </div>
    )
}

export default CommentCard