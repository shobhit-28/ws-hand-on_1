import Post from '../models/posts.model.js'
import User from '../models/auth.model.js'
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
        .populate('comments.userId')

    const postsWithData = await Promise.all(
        posts.map(async (post) => {
            const photoUrl = await generateDownloadUrl(post.photoFileName)
            return { ...post.toObject(), photoEndpoint: `/rchat/posts/photo/${post._id}` }
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
    }, { new: true }).populate('userId').populate('comments.userId')
}

export const removeLike = async (postId, userId) => {
    return await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
    }, { new: true }).populate('userId').populate('comments.userId')
}

export const addComment = async (postId, userId, text) => {
    const comment = { userId, text }
    return await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment }
    }, { new: true }).populate('userId').populate('comments.userId')
}
