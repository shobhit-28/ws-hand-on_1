import cloudinary from "../config/cloudinary.js";
import User from "../models/auth.model.js";
import Follow from '../models/follow.model.js'
import { AppError } from '../utils/appError.js';
import mongoose from "mongoose";

export const uploadProfilePicService = async ({ userId, file }) => {
    if (!file || !file.path) {
        throw new AppError(`No file uploaded`, 400)
    }

    const user = await User.findById(userId).select('+profile_pic_id')

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

export const findUsers = async ({ user, userToBeSearched, limit, page }) => {
    if (!userToBeSearched) return { users: [], total: 0, page: +page, limit: +limit, totalPages: 0 };

    const q = userToBeSearched;

    const userObjectId = new mongoose.Types.ObjectId(user);

    const pipeline = [
        {
            $match: {
                _id: { $ne: userObjectId },
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } }
                ]
            }
        },
        {
            $addFields: {
                matchRank: {
                    $cond: [
                        {
                            $or: [
                                { $regexMatch: { input: { $toLower: '$name' }, regex: '^' + q.toLowerCase() } },
                                { $regexMatch: { input: { $toLower: '$email' }, regex: '^' + q.toLowerCase() } }
                            ]
                        }, 0, 1
                    ]
                }
            }
        },
        { $sort: { matchRank: 1, name: 1 } },
        { $project: { password: 0, __v: 0, profile_pic_id: 0 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ];

    const countPipeline = pipeline.slice(0, 1).concat([
        { $count: 'total' }
    ]);

    let [users, totalRes] = await Promise.all([
        User.aggregate(pipeline),
        User.aggregate(countPipeline)
    ]);

    const total = totalRes[0]?.total || 0;

    const userIds = users.map(u => u._id);

    // Get relationship data
    const [imFollowing, followingMe] = await Promise.all([
        Follow.find({ follower: userObjectId, following: { $in: userIds } }).select('following'),
        Follow.find({ follower: { $in: userIds }, following: userObjectId }).select('follower')
    ]);

    const imFollowingSet = new Set(imFollowing.map(f => f.following.toString()));
    const followingMeSet = new Set(followingMe.map(f => f.follower.toString()));

    // Annotate
    users = users.map(u => {
        const id = u._id.toString();
        const iFollow = imFollowingSet.has(id);
        const followsMe = followingMeSet.has(id);
        let relationship;
        if (iFollow && followsMe) relationship = "mutual";
        else if (iFollow) relationship = "following";
        else if (followsMe) relationship = "follower";
        else relationship = "none";
        return { ...u, relationship };
    });

    // Sort by relationship
    const relationshipRank = { mutual: 0, following: 1, follower: 2, none: 3 };
    users.sort((a, b) => relationshipRank[a.relationship] - relationshipRank[b.relationship]);

    return {
        users,
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / limit)
    }
};

export const updateBioService = async ({ userId, name, email, bio }) => {
    try {
        await User.findByIdAndUpdate(userId, {
            name,
            email,
            bio
        })
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(`Email already exists`, 400)
        }
    }
    return { name, email, bio }
}