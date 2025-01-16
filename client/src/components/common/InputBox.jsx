import React, { useState } from 'react'

const InputBox = ({ type, placeholder, defaultValue, name, id, icon, disable, onChange }) => {
    const [ showPassword, setShowPassword ] = useState(false); 

    return (
        <div className='relative w-[100%] mb-4'>
            <input
                type={`${type === 'password' ? `${showPassword ? "text" : "password" }` : type}`}
                placeholder={placeholder}
                defaultValue={defaultValue}
                name={name}
                id={id}
                className='input-box'
                disabled={disable}
                onChange={onChange}
            />
            <i className={`fi ${icon} input-icon`}></i>
            {
                type === 'password' ? 
                (
                    showPassword ? 
                    (<span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-4 top-4'><i className="fi fi-rr-eye-crossed text-xl"></i></span>) 
                    : 
                    (<span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-4 top-4'><i className="fi fi-rr-eye text-xl"></i></span>)
                ) 
                : 
                (<></>)
            }
        </div>
    )
}

export default InputBox