import jwt from 'jsonwebtoken';
import authModel from '../models/auth.model.js';

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const testEmail = (emailStr) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr)

export const signup = async (req, res) => {
    console.log('first')
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (testEmail(email)) {
            if (password !== confirmPassword) {
                res.status(400).json({ error: `Passwords don't match` })
            } else {
                const user = new authModel({ name, email, password });
                await user.save();
                const token = generateToken(user)
                res.status(201).json({
                    token, user: {
                        name: user?.name,
                        email: user?.email,
                        _id: user?._id
                    }
                })
            }
        } else {
            res.status(400).json({ error: `Invalid Email` })
        }
    } catch (error) {
        console.error(error)
        let errorMsg = error.message
        if (error?.message.toLowerCase().includes('duplicate key error collection')) {
            errorMsg = `Email already exists`
        }
        res.status(400).json({ error: errorMsg })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (testEmail(email)) {
            const user = await authModel.findOne({ email });
            if (!user) {
                res.status(401).json({ error: `User not found` })
            } else if (!(await user.comparePassword(password))) {
                res.status(401).json({ error: `Incorrect Password` })
            }
            const token = generateToken(user)
            res.status(200).json({
                token, user: {
                    name: user?.name,
                    _id: user?._id
                }
            })
        } else {
            res.status(400).json({ error: `Invalid Email` })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message })
    }
}