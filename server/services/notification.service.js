import Notification from "../models/notification.model.js"

export const createNotification = async (req, notificationPayload) => {
    const expiresAt = new Date(Date.now() + (notificationPayload?.type === 'new_message' ? 1 : 5) * 24 * 60 * 60 * 1000)

    const notification = await Notification.create({
        recipientId: notificationPayload?.recipientId,
        senderId: notificationPayload?.senderId,
        type: notificationPayload?.type,
        postId: notificationPayload?.postId,
        messageId: notificationPayload?.messageId,
        content: notificationPayload?.content,
        expiresAt
    })

    if (notificationPayload?.type !== 'new_message') {
        const io = req.app.get('io')
        io.to(notificationPayload?.recipientId).emit('notification', notification)
    }

    return notification
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