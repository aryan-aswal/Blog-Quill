import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loading: false,
    blog: localStorage.getItem('blog') ?
        JSON.parse(localStorage.getItem('blog'))
        :
        {
            _id: '',
            title: '',
            description: '',
            bannerImage: '',
            content: [],
            tags: [],
            author: {
                "personal_info": {},
            },
            activity: {total_comments: 0, total_likes: 0, total_parent_comments: 0, total_reads: 0},
            publishedAt: "",
            comments: []
        },
    isCommentBoxOpen: false,
}

export const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setBlogData: (state, action) => {
            state.blog = action.payload;
            console.log(state.blog);
            localStorage.setItem('blog', JSON.stringify(action.payload));
        },
        clearBlogData: (state) => {
            state.blog = {}
            localStorage.removeItem('blog');
        },
        toggleCommentBox: (state) => {
            state.isCommentBoxOpen = !state.isCommentBoxOpen;
        },
    },
})

export const { setBlogData, setLoading, clearBlog, toggleCommentBox } = blogSlice.actions;
export default blogSlice.reducer;