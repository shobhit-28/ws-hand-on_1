import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mates: [
        {
            mate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            lastInteracted: { type: Date, default: Date.now }
        }
    ]
})

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema)