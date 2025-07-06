import Joi from 'joi';
import { AppError } from '../../utils/appError.js';

const sendMessageSchema = Joi.object({
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    content: Joi.string().trim().min(1).required(),
    isPremium: Joi.boolean().default(false)
})

export class SendMessageDto {
    constructor(payload) {
        const { error, value } = sendMessageSchema.validate(payload)
        if (error) {
            throw new AppError(error.message, 400)
        }

        this.senderId = value.senderId
        this.receiverId = value.receiverId
        this.content = value.content
        this.isPremium = value.isPremium
    }
}