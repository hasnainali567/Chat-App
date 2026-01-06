import { validationResult } from "express-validator"
import User from "../models/user.model.js"
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/AsyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import cookieOptions from "../utils/cookieOptions.js"
import { uploadToCloudinary } from '../config/cloudinary.js';
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const signup = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ApiError(400, 'Validation Error', errorMessages));
    }
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(409, 'Conflict', 'User already exists'));
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password });
    if (!user) {
        return next(new ApiError(500, 'Server Error', 'Failed to create user'));
    }

    const token = await user.generateAuthToken();

    const { password: _, __v, ...userData } = user.toObject();

    res
        .status(201)
        .cookie('token', token, cookieOptions)
        .json(new ApiResponse(201, 'User created successfully', { user: userData }));

})
const login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ApiError(400, 'Validation Error', errorMessages));
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(404, 'Not Found', 'User not found'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ApiError(401, 'Unauthorized', 'Invalid credentials'));
    }

    const { password: _, __v, ...userData } = user.toObject();
    const token = user.generateAuthToken();
    res
        .status(200)
        .cookie('token', token, cookieOptions)
        .json(new ApiResponse(200, 'Logged in successfully', { token, user: userData }));
});


const logout = (req, res) => {
    res
        .status(200)
        .clearCookie('token', cookieOptions)
        .json(new ApiResponse(200, 'Logged out successfully'));
}

const update = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const file = req.file;
    const password = req.body?.password;
    const newPassword = req.body?.newPassword;

    if (password && newPassword) {
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting the uploaded file:', err);
                    }
                });
            }
            return next(new ApiError(401, 'Unauthorized', 'Current password is incorrect'));
        }
        if (newPassword.length < 6) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting the uploaded file:', err);
                    }
                });
            }
            return next(new ApiError(400, 'Bad Request', 'New password must be at least 6 characters long'));
        }
        user.password = newPassword;
    } else if (password || newPassword) {
        return next(new ApiError(400, 'Bad Request', 'Both current and new passwords are required to change password'));
    }

    try {
        if (file) {
            const oldProfilePic = user.profilePic;
            const imagePath = file.path;
            const uploadedImage = await uploadToCloudinary(imagePath, 'profile_pictures');
            user.profilePic = uploadedImage.secure_url;

            if (oldProfilePic) {
                try {
                    const publicId = oldProfilePic.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Cloudinary cleanup failed:", err);
                }
            }
        }

        await user.save();
        const { password: _, __v, ...userData } = user.toObject();
        return res.status(200).json(new ApiResponse(200, 'Profile updated successfully', { user: userData }));
    } finally {
        if (file) {
            fs.existsSync(file.path) &&
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error('Error deleting the uploaded file:', err);
                    }
                });
        }
    }

})

const checkAuth = asyncHandler(async (req, res, next) => {
    const user = req.user;

    const { password: _, __v, ...userData } = user.toObject();
    res.status(200).json(new ApiResponse(200, 'User is Authenticated', { user: userData }));
})

export {
    login,
    signup,
    logout,
    update,
    checkAuth
}