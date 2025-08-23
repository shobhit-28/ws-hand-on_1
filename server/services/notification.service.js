import Notification from "../models/notification.model.js"
import Post from "../models/posts.model.js"

export const createNotification = async (req, notificationPayload) => {
    const expiresAt = new Date(Date.now() + (notificationPayload?.type === 'new_message' ? 1 : 5) * 24 * 60 * 60 * 1000)

    const notification = await Notification.create({
        recipientId: notificationPayload?.recipientId,
        senderId: notificationPayload?.senderId,
        type: notificationPayload?.type,
        postId: notificationPayload?.postId,
        messageId: notificationPayload?.messageId,
        content: notificationPayload?.content,
        commentId: notificationPayload?.commentId,
        replyId: notificationPayload?.replyId,
        expiresAt
    })
    const populatedNotification = await Notification.findById(notification._id).populate(['postId', 'senderId', 'recipientId'])

    if (notificationPayload?.type !== 'new_message') {
        const io = req.app.get('io')
        io.to(notificationPayload?.recipientId.toString()).emit('add-notification', populatedNotification)
    }

    return populatedNotification
}

export const markNotificationAsRead = async ({ userId, notificationId }) => {
    const newNotification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { isRead: true },
        { new: true }
    )

    return newNotification;
}

export const markAllNotificationReadForUser = async (recipientId) => {
    const notifications = await Notification.updateMany(
        { recipientId, isRead: false },
        {
            $set: {
                isRead: true
            }
        }
    )

    return notifications;
}

export const deleteNotification = async ({ notificationId, userId }) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipientId: userId
    })
    return notification
}

export const clearNotifications = async (recipientId) => {
    await Notification.deleteMany({ recipientId })
}

export const unlikePost = async (req, { postId, recipientId, senderId }) => {
    const notification = await Notification.findOneAndDelete({
        postId,
        recipientId,
        senderId,
        type: 'like'
    })

    if (notification) {
        const io = req.app.get('io')
        io.to(notification?.recipientId.toString()).emit('remove-notification', notification)
    }
}

export const unfollowUser = async (req, { recipientId, senderId, content }) => {
    const notification = await Notification.findOneAndDelete({
        recipientId,
        senderId,
        content,
        type: 'follow'
    })

    console.log(notification)

    if (notification) {
        const io = req.app.get('io')
        io.to(notification?.recipientId.toString()).emit('remove-notification', notification)
    }
}

export const removeComment = async (req, { recipientId, senderId, commentId, content }) => {
    const notification = await Notification.findOneAndDelete({
        recipientId,
        senderId,
        commentId,
        content
    })

    if (notification) {
        await Notification.deleteMany({
            recipientId,
            senderId,
            commentId
        })

        const io = req.app.get('io')
        io.to(notification?.recipientId.toString()).emit('remove-notification', notification)
    }
}

export const removeReply = async (req, { recipientId, senderId, commentId, replyId }) => {
    const notification = await Notification.findOneAndDelete({
        recipientId,
        senderId,
        commentId,
        replyId
    })

    if (notification) {
        const io = req.app.get('io')
        io.to(notification?.recipientId.toString()).emit('remove-notification', notification)
    }
}

export const clearPostRelatedNotifications = async (req, { recipientId, postId, post }) => {
    const notifications = await Notification.deleteMany({ postId })

    if (notifications.deletedCount > 0) {
        const io = req.app.get('io')
        io.to(recipientId).emit('remove-notification', {
            ...notifications[0],
            type: 'Post Removal',
            postId: post
        })
    }
}

export const getAllNotifications = async (userId) => {
    const notifications = await Notification.find({ recipientId: userId })
        .populate('recipientId')
        .populate('senderId')
        .populate('postId')
        .populate('messageId')
        .populate('commentId')
        .sort({ createdAt: -1 })

    return notifications;
}