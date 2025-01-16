const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { 
    createBlog, 
    fetchDataFromLink, 
    uploadByFile, 
    uploadByUrl, 
    createDraftBlog, 
    fetchBlogs, 
    fetchTrendingBlogs, 
    searchBlogByTag, 
    searchBlogByQuery, 
    fetchBlogDetails,
    fetchSimilarBlogs,
    likeBlog,

} = require('../controllers/Blog');

router.post('/create-blog', auth, createBlog);
router.post('/create-draft-blog', auth, createDraftBlog);
router.post('/upload-by-file', auth, uploadByFile);
router.post('/upload-by-url', auth, uploadByUrl);


router.get('/fetch-blogs', fetchBlogs);
router.get('/fetch-link-data', fetchDataFromLink);
router.get('/fetch-trending-blogs', fetchTrendingBlogs);
router.get('/fetch-blog-by-category', searchBlogByTag);
router.get('/search-blog-by-query', searchBlogByQuery);
router.get('/fetch-blog-details', fetchBlogDetails);
router.get('/fetch-similar-blogs', fetchSimilarBlogs);


router.patch('/like-blog', auth, likeBlog);
module.exports = router