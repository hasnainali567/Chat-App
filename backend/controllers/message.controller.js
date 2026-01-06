import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { uploadToCloudinary } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import { getReciverSocketId, io } from "../utils/socket.js";

const getUserForSidebar = asyncHandler(async (req, res) => {
    const user = req.user;
    const filterdUsers = await User.find({ _id: { $ne: user._id } }).select('-password -__v');
    res.status(200).json(new ApiResponse(200, 'Users fetched successfully', filterdUsers));
});

const getMessages = asyncHandler(async (req, res, next) => {
    const { id: userToChat } = req.params;
    if (!isValidObjectId(userToChat)) {
        return next(new ApiError(400, 'Bad Request', 'Invalid user id'));
    }
    const userId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: userId, receiverId: userToChat },
            { senderId: userToChat, receiverId: userId }
        ]
    }).sort({ createdAt: 1 });


    res.status(200).json(new ApiResponse(200, 'Messages fetched successfully', messages));

});

const sendMessage = asyncHandler(async (req, res, next) => {
    const { id: receiverId } = req.params;
    const text = req.body?.text || '';
    const files = req.files || [];
    const senderId = req.user._id;

    if (!isValidObjectId(receiverId)) {
        return next(new ApiError(400, 'Bad Request', 'Invalid user id'));
    }

    if (!text && !files?.length) {
        return next(new ApiError(400, 'Bad Request', 'Message is empty'));
    }

    if (files?.length > 0) {
        const uploadPromises = files.map(file => uploadToCloudinary(file.path, 'chatApp/messages'));
        const uploadResults = await Promise.all(uploadPromises);
        files.forEach((file, index) => {
            file.path = uploadResults[index].secure_url;
        });
    }
    const message = await Message.create({ senderId, receiverId, text, images: files.map(file => file.path) });

    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
        
        io.to(receiverSocketId).emit('newMessage', message);
    }

    if (!message) {
        return next(new ApiError(500, 'Internal Server Error', 'Failed to send message'));
    }

    res.status(200).json(new ApiResponse(200, 'Message sent successfully', message));
});

export { getUserForSidebar, getMessages, sendMessage };