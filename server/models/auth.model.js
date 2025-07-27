import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profile_pic: { type: String, required: false },
    profile_pic_id: { type: String, required: false, select: false },
    firstMessageSent: { type: Boolean, default: false }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

export default User


// Code to run for updating multiple fields to add a false for firstMessageSent
// User.updateMany(
//     { firstMessageSent: { $exists: false } },
//     { $set: { firstMessageSent: false } }
// )
//     .then(res => console.log(res))
//     .catch(res => console.error(res))