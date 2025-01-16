import React from 'react'
import Loader from '../../common/Loader'
import AnimationWrapper from '../../common/AnimationWrapper'
import NoData from '../HomePage/NoData'
import UserCard from './UserCard'

const UserCardWrapper = ({users}) => {

    return (
        <div>
            {
                users === null ?
                    (<Loader />)
                    :
                    (
                        !users.length ?
                            (<NoData message={"No User Found"} />)
                            :
                            (
                                users.map((user, index) => (
                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                                        <UserCard user={user}></UserCard>
                                    </AnimationWrapper>
                                ))
                            )
                    )
            }
        </div>
    )
}

export default UserCardWrapper