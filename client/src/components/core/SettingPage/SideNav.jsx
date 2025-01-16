import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom'
import { fetchNotificationsCount } from '../../../services/operations/NOTIFICATION_API';

const SideNav = () => {
    const { token } = useSelector((state) => state.auth);
    const currPage = location.pathname.split('/')[2];
    const [page, setPage] = useState(currPage.replace('-', ' '));
    const [showSideNav, setShowSideNav] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {
        console.log(e);
        let { offsetLeft, offsetWidth } = e.target;
        activeTabLine.current.style.left = `${offsetLeft}px`;
        activeTabLine.current.style.width = `${offsetWidth}px`;

        if (e.target === sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    }
    const getNotification = async(token) => {
        const response = await fetchNotificationsCount(token);
        setNotificationStatus(response.data);
    }

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
        getNotification(token);
    }, [page])

    return (

        <>
            <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                <div className='sticky top-[80px] z-30'>

                    <div className={`md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto`}>
                        <button ref={sideBarIconTab} className='p-5 capitalize' onClick={changePageState}>
                            <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                        </button>

                        <button ref={pageStateTab} className='p-5 capitalize' onClick={changePageState}>
                            {page}
                        </button>

                        <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />
                    </div>

                    <div
                        className={`min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500  
                        ${showSideNav ? ("opacity-100 pointer-events-auto") : ("max-md:opacity-0 max-md:pointer-events-none")}`}  
                    >
                        <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
                        <hr className='border-grey -ml-6 mb-8 mr-6' />

                        {/* Blog Link */}
                        <NavLink
                            to={`/dashboard/blogs`}
                            onClick={(e) => setPage(e.target.innerText)}
                            className={`sidebar-link`}
                        >
                            <i className='fi fi-rr-document'></i>
                            Blogs
                        </NavLink>

                        {/* Notification Link */}
                        <NavLink
                            to={`/dashboard/notifications`}
                            onClick={(e) => setPage(e.target.innerText)}
                            className={`sidebar-link`}
                        >
                            <div className='relative'>
                                {
                                    notificationStatus &&  
                                    <span className='bg-red absolute top-0 right-0 w-2 h-2 rounded-full z-10'></span> 
                                }
                               
                                <i className='fi fi-rr-bell'></i>
                                
                            </div>
                            
                            Notifications
                        </NavLink>

                        {/* Editor Link */}
                        <NavLink
                            to={`/editor`}
                            onClick={(e) => setPage(e.target.innerText)}
                            className={`sidebar-link`}
                        >
                            <i className='fi fi-rr-file-edit'></i>
                            Editor
                        </NavLink>


                        <h1 className='text-xl text-dark-grey mb-3 mt-20'>Settings</h1>
                        <hr className='border-grey -ml-6 mb-8 mr-6' />

                        {/* Edit Profile */}
                        <NavLink
                            to={`/settings/edit-profile`}
                            onClick={(e) => setPage(e.target.innerText)}
                            className={`sidebar-link`}
                        >
                            <i className='fi fi-rr-user'></i>
                            Edit Profile
                        </NavLink>

                        {/* Change Password */}
                        <NavLink
                            to={`/settings/change-password`}
                            onClick={(e) => setPage(e.target.innerText)}
                            className={`sidebar-link`}
                        >
                            <i className='fi fi-rr-lock'></i>
                            Change Password
                        </NavLink>
                    </div>
                </div>

                <div className='max-md:-mt-8 mt-5 w-full'>
                    <Outlet />
                </div>
            </section>


        </>

    )
}

export default SideNav