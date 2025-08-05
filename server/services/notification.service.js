import Notification from "../models/notification.model"

export const createNotification = async ({ recipientId, senderId, type, postId, messageId, content }) => {
    let expiresAt = null

    if (type === 'new_message') {
        expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    } else {
        expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }

    const notification = await Notification.create({
        recipientId,
        senderId,
        type,
        postId,
        messageId,
        content,
        expiresAt
    })

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