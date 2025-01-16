import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../../../utils/dateConverter'
import BlogStats from './BlogStats'

const PublishedBlogsCard = ({ blog }) => {
    let { bannerImage, _id, title, publishedAt, activity } = blog
    const [showStat, setShowStat] = useState(false);

    return (
        <div>
            <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
                <img src={bannerImage} className='max-md:hidden lg:hidden xl:block w-28 h-28 bg-grey object-cover' />

                <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                    <div>
                        <Link to={`/blog/${_id}`} className='blog-title mb-4 hover:underline'>{title}</Link>
                        <p className='line-clamp-1'>Published on {getDay(publishedAt)}</p>
                    </div>
                    <div className='flex gap-6 mt-3'>
                        <Link to={`/editor/${_id}`} className='pr-4 py-2 underline'>Edit</Link>
                        <button className='lg:hidden pr-4 py-2 underline' onClick={() => setShowStat(!showStat)}>Stats</button>
                        <button className='pr-4 py-2 underline text-red'>Delete</button>
                    </div>
                </div>

                <div className='max-lg:hidden'>
                    <BlogStats stats={activity} />
                </div>
            </div>
            {
                showStat && 
                <div className='lg:hidden'>
                    <BlogStats stats={activity} />
                </div>
            }
        </div>
    )
}

export default PublishedBlogsCard