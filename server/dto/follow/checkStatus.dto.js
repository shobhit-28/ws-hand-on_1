import Joi from "joi"
import { AppError } from "../../utils/appError.js";

const checkStatusSchema = Joi.object({
    action: Joi.string().valid(`isAlreadyFollowing`, `isGettingFollowed`).required(),
    userId: Joi.string().required(),
    withUserId: Joi.string().required()
})

export class CheckStatusDTO {
    constructor(payload) {
        const { error, value } = checkStatusSchema.validate(payload);
        if (error) {
            throw new AppError(error.message, 400);
        }

        this.action = value.action;
        this.userId = value.userId;
        this.withUserId = value.withUserId;
    }
}