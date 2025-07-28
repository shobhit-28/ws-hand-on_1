import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { allowedMethods } from '../utils/allowedMethods.util.js'
import { createPost, getPosts } from '../controllers/posts.controller.js'
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

// router.get('/posts/photo/:filename', authenticateToken, async (req, res) => {
//     const fileName = `posts/${req.params.filename}`

//     const { data: { authorizationToken } } = await b2.getDownloadAuthorization({
//         bucketId: process.env.B2_BUCKET_ID,
//         fileName,
//         validDurationInSeconds: 60
//     })

//     const signedUrl = `${b2.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${authorizationToken}`

//     const response = await fetch(signedUrl)
//     const buffer = await response.arrayBuffer()

//     res.setHeader('Content-Type', response.headers.get('content-type'))
//     res.send(Buffer.from(buffer))
// })

export default router