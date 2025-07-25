import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const searchUserSchema = Joi.object({
    user: Joi.string().required(),
    userToBeSearched: Joi.string().required(),
    limit: Joi.number().greater(0).required(),
    page: Joi.number().greater(0).required()
})

export class SearchUserDTO {
    constructor(payload) {
        const { error, value } = searchUserSchema.validate(payload);

        if (error) {
            throw new AppError(error.message)
        }

        this.user = value.user
        this.userToBeSearched = value.userToBeSearched
        this.limit = value.limit
        this.page = value.page
    }
}