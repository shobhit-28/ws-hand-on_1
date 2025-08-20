import express from 'express'
import { allowedMethods } from '../utils/allowedMethods.util.js';
import { getAllNotifications } from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use('/getAll', authenticateToken, allowedMethods({ GET: getAllNotifications }))

export default router