import React, { useRef } from 'react'
import AnimationWrapper from '../../common/AnimationWrapper'
import InputBox from '../../common/InputBox'
import toast from 'react-hot-toast';
import { changePassword } from '../../../services/operations/AUTH_API';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
    const changePasswordForm = useRef();
    const { token } = useSelector(state => state.auth);

    const submitHandler = async(e) => {
        e.preventDefault();
        let form = new FormData(changePasswordForm.current);

        let formData = { };

        for(let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if(!currentPassword || !newPassword ) {
            return toast.error("Please fill the input fields");
        }

        await changePassword({...formData, token});
    }

    return (
        <AnimationWrapper>
            <form onSubmit={submitHandler} ref={changePasswordForm}>
                <h1 className='max-md:hidden '>Change Password</h1>

                <div className='py-10 w-full md:max-w-[400px] '>
                    <InputBox
                        name={'currentPassword'}
                        type={'password'}
                        className={`profile-edit-input`}
                        placeholder={"Current Password"}
                        icon={'fi-rr-unlock'}
                    >
                    </InputBox>

                    <InputBox
                        name={'newPassword'}
                        type={'password'}
                        className={`profile-edit-input`}
                        placeholder={"New Password"}
                        icon={'fi-rr-unlock'}
                    >
                    </InputBox>

                    <button className='btn-dark px-10' type='submit'>Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword