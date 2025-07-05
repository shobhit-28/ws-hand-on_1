import mongoose from "mongoose";

const userRef = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: userRef,
    receiver: userRef,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, index: { expires: 0 } },
    deletedBy: { ...userRef, required: false }
})

export default mongoose.model('Message', messageSchema)