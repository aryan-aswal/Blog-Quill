import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../../../utils/dateConverter';

const MinimalBlogPost = ({ blog, index }) => {
    const { author, publishedAt, _id: blog_id, title } = blog;
    const { fullname, profile_img, username } = author.personal_info;
    const { _id: author_id } = author 

    return (
        <Link to={`/blog/${blog_id}`} className='flex gap-5 mb-8'>
            <h1 className='blog-index'>{index < 10 ? "0" + (index + 1) : index + 1}</h1>

            <div>
                <div className='flex gap-2 items-center mb-7'>
                    <img src={profile_img} className='w-6 h-6 rounded-full' />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(publishedAt)}</p>
                </div>

                <h1 className='blog-title'>{title}</h1>
            </div>
        </Link>
    )
}

export default MinimalBlogPost