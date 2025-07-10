import User from "../models/auth.model.js";
import Message from "../models/chat.model.js"
import { AppError } from "../utils/appError.js";
import { calculateExpiryHours } from "../utils/chat.util.js";

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

    await message.populate({
        path: 'sender receiver',
        select: '-password -__v -firstMessageSent'
    })

    return message
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

    return messages;
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

    return message;
}