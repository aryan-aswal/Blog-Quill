import React from 'react'
import { getDay } from '../../../utils/dateConverter';
import  { Link }  from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const { title, description, author, publishedAt, _id: blog_id, tags, activity, bannerImage } = blog;
  const { total_comments, total_likes, total_parent_comments, total_reads } = activity
  const { username, fullname, profile_img } = author.personal_info
  const { _id: author_id } = author;

  return (
    <Link to={`/blog/${blog_id}`} className='flex items-center gap-8 border-b border-grey pb-5 mb-4'>
      <div className='w-full'>
        <div className='flex gap-2 items-center mb-7'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clamp-1'>{fullname} @{username}</p>
          <p className='min-w-fit'>{getDay(publishedAt)}</p>
        </div>

        <h1 className='blog-title'>{title}</h1>

        <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{description}</p>

        <div className='flex gap-4 mt-7'>
          <span className='btn-light py-1 px-4'>{tags[0]}</span>
          <span className='ml-3 flex items-center gap-2 text-dark-grey'>
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>

      <div className='h-28 aspect-square bg-grey'>
        <img src={bannerImage} alt="" />
      </div>
    </Link>

  )
}

export default BlogCard