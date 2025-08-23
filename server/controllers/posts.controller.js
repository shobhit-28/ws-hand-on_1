import * as postService from '../services/post.service.js'
import * as notification from '../services/notification.service.js'
import { CreatePostDto } from '../dto/posts/create_post.dto.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.util.js'
import { AppError } from '../utils/appError.js'
import https from 'https'
import { AddCommentDTO } from '../dto/posts/create_comment.dto.js'
import { AddReplyDTO } from '../dto/posts/add_reply.dto.js'
import { EditCommentDTO } from '../dto/posts/edit_comment.dto.js'
import { EditReplyDTO } from '../dto/posts/edit_reply.dto.js'
import { LikeDislikeDTO } from '../dto/posts/like_dislike.dto.js'
import { findUser } from '../utils/user.util.js'

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

export const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await postService.getPostById(postId)

  successResponse(res, `Post fetched successfully`, post, 201)
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

  if (comment.postId.userId._id.toString() !== dto.userId) {
    await notification.createNotification(req, {
      recipientId: comment.postId.userId._id,
      senderId: dto.userId,
      type: 'comment',
      content: `${comment?.userId?.name} commented on your post`,
      postId: comment.postId._id,
      commentId: comment._id
    })
  }

  successResponse(res, 'Successfully posted a comment', comment)
})

export const addReply = asyncHandler(async (req, res) => {
  const dto = new AddReplyDTO({
    commentId: req.body.commentId,
    userId: req.user.id,
    text: req.body.reply
  });

  const reply = await postService.addReply(dto);

  if (reply.updatedComment.postId.userId._id.toString() !== dto.userId) {
    await notification.createNotification(req, {
      recipientId: reply.updatedComment.postId.userId._id,
      senderId: dto.userId,
      type: 'comment',
      content: `${reply?.updatedComment?.userId?.name} replied on a comment on your post`,
      postId: reply?.updatedComment?.postId?._id,
      commentId: dto.commentId,
      replyId: reply._id
    })
  }

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

  const comment = await postService.deleteComment(dto);
  await notification.removeComment(req, {
    recipientId: comment.postId.userId._id.toString(),
    senderId: dto.userId.toString(),
    commentId: comment._id.toString(),
    content: `${comment?.userId?.name} commented on your post`
  })

  successResponse(res, `Successfully deleted comment`, '', 204);
})

export const deleteReply = asyncHandler(async (req, res) => {
  const dto = {
    userId: req.user.id,
    commentId: req.query.commentId,
    replyId: req.query.replyId
  };

  const reply = await postService.deleteReply(dto);
  await notification.removeReply(req, {
    recipientId: reply.postId.userId._id.toString(),
    senderId: dto.userId,
    commentId: dto.commentId,
    replyId: dto.replyId
  })

  successResponse(res, 'Successfully deleted reply', '', 204);
})

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const user = req.user.id

  const post = await postService.deletePostById(postId)

  console.log(post)
  await notification.clearPostRelatedNotifications(req, {
    recipientId: user,
    postId: postId,
    post
  })

  successResponse(res, 'Successfully deleted post', '', 204)
})

export const likePost = asyncHandler(async (req, res) => {
  const dto = new LikeDislikeDTO({
    user: req.user.id,
    post: req.body.postId
  })

  const post = await postService.addLike(dto.post, dto.user)

  const user = await findUser(dto.user)

  if (post.userId._id.toString() !== dto.user) {
    await notification.createNotification(req, {
      recipientId: post.userId._id,
      senderId: dto.user,
      type: 'like',
      content: `${user.name} liked your post`,
      postId: post._id
    })
  }

  successResponse(res, `Successfully liked post`, post)
})

export const unlikePost = asyncHandler(async (req, res) => {
  const dto = new LikeDislikeDTO({
    user: req.user.id,
    post: req.body.postId
  })

  const post = await postService.removeLike(dto.post, dto.user)

  if (dto.user !== post.userId._id) {
    await notification.unlikePost(req, {
      postId: post._id,
      recipientId: post.userId._id,
      senderId: dto.user
    })
  }

  successResponse(res, `Successfully removed like from the post`, post)
})