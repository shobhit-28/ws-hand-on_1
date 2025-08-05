import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['follow', 'like', 'comment', 'new_message'],
        required: true
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Notification', notificationSchema)