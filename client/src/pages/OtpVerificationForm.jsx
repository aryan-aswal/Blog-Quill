'use client'
import { OTPInput } from 'input-otp'
import React, { useState } from 'react'
import { cn } from '../utils/MergeClass'
import darkLogo from '../assets/full-logo-dark.png'
import lightLogo from '../assets/full-logo-light.png'
import { useSelector } from 'react-redux'
import { signup } from '../services/operations/AUTH_API'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const OtpVerificationForm = () => {
    const { initialTheme } = useSelector((state) => state.theme);
    const { signupData } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ otp, setOtp ] = useState('');

    const onChangeHandler = (e) => {
        setOtp(e);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        const data = {...signupData, otp};
        dispatch(signup(data, navigate));
    }
    return (
        <div className='flex items-center justify-center h-cover flex-col'>
            <div>
                <img src={initialTheme == 'light' ? darkLogo : lightLogo} className='h-[80%] w-[80%] mx-auto'/>
            </div>
            <div className='flex flex-col items-center mt-10'>
                <h1>One Time Password(OTP) has been send on your mail id <span className='font-bold'>{signupData.email}</span></h1>
                <p>Enter the OTP below to verify</p>
            </div>
            <form className='mt-10' onSubmit={submitHandler}>
                <OTPInput
                    maxLength={6}
                    containerClassName="group flex items-center has-[:disabled]:opacity-30"
                    render={({ slots }) => (
                        <>
                            <div className="flex">
                                {slots.slice(0, 3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                ))}
                            </div>

                            <FakeDash />

                            <div className="flex">
                                {slots.slice(3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                ))}
                            </div>
                        </>
                    )}
                    value={otp}
                    onChange={onChangeHandler}
                />
                <span className='float-end cursor-pointer'>Resend OTP</span>
                <button className='btn-dark py-2 w-full rounded-sm mt-10'>Verify OTP</button>
            </form>

        </div>
    )
}

export default OtpVerificationForm
// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props) {
    return (
        <div
            className={cn(
                'relative w-20 h-20 text-[10rem]',
                'flex items-center justify-center',
                'transition-all duration-300',
                'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
                'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
                'outline outline-0 outline-accent-foreground/20',
                { 'outline-4 outline-accent-foreground': props.isActive },
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    )
}

// You can emulate a fake textbox caret!
function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-white" />
        </div>
    )
}

// Inspired by Stripe's MFA input.
function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    )
}
