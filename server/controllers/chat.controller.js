import { DeleteMessageDTO } from "../dto/chat/deleteMessage.dto.js"
import { GetMessageDto } from "../dto/chat/getMessages.dto.js"
import { SendMessageDto } from "../dto/chat/sendMessage.dto.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import * as chatService from "../services/chat.service.js"
import { successResponse } from "../utils/apiResponse.util.js"


export const sendMessage = asyncHandler(async (req, res) => {
    const dto = new SendMessageDto({
        senderId: req.user.id,
        receiverId: req.body.receiverId,
        content: req.body.content
    })

    // console.log(dto)

    const message = await chatService.createNewMessage(dto)

    const io = req.app.get('io')
    io.to(dto.receiverId).emit('receive-message', message)

    successResponse(res, `Message sent successfully`, message, 201)
})

export const getMessages = asyncHandler(async (req, res) => {
    const dto = new GetMessageDto({
        userId: req.user.id,
        withUserId: req.params.withUserId
    })
    const messages = await chatService.fetchMessages(dto);
    successResponse(res, `Messages recieved successfully`, messages)
})

export const deleteMessage = asyncHandler(async (req, res) => {
    const dto = new DeleteMessageDTO({
        userId: req.user.id,
        messageId: req.params.messageId
    })

    await chatService.deleteMessage(dto, false)
    successResponse(res, `Message deleted successfully`, null, 204)
})

export const deleteMessageForEveryone = asyncHandler(async (req, res) => {
    const dto = new DeleteMessageDTO({
        userId: req.user.id,
        messageId: req.params.messageId
    })

    const msg = await chatService.deleteMessage(dto, true)

    const io = req.app.get('io')
    io.to(msg.receiver.toString()).emit('delete-message', dto)

    successResponse(res, `Message deleted successfully`, null, 204)
})

export const chattableMates = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const mates = await chatService.getChattableMates(userId)
    successResponse(res, `Successfully fetched chat list`, mates)
})