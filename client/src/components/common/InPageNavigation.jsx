import React, { useEffect, useState } from 'react'

 const InPageNavigation = ({ routes, defaultHidden = [], activeRoute, setActiveRoute, children }) => {
    return (
        <div>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {routes.map((route, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveRoute(route)}
                        className={`${activeRoute === route ? "text-black border-b border-black" : "text-dark-grey border-b border-transparent"} ${defaultHidden.includes(route) ? "md:hidden" : " "} p-4 px-5 capitalize transition-all duration-500 ease-in-out`}
                    >
                        {route}
                    </button>
                ))}
            </div>
            {Array.isArray(children) ? children[routes.indexOf(activeRoute)] : children}
        </div>
    )
}

export default InPageNavigation

