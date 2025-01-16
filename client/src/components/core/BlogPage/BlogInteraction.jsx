import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import { setBlogData, toggleCommentBox } from '../../../redux/slices/blogSlice';
import { likeBlog } from '../../../services/operations/BLOG_API';

const BlogInteraction = ({ blog, setBlog, isLiked, setIsLiked }) => {

    const { title, content, bannerImage, description, publishedAt, tags, _id, author , activity } = blog;
    const { total_comments, total_likes, total_reads, total_parent_comments } = activity;   
    const { personal_info: { fullname, profile_img, username } } = author;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const { user }  = useSelector(state => state.auth);
    const { isCommentBoxOpen } = useSelector(state => state.blog);

    const likeClickHandler = async () => {
        if(!token) return toast.error("Please login to like the blog");
        else {
            if(isLiked) {
                const response = await likeBlog(_id, false, token);
                if(!response) return toast.error("Failed to unlike the blog");
            } else {
                const response = await likeBlog(_id, true, token);
                if(!response) return toast.error("Failed to like the blog");
            }
            setIsLiked(!isLiked);
            setBlog({... blog, activity: {...activity, total_likes: isLiked ? total_likes - 1 : total_likes + 1 }});
            dispatch(setBlogData({... blog, activity: {...activity, total_likes: isLiked ? total_likes - 1 : total_likes + 1 }}));
        }
    }
    return (
        <div>
            <hr className='border-grey my-2' />

            <div className='flex gap-6 justify-between'>
                <div className='flex gap-3 items-center'>
                    <button 
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 ${isLiked ? 'bg-red/20 text-red' : ''}`}
                        onClick={likeClickHandler}
                    >
                        <i className={`fi fi-${isLiked ? "sr" : "rr"}-heart`}></i>
                    </button>
                    <p className='text-xl text-dark-grey '>{total_likes}</p>

                    <button 
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'
                        onClick={() => dispatch(toggleCommentBox())}
                    >
                        <i className='fi fi-rr-comment-dots'></i>
                    </button>
                    <p className='text-xl text-dark-grey '>{total_comments}</p>
                </div>

                <div className='flex gap-6 items-center'>
                    {
                        token && 
                        username === user?.personal_info?.username && 
                        (<Link to={`/editor/${_id}`} className='underline'>Edit</Link>)
                    }
                    <Link to={`https://twitter.com/intent/tweet/?text=Read ${title}$url=${location.href}`}>
                        <i className='fi fi-brands-twitter text-xl hover:text-twitter'></i>
                    </Link>
                </div>
            </div>

            <hr className='border-grey my-2' />
        </div>
    )
}

export default BlogInteraction