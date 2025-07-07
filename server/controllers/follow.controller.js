import { FollowUnfollowDTO } from "../dto/follow/follow.dto.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as fs from '../services/follow.service.js'
import { successResponse } from "../utils/apiResponse.util.js";

export const follow = asyncHandler(async (req, res) => {
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    const response = await fs.followUser(dto)
    successResponse(res, `Followed ${response.followerUser.name} successfully`)
})

export const unfollow = asyncHandler(async (req, res) => {
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    await fs.unfollowUser(dto)
    successResponse(res, `Unfollowed successfully`)
})