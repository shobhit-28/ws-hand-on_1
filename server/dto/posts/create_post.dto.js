import Joi from 'joi'
import { AppError } from '../../utils/appError.js'

const MAX_FILE_SIZE = 1.5 * 1024 * 1024 // 1.5MB in bytes
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

const createPostSchema = Joi.object({
    userId: Joi.string().required(),
    content: Joi.string().allow('').optional(),
    file: Joi.object({
        buffer: Joi.binary().required(),
        mimetype: Joi.string().valid(...allowedImageTypes).required(),
        size: Joi.number().max(MAX_FILE_SIZE).required(),
        originalname: Joi.string().required()
    }).unknown(true).required()
})

export class CreatePostDto {
    constructor({ userId, content, file }) {
        const { error, value } = createPostSchema.validate({ userId, content, file })

        if (error) {
            throw new AppError(error.message)
        }

        this.userId = value.userId
        this.content = value.content
        this.file = value.file
    }
}
