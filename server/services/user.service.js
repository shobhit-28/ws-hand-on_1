import cloudinary from "../config/cloudinary.js";
import User from "../models/auth.model.js";
import { AppError } from '../utils/appError.js';

export const uploadProfilePicService = async ({ userId, file }) => {
    if (!file || !file.path) {
        throw new AppError(`No file uploaded`, 400)
    }

    const user = await User.findById(userId)

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

    const pipeline = [
        {
            $match: {
                _id: { $ne: user },
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

    const [users, totalRes] = await Promise.all([
        User.aggregate(pipeline),
        User.aggregate(countPipeline)
    ]);

    const total = totalRes[0]?.total || 0;

    return {
        users,
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / limit)
    }
};