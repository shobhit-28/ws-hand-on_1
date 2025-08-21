import { CheckStatusDTO } from "../dto/follow/checkStatus.dto.js";
import { FollowUnfollowDTO } from "../dto/follow/follow.dto.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as fs from '../services/follow.service.js'
import * as notification from '../services/notification.service.js'
import { successResponse } from "../utils/apiResponse.util.js";
import { findUser } from "../utils/user.util.js";

export const follow = asyncHandler(async (req, res) => {
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    const response = await fs.followUser(dto)

    await notification.createNotification(req, {
        recipientId: dto.following,
        senderId: dto.follower,
        type: 'follow',
        content: `${response?.followerUser?.name} followed you`
    })
    console.log('22', response?.followerUser?.name)

    successResponse(res, `Followed ${response.followerUser.name} successfully`, {}, 201)
})

export const unfollow = asyncHandler(async (req, res) => {
    const dto = new FollowUnfollowDTO({
        follower: req.user.id,
        following: req.body.followingId
    })

    await fs.unfollowUser(dto)

    const sender = await findUser(dto.follower)

    await notification.unfollowUser(req, {
        recipientId: dto.following,
        senderId: dto.follower,
        content: `${sender?.name} followed you`
    })

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

export const checkStatus = asyncHandler(async (req, res) => {
    const dto = new CheckStatusDTO({
        ...req.query,
        userId: req.user.id
    })

    const status = await fs.checkStatus(dto)

    successResponse(res, `Successfully fetched response`, status)
})