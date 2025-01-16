import React, { useEffect } from 'react'
import AnimationWrapper from '../components/common/AnimationWrapper'
import { fetchBlogs, fetchBlogsByCategory, fetchTrendingBlogs } from '../services/operations/BLOG_API';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Loader from '../components/common/Loader';
import BlogCard from '../components/core/HomePage/BlogCard';
import MinimalBlogPost from '../components/core/HomePage/MinimalBlogPost';
import InPageNavigation from '../components/common/InPageNavigation'
import NoData from '../components/core/HomePage/NoData'

export const HomePage = () => {
    const defaultHidden = ["trending"];
    const categories = ["Machine Learning", "Blog", "Finances", "Cooking", "Hollywood", "Film Making", "Social Media", "Travel"];

    const dispatch = useDispatch();

    const [ pageState, setPageState] = useState('home');
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [ page, setPage ] = useState(1);
    const [ noBlogState, setNoBlogState ] = useState(false);

    const loadMoreHandler = async() => {
        let response;

        if(pageState == 'home') {
            response = await dispatch(fetchBlogs(page + 1));
        } else {
            response = await dispatch(fetchBlogsByCategory(pageState, page + 1));
        }

        if(!response) return setNoBlogState(true);
        setBlogs([...blogs, ...response.data]);
        setPage(page + 1);
    }

    const categoryHandler = (event) => {
        const category = event.target.innerText;
        if (category == pageState) {
            return setPageState('home');
        }
        setPageState(category);
    }

    const getTrendingBlogs = async () => {
        const response = await dispatch(fetchTrendingBlogs());
        if(!response) {
            return setTrendingBlogs([]);
        }
        setTrendingBlogs(response.data);
    }

    const getHomePageBlogs = async (page = 1) => {
        const response = await dispatch(fetchBlogs(page));
        if (!response) {
            return setBlogs([]);
        }
        setBlogs(response.data);
    }

    const getCategoryBlogs = async (page = 1) => {
        const response = await dispatch(fetchBlogsByCategory(pageState, page));
        if (!response) {
           return setBlogs([]);
        }
        console.log(response.data);
        setBlogs(response.data);
    }


    useEffect(() => {
        if (pageState == 'trending') {
           
        } else {
            if (pageState == 'home') {
                setPage(1);
                getHomePageBlogs(1);
                setNoBlogState(false);
            } else {
                setPage(1);
                getCategoryBlogs(1);
                setNoBlogState(false);
            }
        }
        getTrendingBlogs();
    },  [pageState]);


    return (
        <div>
            <AnimationWrapper>
                <section className='h-cover flex justify-center gap-10'>
                    {/* latest Blogs */}
                    <div className='w-full'>
                        <InPageNavigation
                            routes={pageState != 'trending' ? [pageState, 'trending'] : ['home', 'trending']}
                            defaultHidden={defaultHidden}
                            activeRoute={pageState}
                            setActiveRoute={setPageState}
                        >
                            <>
                                {
                                    blogs == null ?
                                        <Loader />
                                        :
                                        blogs.length === 0 ?
                                            (<NoData message={"No Blogs Found"} />)
                                            :
                                            (
                                                blogs?.map((blog, index) => (
                                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * .1 }}>
                                                        <BlogCard blog={blog} index={index} />
                                                    </AnimationWrapper>
                                                ))
                                            )

                                }
                            </>

                            <>
                                {
                                    trendingBlogs == null ?
                                        <Loader />
                                        :
                                        trendingBlogs.length === 0 ?
                                            (<NoData message={"No Blogs Found"} />)
                                            :
                                            (
                                                trendingBlogs?.map((blog, index) => (
                                                    <AnimationWrapper key={index} transition={{ delay: index * .1, duration: 1 }}>
                                                        <MinimalBlogPost blog={blog} index={index} />
                                                    </AnimationWrapper>
                                                ))
                                            )
                                }
                            </>
                        </InPageNavigation>
                        {
                            !noBlogState && <button
                                className='bg-grey center text-dark-grey p-2 px-4 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                onClick={loadMoreHandler}
                            >
                                Load More
                            </button>
                        }

                    </div>

                    {/* filters and trending blogs */}
                    <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                        <div className='flex flex-col gap-10'>
                            <div>
                                <h1 className='font-medium text-xl mb-8'>Stories from all interests</h1>

                                <div className='flex gap-3 flex-wrap'>
                                    {categories?.map((category, index) => (
                                        <button
                                            className={`${pageState.toLocaleLowerCase() === category.toLocaleLowerCase() ? "bg-black text-white" : ""} tag`}
                                            key={index}
                                            onClick={categoryHandler}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h1 className='font-medium text-xl mb-8'>Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
                                {trendingBlogs?.map((blog, index) => (
                                    <AnimationWrapper key={index} transition={{ delay: index * .1, duration: 1 }}>
                                        <MinimalBlogPost blog={blog} index={index} />
                                    </AnimationWrapper>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </div>
    )
}


export default HomePage