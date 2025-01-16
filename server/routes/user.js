const router = require('express').Router();

const { searchUsers, getUserDetails, checkIsBlogLiked, uploadProfileImage,updateUserDetails, fetchUserBlogs } = require('../controllers/User');
const { auth } = require('../middlewares/auth');

router.get('/search-user', searchUsers);
router.get('/get-user-details', getUserDetails);
router.get('/check-is-blog-liked', auth, checkIsBlogLiked);
router.get('/fetch-user-blogs', auth, fetchUserBlogs);

router.post('/upload-profile-image', auth, uploadProfileImage);
router.post('/update-user-details', auth, updateUserDetails);

module.exports = router;