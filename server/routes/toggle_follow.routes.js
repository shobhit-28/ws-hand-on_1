import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { follow, unfollow } from '../controllers/follow.controller.js';

const router = express.Router();

router.post('/follow', authenticateToken, follow);
router.post('/unfollow', authenticateToken, unfollow);

export default router;