import mongoose from "mongoose";
import User from "../models/auth.model.js";
import Message from "../models/chat.model.js"
import Follow from "../models/follow.model.js";
import { AppError } from "../utils/appError.js";
import { calculateExpiryHours } from "../utils/chat.util.js";
import { ChatHistory } from "../models/chatHistory.model.js";

export const createNewMessage = async ({ senderId, receiverId, content }) => {
    const sender = await User.findById(senderId);
    const reciever = await User.findById(receiverId);

    if (!sender) {
        throw new AppError('Sended Invalid', 404)
    }

    if (!reciever) {
        throw new AppError(`Reciever not found`, 404)
    }

    if (!sender.firstMessageSent) {
        sender.firstMessageSent = true;
        await sender.save()
    }

    const expireAt = calculateExpiryHours(false);

    const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        expireAt
    })

    await updateChatHistory(senderId, receiverId)
    await updateChatHistory(receiverId, senderId)

    await message.populate({
        path: 'sender receiver',
        select: '-password -__v -firstMessageSent'
    })

    return message.toObject();
}

export const updateChatHistory = async (userId, mateId) => {
    const now = new Date()

    const existing = await ChatHistory.findOne({ user: userId, 'mates.mate': mateId })

    if (existing) {
        await ChatHistory.updateOne(
            { user: userId, 'mates.mate': mateId },
            { $set: { 'mates.$.lastInteracted': now } }
        )
    } else {
        await ChatHistory.updateOne(
            { user: userId },
            { $push: { mates: { mate: mateId, lastInteracted: now } } },
            { upsert: true }
        )
    }
}

export const fetchMessages = async ({ userId, withUserId }) => {
    const messages = await Message.find({
        $or: [
            { sender: userId, receiver: withUserId },
            { sender: withUserId, receiver: userId }
        ],
        deletedBy: { $ne: userId }
    }).populate({
        path: 'sender receiver',
        select: '-password -__v -firstMessageSent'
    }).sort({ createdAt: 1 })

    return messages.map(message => message.toObject());
}

export const deleteMessage = async ({ messageId, userId }) => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new AppError(`Message not found`, 404)
    }

    const userIdStr = String(userId)
    const senderId = String(message.sender)
    const recieverId = String(message.receiver)

    if (userIdStr !== senderId && userIdStr !== recieverId) {
        throw new AppError(`Unauthorised`, 401)
    }

    if (message.expireAt && message.expireAt < new Date()) {
        throw new AppError(`Message has already expired`, 400)
    }

    if (message.deletedBy.includes(userIdStr)) {
        throw new AppError(`Message has already been deleted`, 400)
    }

    message.deletedBy.push(userIdStr)
    message.markModified('deletedBy')

    const senderDeleted = message.deletedBy.some(id => {
        return id.equals(message.sender)
    });
    const receiverDeleted = message.deletedBy.some(id => {
        return id.equals(message.receiver)
    });

    if (senderDeleted && receiverDeleted) {
        try {
            await Message.findByIdAndDelete(messageId)
        } catch (error) {
            console.error(error)
        }
    } else {
        await message.save()
    }

    return message.toObject();
}

export const getChattableMates = async (userId) => {
    if (!userId) {
        throw new AppError(`User not found`, 404)
    }

    const following = (await Follow.find({ following: userId }).select('follower')).map(objId => objId.follower.toString())
    const follower = (await Follow.find({ follower: userId }).select('following')).map(objId => objId.following.toString())

    const friendsList = following.filter(id => follower.includes(id))

    const chatHistory = await ChatHistory.findOne({ user: userId }).lean()

    const interactionMap = {}
    if (chatHistory?.mates?.length) {
        for (const entry of chatHistory.mates) {
            interactionMap[entry.mate.toString()] = entry.lastInteracted
        }
    }

    const mates = await User.find({ _id: { $in: friendsList } }).select('-password -__v -firstMessageSent')

    const matesList = mates.map(mongooseObj => {
        const mate = mongooseObj.toObject()
        return {
            ...mate,
            profile_pic: mate.profile_pic || "/assets/profile/empty_profile_male.svg",
            lastInteracted: interactionMap[mate._id.toString()] || new Date(0)
        }
    })

    matesList.sort((a, b) => new Date(b.lastInteracted) - new Date(a.lastInteracted))

    return matesList
}