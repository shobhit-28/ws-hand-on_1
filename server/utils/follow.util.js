import Follow from "../models/follow.model.js"
import { AppError } from "./appError.js";

export const isAlreadyFollowing = async (follower, following) => {
    try {
        const existing = await Follow.findOne({ follower, following })
        return !!existing;        
    } catch (error) {
        throw new AppError(error)
    }
}

export const isGettingFollowed = async (follower, following) => {
    try {
        const isGettingFollowed = await Follow.findOne({ follower: following, following: follower })
        return !!isGettingFollowed        
    } catch (error) {
        throw new AppError(error)
    }
}