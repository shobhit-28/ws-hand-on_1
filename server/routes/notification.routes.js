import express from 'express'
import { allowedMethods } from '../utils/allowedMethods.util.js';
import { clearNotifications, deleteNotification, getAllNotifications, markAllNotificationsRead, markNotificationAsRead } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use('/getAll', authenticateToken, allowedMethods({ GET: getAllNotifications }))
router.use('/markasread', authenticateToken, allowedMethods({ POST: markNotificationAsRead }))
router.use('/markallasread', authenticateToken, allowedMethods({ POST: markAllNotificationsRead }))
router.use('/deleteNotification/:notificationId', authenticateToken, allowedMethods({ DELETE: deleteNotification }))
router.use('/clearNotifications', authenticateToken, allowedMethods({ DELETE: clearNotifications }))

export default router