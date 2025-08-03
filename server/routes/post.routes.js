import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { allowedMethods } from '../utils/allowedMethods.util.js'
import { addComment, createPost, getPostPhoto, getPosts, getPostsById } from '../controllers/posts.controller.js'
import postUpload from '../middleware/postUpload.js'
import { b2 } from '../config/b2Bucket.js'

const router = express.Router()

router.use(
    '/create',
    authenticateToken,
    postUpload.single('photo'),
    allowedMethods({ POST: createPost })
)

router.use(
    '/getAll',
    authenticateToken,
    allowedMethods({ GET: getPosts })
)

router.use(
    '/getPostWithUserId/:userId',
    authenticateToken,
    allowedMethods({ GET: getPostsById })
)

router.use('/photo/:postId', authenticateToken, allowedMethods({ GET: getPostPhoto }))

router.use('/addComment', authenticateToken, allowedMethods({ GET: addComment }))

export default router