import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authTokenHeader = req.headers.authtoken || req.cookies.token;
    if (!authTokenHeader) {
        
        res.status(401).json({ error: `Authorization token not found` });
    }
    const token = authTokenHeader.includes(' ') ? authTokenHeader.split(' ')[1] : authTokenHeader
    if (!token) {
        return res.status(401).json({ error: `Token not found` })
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            res.status(401).json({ error: `Unauthorised` })
        }
        req.user = user
        next()
    })
}