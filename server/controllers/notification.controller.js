import { DeleteNotificationDTO } from '../dto/notification/deleteNotification.js';
import { MarkNotificationAsRead } from '../dto/notification/markOneAsRead.js';
import { asyncHandler } from '../middleware/asyncHandler.js'
import * as notificationService from '../services/notification.service.js'
import { successResponse } from '../utils/apiResponse.util.js';

export const getAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const notifications = await notificationService.getAllNotifications(userId);

    successResponse(res, `${notifications.length} notifications recieved`, notifications)
})

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const dto = new MarkNotificationAsRead({
        userId: req.user.id,
        notificationId: req.body.notificationId
    })

    const notification = await notificationService.markNotificationAsRead(dto)

    successResponse(res, 'Successfully marked as read', notification)
})

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
    const user = req.user.id;

    const notifications = await notificationService.markAllNotificationReadForUser(user);

    successResponse(res, `${notifications.modifiedCount} notifications marked as read`, notifications)
})

export const deleteNotification = asyncHandler(async (req, res) => {
    const notificationId = req.params.notificationId;
    const dto = new DeleteNotificationDTO({
        notificationId,
        userId: req.user.id
    })

    await notificationService.deleteNotification(dto);

    successResponse(res, '', '', 204)
})

export const clearNotifications = asyncHandler(async (req, res) => {
    await notificationService.clearNotifications(req.user.id);
    
    successResponse(res, '', '', 204)
})