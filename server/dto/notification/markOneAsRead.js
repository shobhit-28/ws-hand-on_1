import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const markNotificationAsRead = Joi.object({
    userId: Joi.string().required(),
    notificationId: Joi.string().required()
})

export class MarkNotificationAsRead {
    constructor(payload) {
        const { error, value } = markNotificationAsRead.validate(payload)

        if (error) {
            throw new AppError(error.message)
        }

        this.userId = value.userId;
        this.notificationId = value.notificationId;
    }
}