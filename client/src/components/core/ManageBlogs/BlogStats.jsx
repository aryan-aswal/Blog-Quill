import React from 'react'

const BlogStats = ({stats}) => {
  return (
    <div className='flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b'>
        {
            Object.keys(stats).map((key, index) => {
                return key.includes("parent") ? "" :<div className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${index != 0 ? "border-grey border-l" : ""}`} key={index}>
                    <h1 className='text-xl lg:text-2xl mb-2'>{stats[key].toLocaleString()}</h1>
                    <p className='max-lg:text-dark-grey capitalize'>{key.split('_')[1]}</p>
                </div>
            })
        }
    </div>
  )
}

export default BlogStats