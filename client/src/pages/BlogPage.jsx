import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { fetchBlogDetails, fetchSimilarBlogs } from '../services/operations/BLOG_API';
import defaultBanner from '../assets/blog-banner-light.png'
import AnimationWrapper from '../components/common/AnimationWrapper'
import Loader from '../components/common/Loader'
import { getDay } from '../utils/dateConverter'
import BlogInteraction from '../components/core/BlogPage/BlogInteraction';
import BlogCard from '../components/core/HomePage/BlogCard'
import BlogContent from '../components/core/BlogPage/BlogContent';
import { checkIsBlogLiked } from '../services/operations/USER_API';
import { useSelector } from 'react-redux';
import CommentsContainer from '../components/core/BlogPage/CommentsContainer';
import { fetchParentComments } from '../services/operations/COMMENT_API';

export const blogDetails = {
    activity: { total_likes: 0, total_comments: 0, total_reads: 0, total_parent_comments: 0 },
    author: { personal_info: { fullname: "", profile_img: "", username: "" }, _id: '' },
    bannerImage: defaultBanner,
    content: [],
    description: "",
    publishedAt: "",
    tags: [],
    title: "",
    _id: "",
    comments: []
}

const BlogPage = () => {
    const { _id } = useParams();
    const { token } = useSelector(state => state.auth);

    const [blog, setBlog] = useState(blogDetails);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(false);

    const { title, content, bannerImage, description, publishedAt, tags, author: { personal_info: { fullname, profile_img, username } }, activity: { total_comments, total_likes, total_reads, total_parent_comments }, comments } = blog;
    const [isLiked, setIsLiked] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(true);

    const getBlogDetails = async (_id) => {
        setLoading(true);
        const response = await fetchBlogDetails(_id);
        console.log(response);
        if (!response) {
            setBlog([]);
            setLoading(false);
            return;
        }
        await getSimilarBlogs(response.data.tags);
        setLoading(false);
        setBlog(response.data);
    }

    const getSimilarBlogs = async (tags) => {
        let tagString = "";
        tags.forEach(tag => tagString += `${tag},`)

        const response = await fetchSimilarBlogs(tagString);
        if (!response) return setSimilarBlogs([]);

        const blogs = response.data.filter(blog => _id != blog._id)
        setSimilarBlogs(blogs);
    }

    const isBlogLiked = async (_id) => {
        const response = await checkIsBlogLiked(_id, token);
        console.log(response.data.isLiked);
        setIsLiked(response.data.isLiked);
    }

    useEffect(() => {
        isBlogLiked(_id);
        getBlogDetails(_id);
    }, [_id])


    return (
        <AnimationWrapper>
            {
                loading ?
                    (<Loader />)
                    :
                    (
                        <>
                            <CommentsContainer blog={blog} setBlog={setBlog} />
                            <div className='max-w-[900px] center py-10 max-lg:px-[5vw] '>

                                <img src={bannerImage} className='aspect-video' />

                                <div className='mt-12'>

                                    <h2>{title}</h2>

                                    <div className='flex max-sm:flex-col justify-between my-8'>
                                        <div className='flex items-start gap-5'>
                                            <img src={profile_img} className="w-12 h-12 rounded-full" />
                                            <p>
                                                <span className='capitalize'>{fullname}</span>
                                                <br />
                                                @
                                                <Link className={`underline text-black tracking-wider`} to={`/user/${username}`}>{username}</Link>
                                            </p>
                                        </div>

                                        <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
                                    </div>
                                </div>

                                <BlogInteraction blog={blog} setBlog={setBlog} isLiked={isLiked} setIsLiked={setIsLiked} />

                                <div className='font-gelasio my-12 blog-page-content'>
                                    {
                                        content[0]?.blocks?.map((block, index) => {
                                            return (
                                                <div className='my-4 md:my-8' key={index}>
                                                    <BlogContent block={block} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                <BlogInteraction blog={blog} setBlog={setBlog} isLiked={isLiked} setIsLiked={setIsLiked} />

                                {
                                    similarBlogs !== null && similarBlogs.length ?
                                        <>
                                            <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar Blogs</h1>

                                            {
                                                similarBlogs.map((blog, index) => {
                                                    const { author: { personal_info } } = blog
                                                    return (
                                                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                                                            <BlogCard blog={blog} />
                                                        </AnimationWrapper>
                                                    )

                                                })
                                            }
                                        </>
                                        :
                                        ""
                                }
                            </div>
                        </>

                    )
            }
        </AnimationWrapper>
    )
}

export default BlogPage