import React from 'react'
import SignInForm from '../components/core/UserAuthFormPage/SignInForm'
import SignUpForm from '../components/core/UserAuthFormPage/SignUpForm'
import AnimationWrapper from '../components/common/AnimationWrapper'

const UserAuthForm = ({ type }) => {
    return (
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex items-center justify-center flex-col'>
                <h1 className='text-4xl font-gelasio capitalize mb-24'>
                    {
                        type === "sign-in" ? ("Welcome Back") : ("Join us today")
                    }
                </h1>
                {
                    type === 'sign-in' ?
                        (<SignInForm />)
                        :
                        (<SignUpForm />)
                }
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm