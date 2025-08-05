import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const likeDislikeSchema = Joi.object({
    user: Joi.string().required(),
    post: Joi.string().required()
})

export class LikeDislikeDTO {
    constructor(payload) {
        const { error, value } = likeDislikeSchema.validate(payload)

        if (error) {
            throw new AppError(error.message)
        }

        this.user = value.user;
        this.post = value.post;
    }
}