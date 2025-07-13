import express from 'express';
import { chattableMates, deleteMessage, deleteMessageForEveryone, getMessages, sendMessage } from '../controllers/chat.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { allowedMethods } from '../utils/allowedMethods.util.js';

const router = express.Router();

router.use(
    '/sendMessage',
    authenticateToken,
    allowedMethods({ POST: sendMessage })
)

router.use(
    '/getMessages/:withUserId',
    authenticateToken,
    allowedMethods({ GET: getMessages })
)

router.use(
    '/deleteMessage/:messageId',
    authenticateToken,
    allowedMethods({ DELETE: deleteMessage })
)

router.use(
    '/deleteMessageForEveryone/:messageId',
    authenticateToken,
    allowedMethods({ DELETE: deleteMessageForEveryone })
)

router.use(
    '/getchatfriendslist',
    authenticateToken,
    allowedMethods({ GET: chattableMates })
)

export default router;