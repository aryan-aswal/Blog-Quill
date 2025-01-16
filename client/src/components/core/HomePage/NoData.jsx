import React from 'react'

const NoData = ({message}) => {
  return (
    <div className='text-center w-full p-4 rounded-full bg-grey/50 mt-4 mb-5'>
        <p>{message}</p>
    </div>
  )
}

export default NoData