import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const deleteMessageSchema = Joi.object({
    messageId: Joi.string().required(),
    userId: Joi.string().required()
})

export class DeleteMessageDTO {
    constructor(payload) {
        const { error, value } = deleteMessageSchema.validate(payload)
        if (error) {
            throw new AppError(error.message, 400)
        }
        this.messageId = value.messageId
        this.userId = value.userId
    }
}