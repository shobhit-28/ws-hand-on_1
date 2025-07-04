import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

export const testEmail = (emailStr) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr)

export const getCookieConfig = (maxAge = null) => {
    const config = {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge
    }
    return maxAge !== null ? { ...config, maxAge } : config
}