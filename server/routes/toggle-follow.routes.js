import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { follow, getFollowers, getFollowing, unfollow } from '../controllers/follow.controller.js';

const router = express.Router();

router.post('/follow', authenticateToken, follow);
router.delete('/unfollow', authenticateToken, unfollow);
router.get('/followers', authenticateToken, getFollowers)
router.get('/followers/:userId', authenticateToken, getFollowers)
router.get('/following', authenticateToken, getFollowing)
router.get('/following/:userId', authenticateToken, getFollowing)

export default router;