import authModel from '../models/auth.model.js';
import { AppError } from '../utils/appError.js';
import { generateToken, testEmail } from '../utils/auth.util.js';

export const loginUser = async ({ email, password }) => {
    if (!testEmail(email)) {
        throw new AppError('Invalid Email', 400)
    }
    const user = await authModel.findOne({ email })
    if (!user) {
        throw new AppError('User not found', 404)
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new AppError('Incorrect Password', 400)
    }
    const token = generateToken(user);
    return { token, user }
}

export const signUpUser = async ({ name, email, password, confirmPassword }) => {
    if (!testEmail(email)) {
        throw new AppError('Invalid Email', 400)
    }
    if (password !== confirmPassword) {
        throw new AppError(`Passwords don't match`, 400)
    }
    const user = new authModel({ name, email, password })
    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(`Email already exists`, 400)
        }
    }
    const token = generateToken(user)
    return { token, user }
}