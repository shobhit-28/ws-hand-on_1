export const allowedMethods = (handlers) => {
    return (req, res, next) => {
        if (handlers[req.method]) {
            return handlers[req.method](req, res, next);
        }
        res.status(405).json({ success: false, message: 'Method Not Allowed' })
    }
}