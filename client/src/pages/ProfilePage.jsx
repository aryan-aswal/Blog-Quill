import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { fetchUserDetails } from '../services/operations/USER_API';
import AnimationWrapper from '../components/common/AnimationWrapper';
import Loader from '../components/common/Loader';
import { useSelector } from 'react-redux';
import AboutUser from '../components/core/ProfilePage/AboutUser';
import InPageNavigation from '../components/common/InPageNavigation';
import NoData from '../components/core/HomePage/NoData';
import BlogCard from '../components/core/HomePage/BlogCard';
import Error from './Error';

const ProfilePage = () => {
    const { username } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [activeRoute, setActiveRoute] = useState("Blogs Published");
    const [blogs, setBlogs] = useState(null);

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.auth);

    const getUserDetails = async () => {
        const response = await fetchUserDetails(username);
        if (!response) {
            setUserDetails(undefined);
            return;
        }
        setUserDetails(response.data);
        setBlogs(response.data.blogs);
    }

    useEffect(() => {
        getUserDetails();
    }, [username]);

    return (
        <AnimationWrapper>
            {userDetails === null ? (
                <Loader />
            ) : (
                <>
                    {!userDetails ?
                        <Error message={"User Not Found"} />
                        :
                        (
                            <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                                <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10'>
                                    <img src={userDetails?.personal_info?.profile_img} className='rounded-full md:w-32 md:h-32 w-48 h-48 bg-grey' alt="Profile" />
                                    <h1 className='text-2xl font-medium '>@{username}</h1>
                                    <p className='text-xl capitalize h-6'>{userDetails?.personal_info?.fullname}</p>
                                    <p>{userDetails?.account_info.total_posts.toLocaleString()} Blogs - {userDetails?.account_info.total_reads.toLocaleString()} Reads</p>

                                    {token && user?.personal_info?.username === username && (
                                        <div className='flex gap-4 mt-2'>
                                            <Link to={`/settings/edit-profile`} className='btn-light rounded-md'>Edit Profile</Link>
                                        </div>
                                    )}

                                    <AboutUser social_links={userDetails?.social_links} bio={userDetails?.personal_info?.bio} className="max-md:hidden" />
                                </div>

                                <div className='max-md:mt-12 w-full'>
                                    <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]} activeRoute={activeRoute} setActiveRoute={setActiveRoute}>
                                        {/* First tab content: Blogs Published */}
                                        <>
                                            {blogs == null ? (
                                                <Loader />
                                            ) : blogs.length === 0 ? (
                                                <NoData message={"No Blogs Found"} />
                                            ) : (
                                                blogs.map((blog, index) => (
                                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                        <BlogCard blog={blog} index={index} />
                                                    </AnimationWrapper>
                                                ))
                                            )}
                                        </>

                                        {/* Second tab content: About */}
                                        <>
                                            <AboutUser social_links={userDetails?.social_links} bio={userDetails?.personal_info?.bio} />
                                        </>
                                    </InPageNavigation>
                                </div>
                            </section>
                        )}
                </>
            )}
        </AnimationWrapper>
    );
}

export default ProfilePage;
