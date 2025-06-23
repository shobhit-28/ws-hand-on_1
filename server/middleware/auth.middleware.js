import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const auth = req.headers.authToken;
    if (!auth) {
        res.status(401).json({ error: `Authorization token not found` });
    }
    const token = auth.split(' ')[1]
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