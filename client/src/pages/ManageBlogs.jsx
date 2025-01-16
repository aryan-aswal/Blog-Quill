import React, { useEffect, useState } from 'react'
import InPageNavigation from '../components/common/InPageNavigation'
import NoData from '../components/core/HomePage/NoData'
import AnimationWrapper from '../components/common/AnimationWrapper'
import { fetchUserBlogs } from '../services/operations/USER_API'
import { useSelector } from "react-redux";
import Loader from '../components/common/Loader'
import PublishedBlogsCard from '../components/core/ManageBlogs/PublishedBlogsCard'

const ManageBlogs = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchString, setSearchString] = useState('');
  const [activeButton, setActiveButton] = useState('Published Blogs');
  const [blogs, setBlogs] = useState(null);
  const handleChange = (e) => {

  }
  const getUserBlogs = async () => {
    let draft;
    if (activeButton == "Published Blogs") {
      draft = false;
    } else {
      draft = true;
    }
    const response = await fetchUserBlogs(draft, token);
    if(response == undefined) {
      setBlogs([]);
      return;
    }
    setBlogs(response.data);
  }
  useEffect(() => {
    getUserBlogs()
  }, [activeButton])
  return (
    <div>
      <h1 className='max-md:hidden'>Manage Blogs</h1>
      <div className='relative max-md:mt-5 md:mt-8 mb-10'>
        <input
          type="search"
          className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
          placeholder='Search Blogs'
          onChange={handleChange}
        />
        <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
      </div>
      <InPageNavigation routes={["Published Blogs", "Drafts"]} activeRoute={activeButton} setActiveRoute={setActiveButton}>
        {
          blogs == null ?
            <Loader />
            :
            blogs.length == 0 ?
              (<NoData message={"No Published Blogs"} />)
              :
              (
                blogs?.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                      <PublishedBlogsCard blog={blog} />
                    </AnimationWrapper>
                  )
                })
              )
        }
        {
          blogs == null ?
            <Loader />
            :
            blogs.length == 0 ?
              (<NoData message={"No Draft Blogs"} />)
              :
              (
                blogs?.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                      <PublishedBlogsCard blog={blog} />
                    </AnimationWrapper>
                  )
                })
              )
        }
      </InPageNavigation>
    </div>
  )
}

export default ManageBlogs