import Joi from 'joi';
import { AppError } from '../../utils/appError.js';

const getMessagesSchema = Joi.object({
    userId: Joi.string().required(),
    withUserId: Joi.string().required(),
})

export class GetMessageDto {
    constructor(payload) {
        const { error, value } = getMessagesSchema.validate(payload)
        if (error) {
            throw new AppError(error.message, 400)
        }

        this.userId = value.userId;
        this.withUserId = value.withUserId;
    }
}