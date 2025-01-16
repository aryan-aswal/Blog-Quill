import React, { useEffect, useState } from 'react'
import BlogEditor from '../components/core/EditorPage/BlogEditor'
import PublishForm from '../components/core/EditorPage/PublishForm'
import { useParams } from 'react-router-dom'
import { fetchBlogDetails } from '../services/operations/BLOG_API'
import { setBlogData } from '../redux/slices/blogSlice'
import { useDispatch } from 'react-redux'
import Loader from '../components/common/Loader'

const EditorPage = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const [ editorState, setEditorState ] = useState('editor');
  const [ loading, setLoading ] = useState(false);

  const getBlogDetails = async(_id) => {
    setLoading(true);
    const response = await fetchBlogDetails(_id);
    if(!response) return;
    dispatch(setBlogData(response?.data));
    setLoading(false);
  }
  useEffect(() => {
    if(_id) {
      getBlogDetails(_id);
    }
  }, [_id])
  return (
    <div>
      {
        loading ? (<Loader />) 
        : (editorState === 'editor' ? (<BlogEditor setEditorState={setEditorState}/>) : (<PublishForm setEditorState={setEditorState}/>))
      }
    </div>
  )
}

export default EditorPage