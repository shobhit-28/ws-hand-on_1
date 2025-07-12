import cloudinary from "../config/cloudinary.js";
import User from "../models/auth.model.js";
import { AppError } from '../utils/appError.js';

export const uploadProfilePicService = async ({ userId, file }) => {
    if (!file || !file.path) {
        throw new AppError(`No file uploaded`, 400)
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(`User not found`, 404);
    }

    if (user.profile_pic_id) {
        await cloudinary.uploader.destroy(user.profile_pic_id)
    }

    await User.findByIdAndUpdate(userId, {
        profile_pic: file.path,
        profile_pic_id: file.filename
    })

    return file.path
}