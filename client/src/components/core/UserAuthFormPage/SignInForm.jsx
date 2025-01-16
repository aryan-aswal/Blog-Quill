import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputBox from '../../common/InputBox'
import googleIcon from '../../../assets/google.png'
import { googleAuth, login } from '../../../services/operations/AUTH_API';
import { useDispatch} from 'react-redux'
import { authWithGoogle } from './firebase';
import toast from 'react-hot-toast';


const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInForm = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    const form  = new FormData(signInForm.current);
    const formData = {};

    for(let [key, value] of form.entries()) {
      formData[key] = value;
    }

    dispatch(login(formData, navigate))
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
    <form ref={signInForm} className='w-[80%] max-w-[400px]' onSubmit={submitHandler}>
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
        Sign In
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
        Don't have an account ?
        <Link to={'/sign-up'} className='underline m-1 text-black text-xl'>
          Join us today
        </Link>
      </p>
      
    </form>
  )
}

export default SignInForm