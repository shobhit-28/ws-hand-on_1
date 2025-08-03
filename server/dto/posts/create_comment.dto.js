import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const addCommentSchema = Joi.object({
    postId: Joi.string().required(),
    userId: Joi.string().required(),
    text: Joi.string().required()
});

export class AddCommentDTO {
    constructor(payload) {
        const { error, value } = addCommentSchema.validate(payload)

        if (error) {
            throw new AppError(error.message)
        }

        this.postId = value.postId;
        this.userId = value.userId;
        this.text = value.text;
    }
}