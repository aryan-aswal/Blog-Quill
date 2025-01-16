import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/common/InPageNavigation';
import Loader from '../components/common/Loader';
import BlogCard from '../components/core/HomePage/BlogCard';
import { useState } from 'react';
import AnimationWrapper from '../components/common/AnimationWrapper';
import NoData from '../components/core/HomePage/NoData';
import { searchBlogByQuery } from '../services/operations/BLOG_API';
import { searchUser } from '../services/operations/USER_API';
import UserCardWrapper from '../components/core/SearchPage/UserCardWrapper';

const SearchPage = () => {

    const { query } = useParams();

    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);
    const [activeRoute, setActiveRoute] = useState(`Search Results from "${query}"`);

    const [noBlogState, setNoBlogState] = useState(false);
    const [page, setPage] = useState(1);


    const loadMoreHandler = async () => {
        const response = await searchBlogByQuery(page + 1, query);
        setPage(page + 1);
        if (!response) return setNoBlogState(true);
        setBlogs([...blogs, ...response.data]);
    }

    const getBlogsByQuery = async () => {
        const response = await searchBlogByQuery(1, query);
        if (!response) {
            setNoBlogState(true);
            return setBlogs([]);
        }
        setBlogs(response.data);
    }

    const fetchUsers = async () => {
        const response = await searchUser(query);
        if (!response) {
            return setUsers([]);
        }

        setUsers(response.data);
    }

    useEffect(() => {
        setNoBlogState(false);
        setBlogs(null);
        setActiveRoute(`Search Results from "${query}"`)
        getBlogsByQuery();
        fetchUsers();
    }, [query])

    return (
        <section className='h-cover flex justify-center gap-10'>
            <div className='w-full'>
                <InPageNavigation
                    routes={[`Search Results from "${query}"`, "Accounts Matched"]}
                    defaultHidden={["Accounts Matched"]}
                    activeRoute={activeRoute}
                    setActiveRoute={setActiveRoute}
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
                                                {
                                                    console.log(blogs)
                                                }
                                                <BlogCard blog={blog} index={index} />
                                            </AnimationWrapper>
                                        ))
                                    )

                        }
                    </>

                    <>
                        <UserCardWrapper users={users}/>
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

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                <h1 className='font-medium text-xl mb-8'>Users related to search <i className="fi fi-rr-user mt-1 font-medium"></i></h1>
                <UserCardWrapper users={users}/>
            </div>
        </section>
    )
}

export default SearchPage