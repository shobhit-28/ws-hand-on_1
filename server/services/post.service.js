import Post from '../models/posts.model.js'
import User from '../models/auth.model.js'
import Comment from '../models/comment.model.js'
import { deleteFileFromB2, generateDownloadUrl, uploadFileToB2 } from '../utils/b2Utils.js'
import { AppError } from '../utils/appError.js'

export const createPostService = async (dto) => {
    const uploadedFileName = await uploadFileToB2(dto.file.buffer, dto.file.originalname, dto.file.mimetype)

    return await Post.create({
        userId: dto.userId,
        content: dto.content,
        photoFileName: uploadedFileName
    })
}

export const getPosts = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(`User not found`, 404)
    }

    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('userId')

    const postsWithData = await Promise.all(
        posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id })
                .sort({ createdAt: 1 })
                .populate('userId')
                .populate('replies.userId')

            return {
                ...post.toObject(),
                comments: comments || [],
                photoEndpoint: `/rchat/post/photo/${post._id}`
            }
        })
    )

    return postsWithData
}

export const getPostsByUserId = async (userId) => {
    const user = await User.exists({ _id: userId })
    if (!user) {
        throw new AppError(`User not found`, 404)
    }

    const posts = await Post.find({ userId })
        .sort({ createdAt: -1 })
        .populate('userId')

    const postsWithData = await Promise.all(
        posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id })
                .sort({ createdAt: 1 })
                .populate('userId')
                .populate('replies.userId')

            return {
                ...post.toObject(),
                comments: comments || [],
                photoEndpoint: `/rchat/post/photo/${post._id}`
            }
        })
    )

    return postsWithData
}

export const getPostsById = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(`User not found`, 404)
    }

    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('userId')

    const postsWithData = await Promise.all(
        posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id })
                .sort({ createdAt: 1 })
                .populate('userId')
                .populate('replies.userId')

            return {
                ...post.toObject(),
                comments: comments || [],
                photoEndpoint: `/rchat/post/photo/${post._id}`
            }
        })
    )

    return postsWithData
}

export const getPostsForUrlBinding = async (postId) => {
    const post = await Post.findById(postId)
    if (!post) throw new AppError('Post not found', 404)

    const signedUrl = await generateDownloadUrl(post.photoFileName)
    return signedUrl
}

export const getPostById = async (id) => {
    return await Post.findById(id)
}

export const deletePostById = async (id) => {
    const post = await Post.findByIdAndDelete(id)
    if (post) await deleteFileFromB2(post.photoFileName)
    return post
}

export const deleteExpiredPhotos = async () => {
    const cutoff = new Date(Date.now() - 6.9 * 24 * 60 * 60 * 1000)
    const posts = await Post.find({ createdAt: { $lt: cutoff } })

    for (const post of posts) {
        await deleteFileFromB2(post.photoFileName)
    }

    return posts.length
}

export const addLike = async (postId, userId) => {
    return await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId }
    }, { new: true }).populate('userId')
}

export const removeLike = async (postId, userId) => {
    return await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
    }, { new: true }).populate('userId')
}

export const addComment = async ({ postId, userId, text }) => {
    const newComment = await Comment.create({ postId, userId, text })
    return newComment
}

export const addReply = async ({ commentId, userId, text }) => {
    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        { $push: { replies: { userId, text, createdAt: new Date() } } },
        { new: true }
    )

    return updatedComment
}

export const editComment = async ({ commentId, text, userId }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, userId },
        { text },
        { new: true }
    )

    return updatedComment
}

export const editReply = async ({ commentId, userId, replyId, text }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, 'replies._id': replyId, 'replies.userId': userId },
        { $set: { 'replies.$.text': text } },
        { new: true }
    )

    return updatedComment
}

export const deleteComment = async ({ commentId, userId }) => {
    const deleted = await Comment.findOneAndDelete({ _id: commentId, userId })
    return deleted
}

export const deleteReply = async ({ commentId, replyId, userId }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId },
        { $pull: { replies: { _id: replyId, userId } } },
        { new: true }
    )

    return updatedComment
}