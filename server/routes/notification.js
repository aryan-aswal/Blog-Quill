const router = require('express').Router();

const { fetchNotificationsCount, fetchNotifications, deleteNotification } = require('../controllers/Notifications');
const { auth } = require('../middlewares/auth');

router.get('/fetch-notifications-count', auth, fetchNotificationsCount);
router.get('/fetch-notifications', auth, fetchNotifications);
router.delete('/delete-notification', auth, deleteNotification);

module.exports = router;