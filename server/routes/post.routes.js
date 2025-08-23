import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { allowedMethods } from '../utils/allowedMethods.util.js'
import { addComment, addReply, createPost, deleteComment, deletePost, deleteReply, editComment, editReply, getPost, getPostPhoto, getPosts, getPostsById, likePost, unlikePost } from '../controllers/posts.controller.js'
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

router.use('/post/:postId', authenticateToken, allowedMethods({ GET: getPost }))

router.use('/photo/:postId', authenticateToken, allowedMethods({ GET: getPostPhoto }))

router.use('/addComment', authenticateToken, allowedMethods({ POST: addComment }))

router.use('/addReply', authenticateToken, allowedMethods({ POST: addReply }))

router.use('/editComment', authenticateToken, allowedMethods({ PUT: editComment }))

router.use('/editReply', authenticateToken, allowedMethods({ PUT: editReply }))

router.use('/deleteComment/:commentId', authenticateToken, allowedMethods({ DELETE: deleteComment }))

router.use('/deleteReply', authenticateToken, allowedMethods({ DELETE: deleteReply }))

router.use('/deletePost/:postId', authenticateToken, allowedMethods({ DELETE: deletePost }))

router.use('/like', authenticateToken, allowedMethods({ PUT: likePost }))

router.use('/unlike', authenticateToken, allowedMethods({ PUT: unlikePost }))

export default router