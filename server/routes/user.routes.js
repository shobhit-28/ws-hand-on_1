import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { allowedMethods } from '../utils/allowedMethods.util.js';
import { getUserById, searchUsers, updateProfilePic, uploadProfilePic } from '../controllers/user.controller.js';

const router = express.Router();

router.use('/uploadProfilePic', authenticateToken, upload.single('profile_pic'), allowedMethods({ PUT: uploadProfilePic }))
router.use('/updateProfilePic', authenticateToken, allowedMethods({ GET: updateProfilePic }))
router.use('/searchUser/:user', authenticateToken, allowedMethods({ GET: searchUsers }))
router.use('/getUser/:userId', authenticateToken, allowedMethods({ GET: getUserById }))

export default router;