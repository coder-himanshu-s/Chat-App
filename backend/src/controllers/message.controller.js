import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let getChat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!getChat) {
        getChat = await Chat.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
    });

    if (newMessage) {
        getChat.messages.push(newMessage._id)
    }

    await getChat.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"))

});

export const getMessage = asyncHandler(async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate("messages")


    return res.status(200).json(new ApiResponse(200, chat, "Messages fetched successfully"))
})