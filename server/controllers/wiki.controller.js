import { asyncHandler } from "../middleware/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.util.js";

export const getWikiArticle = asyncHandler(async (req, res) => {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
    const data = await response.json()
    successResponse(res, 'Article fetched', data)
})