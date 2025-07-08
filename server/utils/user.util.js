import User from "../models/auth.model.js"
import { AppError } from "./appError.js";

export const findUser = async (userId) => {
    try {
        const user = User.findById(userId);
        return user
    } catch (error) {
        throw new AppError(`User not found`, 404)
    }
}