import React, { useRef } from 'react'
import InputBox from '../../common/InputBox'
import googleIcon from '../../../assets/google.png'
import { Link, useNavigate } from 'react-router-dom'
import { authWithGoogle } from './firebase'
import { googleAuth, sendOTP } from '../../../services/operations/AUTH_API'
import { useDispatch, useSelector } from 'react-redux'
import { setSignUpData } from '../../../redux/slices/authSlice'

const SignUpForm = () => {
  const signUpForm = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const submitHandler = (e) => {
    e.preventDefault();
    const form  = new FormData(signUpForm.current);
    const formData = {};

    for(let [key, value] of form.entries()) {
      formData[key] = value;
    }
    dispatch(setSignUpData(formData));
    dispatch(sendOTP(formData.email, navigate));
  }

  
  const googleAuthHandler = async(e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      dispatch(googleAuth(user.accessToken, navigate));
    } catch (error) {
      toast.error("Trouble login through google")
      console.log(error);
    }
  }
  
  return (
    <form ref={signUpForm} className='w-[80%] max-w-[400px]' onSubmit={submitHandler}>
      <InputBox 
          name={'fullName'}
          type={'text'}
          placeholder={"Full Name"}
          icon={"fi-rr-user"}
      />
      <InputBox 
          name={'email'}
          type={'email'}
          placeholder={"Email"}
          icon={"fi-rr-envelope"}
      />
      <InputBox 
          name={'password'}
          type={'password'}
          placeholder={"Password"}
          icon={"fi-rr-key"}
      />
      <button className='btn-dark center mt-14' type='submit'>
        Sign Up
      </button>

      <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
        <hr className='w-1/2 border-black'/>
        <p>or</p>
        <hr className='w-1/2 border-black'/>
      </div>

      <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' onClick={googleAuthHandler}>
        <img src={googleIcon} className='w-5'/>
        Continue With Google
      </button>

      <p className='mt-6 text-dark-grey text-xl text-center'>
        Already a member ? 
        <Link to={'/sign-in'} className='underline m-1 text-black text-xl'>
           Sign in here
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm