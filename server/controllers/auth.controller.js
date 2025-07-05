import { asyncHandler } from '../middleware/asyncHandler.js';
import { loginUser, signUpUser } from '../services/auth.service.js';
import { successResponse } from '../utils/apiResponse.util.js';
import { getCookieConfig, setAuthCookies } from '../utils/auth.util.js';

export const signup = asyncHandler(async (req, res) => {
    const { token, user } = await signUpUser(req.body)
    setAuthCookies(res, token, user);
    return successResponse(res, 'User registered successfully', {
        token, user: {
            name: user.name,
            email: user.email,
            _id: user._id
        }
    })
})

export const login = asyncHandler(async (req, res) => {
    const { token, user } = await loginUser(req.body)
    setAuthCookies(res, token, user);
    return successResponse(res, 'User logged in successfully', {
        token, user: {
            name: user.name,
            email: user.email,
            _id: user._id
        }
    }
    )
})

export const backendCheck = async (req, res) => {
    res.status(200).json({ message: 'Hello from backend' })
}