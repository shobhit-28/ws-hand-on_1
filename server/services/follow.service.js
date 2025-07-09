import Follow from "../models/follow.model.js";
import User from "../models/auth.model.js";
import { AppError } from "../utils/appError.js"
import { isAlreadyFollowing, isGettingFollowed } from "../utils/follow.util.js";

export const followUser = async ({ follower, following }) => {
    if (follower === following) {
        throw new AppError(`You cannot follow youself 😂`, 400);
    }

    const followerUser = await User.findById(follower);
    const followingUser = await User.findById(following);

    if (!followerUser || !followingUser) {
        throw new AppError(`User not found`, 404)
    }

    const exists = await isAlreadyFollowing(follower, following);
    if (exists) {
        throw new AppError(`Already following`, 400)
    }

    await Follow.create({ follower, following })

    return { follower, following, followingUser, followerUser }
}

export const unfollowUser = async ({ follower, following }) => {
    console.log(follower, following)
    if (following === follower) {
        throw new AppError(`You cannot unfollow yourself 😂`, 400)
    }

    const follow = await Follow.findOne({ follower, following });
    if (!follow) {
        throw new AppError(`You are not following this user`, 400)
    }

    await follow.deleteOne();

    return { follower, following }
}

export const getFollowers = async (follower) => {
    const followers = await Follow.find({ follower })
        .populate({
            path: 'following',
            select: '-password -__v -firstMessageSent'
        })
        .sort({ follower: 1 })
    return followers
}

export const getFollowing = async (follower) => {
    const followings = await Follow.find({ following: follower })
        .populate({
            path: 'follower',
            select: '-password -__v -firstMessageSent'
        })
        .sort({ following: 1 })
    return followings
}

export const checkStatus = async ({ action, userId, withUserId }) => {
    let status;
    if (action === 'isAlreadyFollowing') {
        status = await isAlreadyFollowing(userId, withUserId)
    } else {
        status = await isGettingFollowed(userId, withUserId)
    }

    return status
}