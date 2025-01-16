import React, { useEffect, useState } from 'react'
import { fetchUserDetails, updateUserDetails, uploadProfileImage } from '../services/operations/USER_API'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/common/Loader';
import InputBox from '../components/common/InputBox';

const EditProfilePage = () => {
    const bioLimit = 150;
    const { user } = useSelector(state => state.auth);
    const { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [ file, setFile ] = useState(null);
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(false);

    // Destructure with default values to avoid undefined errors
    let {
        personal_info: {
            fullname = '',
            username = '',
            profile_img = '',
            email = '',
            bio = ''
        } = {},
        social_links = {}
    } = profile || {};

    const [charactersLeft, setCharactersLeft] = useState(bioLimit - (bio?.length || 0));

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length);
        setProfile({
            ...profile,
            personal_info: {
                ...profile.personal_info,
                bio: e.target.value
            }
        })
    }

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUserDetails(profile, token));
    }

    const handleImagePreview = (e) => {
        e.preventDefault();
        setFile(e.target.files[0]);
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setProfile({
            ...profile,
            personal_info: {
                ...profile.personal_info,
                profile_img: imageUrl
            }
        })
    }

    const updateProfileImage = async(e) => {
        e.preventDefault();
        if(!file) {
            return toast.error("Please select an image to upload");
        }
        dispatch(uploadProfileImage(file, token));
    }

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            personal_info: {
                ...profile.personal_info,
                [name]: value
            }
        })
    }
    const changeLinkHandler = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            social_links: {
                ...profile.social_links,
                [name]: value
            }
        })
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchUserDetails(user.personal_info.username);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <form onSubmit={formSubmitHandler}>
                    <h1 className='max-md:hidden'>Edit Profile</h1>
                    <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                        <div className='max-lg:center mb-5'>
                            <label htmlFor="uploadImg" id='profileImgLable' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                                    Upload Image
                                </div>
                                <img src={profile_img} alt="Profile" />
                            </label>
                            <input type="file" id='uploadImg' accept="image/*" hidden onChange={handleImagePreview} />
                            <button className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={updateProfileImage}>Upload</button>
                        </div>

                        <div className='w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                <div>
                                    <InputBox
                                        name={"fullname"}
                                        type={"text"}
                                        defaultValue={fullname}
                                        placeholder={"Full Name"}
                                        disable={true}
                                        icon={"fi-rr-user"}
                                    />
                                </div>
                                <div>
                                    <InputBox
                                        name={"email"}
                                        type={"email"}
                                        defaultValue={email}
                                        placeholder={"Email"}
                                        disable={true}
                                        icon={"fi-rr-envelope"}
                                    />
                                </div>
                            </div>

                            <InputBox
                                name={"username"}
                                type={"text"}
                                defaultValue={username}
                                placeholder={"Username"}
                                icon={"fi-rr-at"}
                                onChange={changeHandler}

                            />
                            <p className='text-dark-grey -mt-3'>Username will be visible to all users.</p>

                            <textarea
                                name="bio"
                                maxLength={bioLimit}
                                defaultValue={bio}
                                className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'
                                placeholder='Bio'
                                onChange={handleCharacterChange}
                            />
                            <p className='mt-1 text-dark-grey'>{charactersLeft} characters left</p>

                            <p className='my-6 text-dark-grey'>Add your social handles below.</p>

                            <div className='md:grid md:grid-cols-2 gap-x-6'>
                                {Object.keys(social_links).map((key, index) => (
                                    <InputBox
                                        key={index}
                                        name={key}
                                        type={"text"}
                                        defaultValue={social_links[key] || ''}
                                        placeholder={`https://`}
                                        icon={`fi ${key !== 'website' ? `fi-brands-${key}` : "fi-rr-globe"}`}
                                        onChange={changeLinkHandler}
                                    />
                                ))}
                            </div>

                            <button className='btn-dark w-auto px-10' type='submit'>Update</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default EditProfilePage;
