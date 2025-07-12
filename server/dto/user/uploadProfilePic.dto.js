import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const uploadProfilePicSchema = Joi.object({
    userId: Joi.string().required(),
    file: Joi.object({
        path: Joi.string().required()
    }).unknown(true).required()
});

export class UploadProfilePicDto {
    constructor({ userId, file }) {
        const { error, value } = uploadProfilePicSchema.validate({ userId, file })

        if (error) {
            throw new AppError(error.message)
        }

        this.userId = value.userId
        this.file = value.file
    }
}