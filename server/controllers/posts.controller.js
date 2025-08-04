import * as postService from '../services/post.service.js'
import { CreatePostDto } from '../dto/posts/create_post.dto.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.util.js'
import { AppError } from '../utils/appError.js'
import https from 'https'
import { AddCommentDTO } from '../dto/posts/create_comment.dto.js'
import { AddReplyDTO } from '../dto/posts/add_reply.dto.js'
import { EditCommentDTO } from '../dto/posts/edit_comment.dto.js'
import { EditReplyDTO } from '../dto/posts/edit_reply.dto.js'

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

export const getPostsById = asyncHandler(async (req, res) => {
  const userId = req.params.userId

  const posts = await postService.getPostsByUserId(userId)

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

export const addComment = asyncHandler(async (req, res) => {
  const dto = new AddCommentDTO({
    userId: req.user.id,
    postId: req.body.postId,
    text: req.body.text
  })

  const comment = await postService.addComment(dto)

  successResponse(res, 'Successfully posted a comment', comment)
})

export const addReply = asyncHandler(async (req, res) => {
  const dto = new AddReplyDTO({
    commentId: req.body.commentId,
    userId: req.user.id,
    text: req.body.reply
  });

  const reply = await postService.addReply(dto);

  successResponse(res, 'Successfully added reply', reply)
})

export const editComment = asyncHandler(async (req, res) => {
  const dto = new EditCommentDTO({
    userId: req.user.id,
    commentId: req.body.commentId,
    text: req.body.newComment
  })

  const comment = await postService.editComment(dto)

  successResponse(res, `Successfully edited comment`, comment)
})

export const editReply = asyncHandler(async (req, res) => {
  const dto = new EditReplyDTO({
    userId: req.user.id,
    commentId: req.body.commentId,
    replyId: req.body.replyId,
    text: req.body.newReply
  })

  const reply = await postService.editReply(dto)

  successResponse(res, `Successfully edited reply`, reply)
})

export const deleteComment = asyncHandler(async (req, res) => {
  const dto = {
    commentId: req.params.commentId,
    userId: req.user.id
  };

  await postService.deleteComment(dto);

  successResponse(res, `Successfully deleted comment`, '', 204);
})

export const deleteReply = asyncHandler(async (req, res) => {
  const dto = {
    userId: req.user.id,
    commentId: req.query.commentId,
    replyId: req.query.replyId
  };

  await postService.deleteReply(dto);

  successResponse(res, 'Successfully deleted reply', '', 204);
})

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId

  await postService.deletePostById(postId)

  successResponse(res, 'Successfully deleted post', '', 204)
})

export const likePost = asyncHandler(async (req, res) => {
  
})

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