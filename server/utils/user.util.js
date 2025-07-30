import User from "../models/auth.model.js"
import { AppError } from "./appError.js";
import { getCookieConfig } from "./auth.util.js";

export const findUser = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password -__v -profile_pic_id');
        if (!user) {
            throw new AppError(`User not found`, 404)
        }

        return user
    } catch (error) {
        throw new AppError(error)
    }

}

export const updateProfilePictureCookie = (res, user, url) => {
    const updatedUser = {
        ...user,
        profile_pic: url
    }
    console.log(updatedUser)
    res.cookie('user', JSON.stringify(updatedUser), getCookieConfig())
}

export const updateProfileDetailsCookieUtil = (res, user, newUser) => {
    const updatedUser = {
        ...user,
        name: newUser?.name,
        email: newUser?.email
    }
    console.log(updatedUser)
    res.cookie('user', JSON.stringify(updatedUser), getCookieConfig())
}