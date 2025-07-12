import { UploadProfilePicDto } from "../dto/user/uploadProfilePic.dto.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { uploadProfilePicService } from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.util.js";

export const uploadProfilePic = asyncHandler(async (req, res) => {
    const dto = new UploadProfilePicDto({
        userId: req.user.id,
        file: req.file
    })

    const response = await uploadProfilePicService(dto)

    successResponse(res, 'Profile Picture changed successfully', response)
})