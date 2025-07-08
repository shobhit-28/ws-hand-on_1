import Follow from "../models/follow.model.js"

export const isAlreadyFollowing = async (follower, following) => {
    const existing = await Follow.findOne({ follower, following })
    return !!existing;
}

export const isGettingFollowed = async (follower, following) => {
    const isGettingFollowed = await Follow.findOne({ follower: following, following: follower })
    return !!isGettingFollowed
}