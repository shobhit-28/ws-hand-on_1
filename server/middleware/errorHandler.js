import { errorResponse } from "../utils/apiResponse.util.js";

export const globalErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        console.warn('⚠️ Attempted to send response after headers were already sent');
        return;
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return errorResponse(res, message, statusCode)
}