import authModel from '../models/auth.model.js';
import { generateToken, testEmail } from '../utils/auth.util.js';

export const loginUser = async ({ email, password }) => {
    if (!testEmail(email)) {
        throw new Error('Invalid Email')
    }
    const user = await authModel.findOne({ email })
    if (!user) {
        throw new Error('User not found')
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new Error('Incorrect Password')
    }
    const token = generateToken(user);
    return { token, user }
}

export const signUpUser = async ({ name, email, password, confirmPassword }) => {
    if (!testEmail(email)) {
        throw new Error('Invalid Email')
    }
    if (password !== confirmPassword) {
        throw new Error(`Passwords don't match`)
    }
    const user = new authModel({ name, email, password })
    user.save();
    const token = generateToken(user)
    return { token, user }
}