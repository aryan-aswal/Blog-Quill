import React from 'react'
// import pageNotFound from '../assets/404.png'
import lightPageNotFound from '../assets/404-light.png'
import darkPageNotFound from '../assets/404-dark.png'
import { Link } from 'react-router-dom'
// import fullLogo from '../assets/full-logo.png'
import lightFullLogo from '../assets/full-logo-light.png'
import darkFullLogo from '../assets/full-logo-dark.png'
import { useSelector } from 'react-redux'

const Error = () => {
  let { initialTheme } = useSelector((state) => state.theme);
  return (
    <section className='h-cover relative p-10 flex flex-col items-center text-center gap-20'>
        <img src={initialTheme == 'light' ? darkPageNotFound : lightPageNotFound} className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />
        <h1 className='text-4xl font-gelasio leading-'>Page Not Found</h1>
        <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for does not exists. Head back to the <Link className="text-black underline" to={'/'}>Home Page</Link></p>

        <div className='mt-auto'>
            <img src={initialTheme == 'light' ? darkFullLogo : lightFullLogo} className='mx-auto select-none h-8 object-contain block ' />
            <p className='mt-5 text-dark-grey'>Read millions of stories arround the globe</p>
        </div>
    </section>
  )
}

export default Error