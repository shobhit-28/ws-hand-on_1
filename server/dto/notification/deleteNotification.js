import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const deleteNotification = Joi.object({
    userId: Joi.string().required(),
    notificationId: Joi.string().required(),
})

export class DeleteNotificationDTO {
    constructor(payload) {
        const { error, value } = deleteNotification.validate(payload);

        if (error) {
            throw new AppError(error.message)
        }

        this.userId = value.userId;
        this.notificationId = value.notificationId;
    }
}