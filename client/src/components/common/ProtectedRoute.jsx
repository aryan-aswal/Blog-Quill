import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({element}) => {
    const { token } = useSelector((state) => state.auth);
  return (
    <div>
        {
            token ? (<>{element}</>) : (<Navigate to={'/sign-in'} />)
        }
    </div>
  )
}

export default ProtectedRoute