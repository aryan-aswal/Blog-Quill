import React from 'react'
import { Link } from 'react-router-dom'

const AboutUser = ({ social_links, bio, className }) => {
    return (
        <div className={`md:w-[90%] md:mt-7 ${className}`}>
            <p>{bio || "Nothing to read here"}</p>
            <div className='flex gap-x-7 gap-y-2 flex-wrap items-center text-dark-grey mt-4 mb-4'>
                {
                    social_links && Object.keys(social_links).map((key, index) => {
                        let link = social_links[key]
                        return (
                            link ? 
                            <Link to={link} key={key} target='_blank'>
                                <i className={`fi ${key != 'website' ? `fi-brands-${key}` : "fi-rr-globe"} text-2xl hover:text-black`}></i>
                            </Link>
                            : 
                            " "
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AboutUser