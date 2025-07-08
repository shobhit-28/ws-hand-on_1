import { FollowUnfollowDTO } from "../dto/follow/follow.dto.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as fs from '../services/follow.service.js'
import { successResponse } from "../utils/apiResponse.util.js";
import { findUser } from "../utils/user.util.js";

export const follow = asyncHandler(async (req, res) => {
    console.log(req.body)
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    const response = await fs.followUser(dto)
    successResponse(res, `Followed ${response.followerUser.name} successfully`, {}, 201)
})

export const unfollow = asyncHandler(async (req, res) => {
    console.log(req.body)
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    await fs.unfollowUser(dto)
    successResponse(res, `Unfollowed successfully`, {}, 204)
})

export const getFollowers = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user.id;
    const followerList = await fs.getFollowers(userId)
    successResponse(res, `Successfully fetched followers list`, followerList)
})

export const getFollowing = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user.id;
    const followingList = await fs.getFollowing(userId)
    successResponse(res, `Successfully fetched following list`, followingList)
})

export const isGettingFollowed = asyncHandler(async (req, res) => {
    
})