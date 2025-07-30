import Joi from 'joi'
import { AppError } from '../../utils/appError.js'

const updateProfileSchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().trim().required().email({ tlds: { allow: false } }),
    bio: Joi.string().trim().max(40).allow('').default('')
})

export class UpdateProfileDTO {
    constructor(payload) {
        const { error, value } = updateProfileSchema.validate(payload)

        if (error) {
            throw new AppError(error.message)
        }

        this.userId = value.userId;
        this.name = value.name;
        this.email = value.email;
        this.bio = value.bio;
    }
}