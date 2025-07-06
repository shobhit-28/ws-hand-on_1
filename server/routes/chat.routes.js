import express from 'express';
import { deleteMessage, getMessages, sendMessage } from '../controllers/chat.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sendMessage', authenticateToken, sendMessage);
router.get('/getMessages/:withUserId', authenticateToken, getMessages);
router.delete('/deleteMessage/:messageId', authenticateToken, deleteMessage)

export default router;