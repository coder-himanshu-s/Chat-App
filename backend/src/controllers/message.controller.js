import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { message, file } = req.body;
  
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
      file,
      status: "sent", // Start with "sent" status
    });
  
    if (newMessage) {
      getChat.messages.push(newMessage._id);
    }
  
    await Promise.all([getChat.save(), newMessage.save()]);
  
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Mark as delivered immediately if receiver is online
      newMessage.status = "delivered";
      newMessage.deliveredAt = new Date();
      await newMessage.save();
      
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Notify sender that message was delivered
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageStatusUpdate", {
          messageId: newMessage._id,
          status: "delivered",
          deliveredAt: newMessage.deliveredAt
        });
      }
    } else {
      // If receiver is offline, notify sender that message is sent
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageStatusUpdate", {
          messageId: newMessage._id,
          status: "sent"
        });
      }
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newMessage, "Message sent successfully"));
  });
  

export const getMessage = asyncHandler(async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }
    });

    const messages = chat?.messages || [];

    return res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched successfully"))
});

export const markMessagesAsSeen = asyncHandler(async (req, res) => {
    const receiverId = req.user._id; // Current user viewing messages
    const senderId = req.params.id; // The other user in the chat

    // Mark all messages from sender to receiver as seen
    const updatedMessages = await Message.updateMany(
        {
            senderId,
            receiverId,
            status: { $ne: "seen" }
        },
        {
            $set: {
                status: "seen",
                seenAt: new Date()
            }
        }
    );

    // Get updated messages to send to sender
    const messages = await Message.find({
        senderId,
        receiverId,
        status: "seen"
    }).sort({ createdAt: -1 }).limit(10);

    // Notify sender that messages were seen
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId && messages.length > 0) {
        io.to(senderSocketId).emit("messagesSeen", {
            receiverId,
            messageIds: messages.map(m => m._id),
            seenAt: new Date()
        });
    }

    return res.status(200).json(new ApiResponse(200, { updatedCount: updatedMessages.modifiedCount }, "Messages marked as seen"));
});