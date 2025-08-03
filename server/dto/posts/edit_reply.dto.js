import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const editReplySchema = Joi.object({
    commentId: Joi.string().required(),
    userId: Joi.string().required(),
    replyId: Joi.string().required(),
    text: Joi.string().required()
})

export class EditReplyDTO {
    constructor(payload) {
        const { error, value } = editReplySchema.validate(payload);

        if (error) {
            throw new AppError(error.message)
        }

        this.commentId = value.commentId;
        this.userId = value.userId;
        this.replyId = value.replyId;
        this.text = value.text;
    }
}