import { errorResponse } from "../utils/apiResponse.util.js";

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return errorResponse(res, message, statusCode)
}