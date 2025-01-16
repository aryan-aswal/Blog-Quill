const router = require('express').Router();

const { addComment, fetchParentComments, fetchReplyComments } = require('../controllers/Comment');
const { auth } = require('../middlewares/auth');

router.get('/fetch-parent-comments', fetchParentComments);
router.get('/fetch-reply-comments', fetchReplyComments);

router.post('/add-comment',auth, addComment);

module.exports = router;