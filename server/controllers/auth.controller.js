import { loginUser, signUpUser } from '../services/auth.service.js';
import { getCookieConfig } from '../utils/auth.util.js';

export const signup = async (req, res) => {
    console.log('first')
    try {
        const { token, user } = await signUpUser(req.body)
        res.status(201)
            .cookie('token', token, getCookieConfig(24 * 60 * 60 * 1000))
            .cookie('user', JSON.stringify({ name: user.name, email: user.email }), getCookieConfig())
            .json({ token, user: { name: user.name, email: user.email, _id: user._id } })
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
        const { token, user } = await loginUser(req.body)
        res.status(200)
            .cookie('token', token, getCookieConfig(24 * 60 * 60 * 1000))
            .cookie('user', JSON.stringify({ name: user.name, email: user.email }), getCookieConfig())
            .json({ token, user: { name: user.name, email: user.email, _id: user._id } })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message })
    }
}

export const backendCheck = async (req, res) => {
    res.status(200).json({ message: 'Hello from backend' })
}