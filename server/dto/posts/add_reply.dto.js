import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const addReplySchema = Joi.object({
    commentId: Joi.string().required(),
    userId: Joi.string().required(),
    text: Joi.string().required()
})

export class AddReplyDTO {
    constructor({ commentId, userId, text }) {
        const { error, value } = addReplySchema.validate({ commentId, userId, text })

        if (error) {
            throw new AppError(error.message)
        }

        this.commentId = value.commentId
        this.userId = value.userId
        this.text = value.text
    }
}