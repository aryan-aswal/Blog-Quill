import React, { useState } from 'react'
import AnimationWrapper from '../../common/AnimationWrapper'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Tags from './Tags'
import { createBlog } from '../../../services/operations/BLOG_API'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PublishForm = ({ setEditorState }) => {
  const characterLimit = 200;
  let tagLimit = 5;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { blog } = useSelector((state) => state.blog);
  const [ blogData, setBlogData ] = useState(blog);

  const handleEnterKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter' || e.keyCode == 188) {
      e.preventDefault();
      const tag = e.target.value;

      if(blogData.tags.length >= tagLimit) {
        return toast.error("Tags limit is reached.")
      }
      if(blogData.tags.includes(tag)) {
        return toast.error("Tag already exists.")
      }

      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.toLowerCase()]
      }));
      console.log(blogData)
      e.target.value = '';
    }
  }
  const descriptionChangeHandler = (e) => {
    const input = e.target;
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    setBlogData((prev) => ({
      ...prev,
      description: input.value
    }))
  }

  const publishHandler = async(e) => {
    e.preventDefault();
    if(!blogData.description) {
      return toast.error('Please enter a description for the blog');
    }
    if(!blogData.tags.length) {
      return toast.error('Please add some tags for the blog');
    }
    console.log(blogData);
    await createBlog(blogData, token, navigate, dispatch);
  }

  const titleChangeHandler = (e) => {
    const input = e.target;
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    setBlogData((prev) => ({
      ...prev,
      title: input.value
    }))
  }
  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <button
          className='w-12 h-12 absolute z-10 top-[5%] lg:top-[10%] right-[5vw]'
          onClick={() => setEditorState('editor')}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className='max-w-[550px] center '>

          <p className='text-dark-grey mb-1 '>Preview</p>

          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={blogData?.bannerImage} alt="" />
          </div>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{blogData.title}</h1>

          <p className='font-gelasio line-clamp-3 text-xl leading-7 mt-4'>{blogData.description}</p>

        </div>

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='text-dark-grey mt-9 mb-2'>Blog Title</p>
          <input
            type="text"
            placeholder='Blog Title'
            defaultValue={blogData.title}
            className='input-box pl-4'
            onChange={titleChangeHandler}
          />

          <p className='text-dark-grey mt-9 mb-2'>Short description about your blog</p>

          <textarea 
            name="description"
            id="description"
            maxLength={characterLimit}
            defaultValue={blogData.description}
            className='resize-none input-box leading-7 pl-4'
            onKeyDown={handleEnterKeyDown}
            onChange={descriptionChangeHandler}
          ></textarea>

          <p className='mt-1 text-dark-grey text-sm text-right'>{characterLimit - blogData.description.length} characters left</p>

          <p className='text-dark-grey mt-9 mb-2'>Tags - (Helps is searching and ranking your blog post)</p>

          <div className='relative input-box pl-2 py-2 pb-4'>
            <input 
              type="text" 
              placeholder='Add tags'
              className='sticky input-box bg-white pl-4 top-0 left-0 mb-3 focus:bg-white'
              onKeyDown={handleKeyDown}
            />
            {
              blogData.tags.map((tag, index) => (
                <Tags key={index} tag={tag} setBlogData={setBlogData}/>
              ))
            }
          </div>
          <p className='text-right text-dark-grey mt-1 mb-4'>{tagLimit - blogData.tags.length} tags left</p>
          <button 
            className='btn-dark px-8'
            onClick={publishHandler}
          >
            Publish
          </button>
        </div>
    
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm