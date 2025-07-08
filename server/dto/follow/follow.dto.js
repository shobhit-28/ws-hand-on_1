import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const followUnfollowSchema = Joi.object({
    follower: Joi.string().required(),
    following: Joi.string().required().invalid(Joi.ref('follower'))
});

export class FollowUnfollowDTO {
    constructor(payload) {
        const { error, value } = followUnfollowSchema.validate(payload)
        if (error) {
            throw new AppError(error.message)
        }

        this.follower = value.follower
        this.following = value.following
    }
}