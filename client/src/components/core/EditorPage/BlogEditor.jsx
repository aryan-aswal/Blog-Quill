import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import AnimationWrapper from '../../common/AnimationWrapper';
// import defaulBanner from '../../../assets/blog banner.png';
import EditorJS from '@editorjs/editorjs';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogData } from '../../../redux/slices/blogSlice';
import toast from 'react-hot-toast';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Raw from '@editorjs/raw';
import { blog_endpoints } from '../../../services/apis';
import { uploadBannerImage } from '../../../services/operations/BLOG_API';
import { draftBlog } from '../../../services/operations/BLOG_API';
import lightLogo from '../../../assets/logo-light.png';
import darkLogo from '../../../assets/logo-dark.png';
import lightBanner from '../../../assets/blog-banner-light.png';
import darkBanner from '../../../assets/blog-banner-dark.png';

const { FETCH_LINK_DATA_API, UPLOAD_BY_FILE_API, UPLOAD_BY_URL_API } = blog_endpoints;

const BlogEditor = ({ setEditorState }) => {
    const { initialTheme } = useSelector((state) => state.theme);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const blogData = useSelector((state) => state.blog.blog);
    const { title, description, bannerImage, content, tags, author, _id, activity, publishedAt } = blogData;

    // const [editorInstance, setEditorInstance] = useState(null);

    const tools = {
        header: {
            class: Header,
            config: {
                placeholder: 'Type Heading Here...',
                levels: [2, 3, 4, 5],
                defaultLevel: 2,
            },
        },
        list: {
            class: List,
            inlineToolbar: true,
        },
        embed: Embed,
        linkTool: {
            class: LinkTool,
            config: {
                endpoint: FETCH_LINK_DATA_API,
            },
            additionalRequestHeaders: {
                Authorization: `Bearer ${token}`,
            },
        },
        image: {
            class: Image,
            config: {
                endpoints: {
                    byFile: UPLOAD_BY_FILE_API,
                    byUrl: UPLOAD_BY_URL_API,
                },
                additionalRequestHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            }
        },
        table: Table,
        paragraph: Paragraph,
        code: Code,
        quote: {
            class: Quote,
            inlineToolbar: true,
        },
        marker: Marker,
        inlineCode: InlineCode,
        raw: Raw,
    }

    const [blog, setBlog] = useState({
        title: title || '',
        description: description || '',
        bannerImage: bannerImage || '',
        content: content[0] || {},
        tags: tags || [],
        author: author || {
            "personal_info": {},
        },
        activity: activity || { total_comments: 0, total_likes: 0, total_parent_comments: 0, total_reads: 0 },
        _id: _id || '',
        publishedAt: publishedAt || '',
    });

    const bannerUploader = async (e) => {
        const file = e.target.files[0];
        console.log(file);
        const url = await uploadBannerImage(file, token);
        setBlog((prev) => ({
            ...prev,
            bannerImage: url
        }));
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
        setBlog((prev) => ({
            ...prev,
            title: input.value
        }));
    };

    const publishHandler = (e) => {
        e.preventDefault();

        if (!blog.bannerImage) {
            return toast.error('Please upload a banner image for the blog');
        }
        if (!blog.title) {
            return toast.error('Please enter a title for the blog');
        }
        if (!blog.content.blocks || !blog.content.blocks.length) {
            return toast.error('Please write some content for the blog');
        }

        dispatch(setBlogData(blog));
        setEditorState('publish');
    };

    const draftHandler = async (e) => {
        e.preventDefault();
        if (!blog.title) {
            return toast.error('Please enter a title for the blog');
        }
        if (!blog.bannerImage) {
            return toast.error('Please upload a banner image for the blog');
        }
        await draftBlog(blog, token, navigate);
    };

    useEffect(() => {
        const editor = new EditorJS({
            holder: 'editorjs',
            tools: tools,
            data: content[0],
            placeholder: 'Start writing your blog...',
            onChange: async () => {
                const savedData = await editor.save();
                setBlog((prev) => ({
                    ...prev,
                    content: savedData,
                }));
            },
        });
    }, [content]);

    return (
        <div>
            <nav className='navbar'>
                <Link to={'/'} className='flex-none w-10'>
                    <img src={initialTheme == 'light' ? darkLogo : lightLogo } className='w-full' />
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {blog.title === '' ? "New Blog" : `${blog.title.length > 15 ? `${blog.title.substring(0, 15)}...` : blog.title}`}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2' onClick={publishHandler}>Publish</button>
                    <button className='btn-light py-2' onClick={draftHandler}>Save Draft</button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80'>
                            <label htmlFor='uploadBanner'>
                                <img src={blog.bannerImage || (initialTheme == 'light' ? lightBanner : darkBanner)} className='z-20' />
                                <input
                                    type="file"
                                    id='uploadBanner'
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    className='h-full w-full'
                                    onChange={bannerUploader}
                                />
                            </label>
                        </div>

                        <div>
                            <textarea
                                name="title"
                                id="title"
                                placeholder='Blog Title'
                                className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                                onKeyDown={handleTitleKeyDown}
                                onChange={handleTitleChange}
                                value={blog.title}
                            ></textarea>
                        </div>

                        <div id='editorjs' className='font-gelasio'></div>

                    </div>
                </section>
            </AnimationWrapper>
        </div>
    )
}

export default BlogEditor;
