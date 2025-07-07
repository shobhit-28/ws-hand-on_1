import Follow from "../models/follow.model.js"

export const isAlreadyFollowing = async (follower, following) => {
    const existing = await Follow.findOne({ follower, following })
    return !!existing;
}