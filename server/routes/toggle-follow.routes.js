import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkStatus, follow, getFollowers, getFollowing, unfollow } from '../controllers/follow.controller.js';
import { allowedMethods } from '../utils/allowedMethods.util.js';

const router = express.Router();

router.use('/follow', authenticateToken, allowedMethods({ POST: follow }))
router.use('/unfollow', authenticateToken, allowedMethods({ DELETE: unfollow }))

router.use('/followers/:userId', authenticateToken, allowedMethods({ GET: getFollowers }))
router.use('/followers', authenticateToken, allowedMethods({ GET: getFollowers }))

router.use('/following/:userId', authenticateToken, allowedMethods({ GET: getFollowing }))
router.use('/following', authenticateToken, allowedMethods({ GET: getFollowing }))

router.use('/checkStatus', authenticateToken, allowedMethods({GET: checkStatus}))


export default router;