import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const editComment = Joi.object({
    commentId: Joi.string().required(),
    userId: Joi.string().required(),
    text: Joi.string().required()
})

export class EditCommentDTO {
    constructor({ commentId, userId, text }) {
        const { error, value } = editComment.validate({ commentId, userId, text })

        if (error) {
            throw new AppError(error.message)
        }

        this.commentId = value.commentId
        this.userId = value.userId
        this.text = value.text
    }
}