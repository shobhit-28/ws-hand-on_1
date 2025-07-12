import mongoose from "mongoose";

const userRef = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, index: { expires: 0 } },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
})

const sanitizeTransform = (doc, responseObj) => {
    delete responseObj.expireAt;
    delete responseObj.__v;
    delete responseObj.deletedBy;

    return responseObj;
}

messageSchema.set('toObject', { transform: sanitizeTransform });
messageSchema.set('toJSON', { transform: sanitizeTransform });

messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema)