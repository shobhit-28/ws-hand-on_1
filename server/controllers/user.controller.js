import { SearchUserDTO } from "../dto/user/searchUser.dto.js";
import { UploadProfilePicDto } from "../dto/user/uploadProfilePic.dto.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { findUsers, uploadProfilePicService } from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.util.js";
import { findUser, updateProfilePictureCookie } from "../utils/user.util.js";

export const uploadProfilePic = asyncHandler(async (req, res) => {
    const dto = new UploadProfilePicDto({
        userId: req.user.id,
        file: req.file
    })

    const response = await uploadProfilePicService(dto)

    console.log(req.cookies.user)

    updateProfilePictureCookie(res, JSON.parse(req.cookies.user), response)

    const io = req.app.get('io')
    io.to(dto.userId).emit('profile-pic-changed', true)

    successResponse(res, 'Profile Picture changed successfully', response)
})

export const updateProfilePic = asyncHandler(async (req, res) => {
    const user = await findUser(req.user.id)

    console.log(user)

    updateProfilePictureCookie(res, JSON.parse(req.cookies.user), user.profile_pic)

    successResponse(res, 'Profile Picture changed successfully', '', 204)
})

export const searchUsers = asyncHandler(async (req, res) => {
    const dto = new SearchUserDTO({
        user: req.user.id,
        userToBeSearched: req.params.user,
        page: Number(req.query.page),
        limit: Number(req.query.limit)
    })

    const users = await findUsers(dto);

    successResponse(res, 'Users fetched successfully', users, 200)
})