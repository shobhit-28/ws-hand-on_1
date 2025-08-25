import Post from '../models/posts.model.js'
import User from '../models/auth.model.js'
import Comment from '../models/comment.model.js'
import Follow from '../models/follow.model.js'
import { deleteFileFromB2, generateDownloadUrl, uploadFileToB2 } from '../utils/b2Utils.js'
import { AppError } from '../utils/appError.js'
import mongoose from 'mongoose'

export const createPostService = async (dto) => {
    const uploadedFileName = await uploadFileToB2(dto.file.buffer, dto.file.originalname, dto.file.mimetype)

    return await Post.create({
        userId: dto.userId,
        content: dto.content,
        photoFileName: uploadedFileName
    })
}

const excludePostOfUser = async (users) => {
    const posts = await Post.find({
        userId: { $ne: users }
    })
        .sort({ createdAt: -1 })
        .populate('userId')

    return posts
}

const includePostOfUser = async (users) => {
    if (Array.isArray(users)) {
        const userIds = [...new Set(users.map(user => user.following))]

        if (userIds.length === 0) {
            return []
        }

        const posts = await Post.find({
            userId: { $in: userIds }
        })
            .sort({ createdAt: -1 })
            .populate('userId')

        return posts
    } else {
        throw new AppError('users must be array')
    }
}

export const getPosts = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(`User not found`, 404)
    }

    const posts = await excludePostOfUser(userId)

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

export const getPostOfFollowing = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(`User not found`, 404)
    }

    const followingList = await Follow.find({
        follower: userId
    }).select('following')

    console.log(followingList)

    const posts = await includePostOfUser(followingList)

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
        .populate('replies.userId')

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
    const post = await Post.findById(id).populate('userId')

    const comments = await Comment.find({ postId: post._id }).populate('userId').populate('replies.userId')

    const postWithData = {
        ...post.toObject(),
        comments: comments || [],
        photoEndpoint: `/rchat/post/photo/${post._id}`
    }

    return postWithData
}

export const deletePostById = async (id) => {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        throw new AppError(`Post not found`, 404);
    }
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
    }, { new: true }).populate('likes')
}

export const removeLike = async (postId, userId) => {
    return await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
    }, { new: true }).populate('likes')
}

export const addComment = async ({ postId, userId, text }) => {
    const newComment = await Comment.create({ postId, userId, text })
        .then(doc => doc.populate([
            { path: 'userId' },
            { path: 'replies.userId' },
            { path: 'postId', populate: { path: 'userId' } }
        ]))
    return newComment
}

export const addReply = async ({ commentId, userId, text }) => {
    const _id = new mongoose.Types.ObjectId()

    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        { $push: { replies: { _id, userId, text, createdAt: new Date() } } },
        { new: true }
    ).then(doc => doc.populate([
        { path: 'userId' },
        { path: 'replies.userId' },
        { path: 'postId', populate: { path: 'userId' } }
    ]))

    const reply = updatedComment.replies.find(reply => reply._id.equals(_id))

    return { ...reply.toObject(), updatedComment }
}

export const editComment = async ({ commentId, text, userId }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, userId },
        { text },
        { new: true }
    ).then(doc => doc.populate('userId')).then(doc => doc.populate('replies.userId'))

    return updatedComment
}

export const editReply = async ({ commentId, userId, replyId, text }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, 'replies._id': replyId, 'replies.userId': userId },
        { $set: { 'replies.$.text': text } },
        { new: true }
    ).then(doc => doc.populate('userId')).then(doc => doc.populate('replies.userId'))

    const reply = updatedComment.replies.find(reply => reply._id.equals(replyId))

    return reply
}

export const deleteComment = async ({ commentId, userId }) => {
    const deleted = await Comment.findOneAndDelete({ _id: commentId, userId })
        .then(doc => doc.populate([
            { path: 'userId' },
            { path: 'replies.userId' },
            { path: 'postId', populate: { path: 'userId' } }
        ]))
    return deleted
}

export const deleteReply = async ({ commentId, replyId, userId }) => {
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId },
        { $pull: { replies: { _id: replyId, userId } } },
        { new: true }
    ).then(doc => doc.populate([
        { path: 'userId' },
        { path: 'replies.userId' },
        { path: 'postId', populate: { path: 'userId' } }
    ]))

    return updatedComment
}