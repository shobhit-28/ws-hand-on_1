import { asyncHandler } from '../middleware/asyncHandler.js'
import * as notification from '../services/notification.service.js'
import { successResponse } from '../utils/apiResponse.util.js';

export const getAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const notifications = await notification.getAllNotifications(userId);

    successResponse(res, `${notifications.length} notifications recieved`, notifications)
})