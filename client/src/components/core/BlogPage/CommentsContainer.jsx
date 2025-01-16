import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCommentBox } from '../../../redux/slices/blogSlice';
import CommentField from './CommentField';
import { fetchParentComments } from '../../../services/operations/COMMENT_API';
import NoData from '../HomePage/NoData';
import AnimationWrapper from '../../common/AnimationWrapper';
import CommentCard from './CommentCard';
import toast from 'react-hot-toast';

const CommentsContainer = ({ blog, setBlog }) => {
    const { isCommentBoxOpen } = useSelector(state => state.blog);
    const { _id, title, description, activity: { total_comments, total_likes, total_parent_comments, total_reads } } = blog;
    const dispatch = useDispatch();

    const [totalParentComments, setTotalParentComments] = useState(0);
    const [commentArr, setCommentArr] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [commentAdded, setCommentAdded] = useState(false);

    const getParentComments = async () => {
        const data = { _id, commentPage };
        const response = await fetchParentComments(data);
        if (response === undefined) return;

        response.data.comments.forEach((comment) => {
            comment.childrenLevel = 0;
            comment.parentIndex = null;
            comment.hideReplies = true;
        })

        setTotalParentComments(response?.data?.totalParentComments || 0);

        setCommentArr(response?.data?.comments || []);

        setBlog({
            ...blog,
            comments: response?.data?.comments,
        });
    }

    const loadMoreComments = async () => {
        const response = await fetchParentComments({ _id, commentPage: commentPage + 1 });
        if (!response.success) {
            return toast.error("No more comments found");
        }
        setCommentPage(commentPage + 1);
        setCommentArr([...commentArr, ...response.data.comments]);
    }

    useEffect(() => {
        if (_id) {
            getParentComments();
        }
    }, [_id])

    return (
        <div
            className={`h-screen max-sm:w-full fixed ${isCommentBoxOpen ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}
        >
            <div className='relative'>
                <h1 className='text-xl font-medium'>Comments</h1>
                <p className='text-xl mt-2 w-[70%] text-dark-grey line-clamp-1'>{title}</p>

                <button
                    className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'
                    onClick={() => dispatch(toggleCommentBox())}
                >
                    <i className='fi fi-br-cross'></i>
                </button>

                <hr className='border-grey my-8 w-[120% -ml-10]' />
        
                <CommentField action={"comment"} blog_author={blog.author._id} setCommentAdded={setCommentAdded} commentAdded={commentAdded} blog={blog} setBlog={setBlog} commentArr={commentArr} setCommentArr={setCommentArr} />

                {
                    commentArr && commentArr.length ?
                        (
                            commentArr.map((comment, index) => {
                                return (
                                    <AnimationWrapper key={index}>
                                        <CommentCard comment={comment} index={index} leftVal={(comment.childrenLevel) * 4} commentArr={commentArr} setCommentArr={setCommentArr} blog={blog} setBlog={setBlog}/>
                                    </AnimationWrapper>
                                )
                            })
                        )
                        :
                        (<NoData message={"Be the first to comment"} />)
                }

                {
                    totalParentComments > commentArr.length && (
                        <button
                            className='btn-dark mt-5 px-10'
                            onClick={loadMoreComments}
                        >
                            Load More
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default CommentsContainer