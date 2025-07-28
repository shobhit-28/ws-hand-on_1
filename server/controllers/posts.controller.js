import * as postService from '../services/post.service.js'
import { CreatePostDto } from '../dto/posts/create_post.dto.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.util.js'
import { AppError } from '../utils/appError.js'
import https from 'https'

export const createPost = asyncHandler(async (req, res) => {
  const dto = new CreatePostDto({
    userId: req.user.id,
    content: req.body.content,
    file: req.file
  })

  const post = await postService.createPostService(dto)

  successResponse(res, 'Post created successfully', post, 201)
})

export const getPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const posts = await postService.getPosts(userId)

  successResponse(res, 'Posts fetched', posts, 200)
})

export const getPostPhoto = asyncHandler(async (req, res) => {
  const signedUrl = await postService.getPostsForUrlBinding(req.params.postId)

  https.get(signedUrl, (fileRes) => {
    res.setHeader('Content-Type', fileRes.headers['content-type'])
    fileRes.pipe(res)
  }).on('error', () => {
    throw new AppError('Error streaming file', 500)
  })
})

// export const deletePost = async (req, res) => {
//   const post = await postService.deletePostById(req.params.id)
//   if (!post) return res.status(404).json({ error: 'Post not found' })
//   res.json({ message: 'Post deleted' })
// }

// export const likePost = async (req, res) => {
//   const { error } = likeDto.validate(req.body)
//   if (error) return res.status(400).json({ error: error.details[0].message })

//   const post = await postService.addLike(req.params.id, req.body.userId)
//   res.json(post)
// }

// export const unlikePost = async (req, res) => {
//   const { error } = likeDto.validate(req.body)
//   if (error) return res.status(400).json({ error: error.details[0].message })

//   const post = await postService.removeLike(req.params.id, req.body.userId)
//   res.json(post)
// }

// export const commentPost = async (req, res) => {
//   const { error } = commentDto.validate(req.body)
//   if (error) return res.status(400).json({ error: error.details[0].message })

//   const post = await postService.addComment(req.params.id, req.body.userId, req.body.text)
//   res.json(post)
// }
