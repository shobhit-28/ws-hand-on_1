import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { allowedMethods } from '../utils/allowedMethods.util.js';
import { updateProfilePic, uploadProfilePic } from '../controllers/user.controller.js';

const router = express.Router();

router.use('/uploadProfilePic', authenticateToken, upload.single('profile_pic'), allowedMethods({ PUT: uploadProfilePic }))
router.use('/updateProfilePic', authenticateToken, allowedMethods({ GET: updateProfilePic }))

export default router;