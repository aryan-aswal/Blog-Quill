import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { addComment, fetchReplyComments } from '../../../services/operations/COMMENT_API';
import { useParams } from 'react-router-dom'

const CommentField = ({ action, blog_author, setCommentAdded, commentAdded, replying_to = undefined, index = undefined, setIsReplying = undefined, blog, setBlog, commentArr, setCommentArr }) => {
    const { _id } = useParams();
    const { token } = useSelector(state => state.auth);
    const [comment, setComment] = useState('');

    // const clickHandler = async () => {
    //     if (!token) return toast.error("Please login to leave a comment");

    //     if (!comment.length) return toast.error("Comment can't be empty!");

    //     let response;

    //     if (action == 'reply') {
    //         response = await addComment({ _id, comment, blog_author, replying_to }, token);
    //     } else {
    //         response = await addComment({ _id, comment, blog_author }, token);
    //     }

    //     if (!replying_to && response.success) {
    //         // parent comment
    //         response.data.childrenLevel = 0;
    //         response.data.parentIndex = null;
    //         setCommentArr([response.data, ...commentArr]); // Add new comment at the start

    //         const updatedActivity = {
    //             ...blog.activity,
    //             total_parent_comments: blog.activity.total_parent_comments + 1,
    //             total_comments: blog.activity.total_comments + 1,
    //         };

    //         setBlog({
    //             ...blog,
    //             activity: updatedActivity,
    //             comments: [response.data, ...blog.comments],
    //         });

    //         setCommentAdded(!commentAdded);
    //     } else {
    //         // reply comment
    //         if (commentArr[index] && commentArr[index].hideReplies === false) {
    //             commentArr.splice(index + 1, commentArr[index].children.length);
    //             commentArr[index].children.length = 0;
    //         }

    //         const response = await fetchReplyComments({ commentId: commentArr[index]._id });
    //         if (!response) return;

    //         response.data.forEach((reply) => {
    //             reply.childrenLevel = commentArr[index].childrenLevel + 1;
    //             reply.parentIndex = index;
    //             reply.hideReplies = true;
    //             commentArr[index].children.push(reply._id);
    //         });

    //         commentArr[index].hideReplies = false;
    //         commentArr.splice(index + 1, 0, ...response.data);

    //         setCommentArr([...commentArr]);

    //         const updatedActivity = {
    //             ...blog.activity,
    //             total_parent_comments: blog.activity.total_parent_comments,
    //             total_comments: blog.activity.total_comments + 1,
    //         };

    //         setBlog({
    //             ...blog,
    //             comments: commentArr,
    //             activity: updatedActivity,
    //         });
    //         setIsReplying(false);
    //     }
    // };

    const clickHandler = async () => {
        if (!token) return toast.error("Please login to leave a comment");
        if (!comment.length) return toast.error("Comment can't be empty!");

        let response;

        if (action === 'reply') {
            response = await addComment({ _id, comment, blog_author, replying_to }, token);
        } else {
            response = await addComment({ _id, comment, blog_author }, token);
        }

        if (!replying_to && response.success) {
            // Handle parent comment
            const newComment = {
                ...response.data,
                childrenLevel: 0,
                parentIndex: null,
                children: [],
                hideReplies: true,
            };
            setCommentArr([newComment, ...commentArr]);

            setBlog({
                ...blog,
                activity: {
                    ...blog.activity,
                    total_parent_comments: blog.activity.total_parent_comments + 1,
                    total_comments: blog.activity.total_comments + 1,
                },
                comments: [newComment, ...blog.comments],
            });

            setCommentAdded(!commentAdded);
        } else if (response.success) {
            // Handle reply comment
            const newReply = {
                ...response.data,
                childrenLevel: commentArr[index].childrenLevel + 1,
                parentIndex: index,
                hideReplies: true, // Newly added replies should remain hidden until shown
            };

            // Make a copy of the current comments array
            const updatedComments = [...commentArr];

            // Append the new reply's ID to the `children` array for the parent comment
            updatedComments[index].children.push(newReply._id);

            // Insert the new reply just below its parent in `commentArr`
            updatedComments.splice(index + 1, 0, newReply);

            // Update the state
            setCommentArr(updatedComments);
            setBlog({
                ...blog,
                activity: {
                    ...blog.activity,
                    total_comments: blog.activity.total_comments + 1,
                },
                comments: updatedComments,
            });

            setIsReplying(false);

        }
    };

    return (
        <div>

            <textarea
                value={comment}
                placeholder='Leave a comment'
                onChange={(e) => setComment(e.target.value)}
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            ></textarea>

            <button className='btn-dark mt-5 px-10' onClick={clickHandler}>{action}</button>

        </div>
    )
}

export default CommentField