import upload from '../utils/multer.js';
import ApiError from '../utils/ApiError.js';
import multer from 'multer';


const uploadSingleImage = (req, res, next) => {
    upload.single('profilePic')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return next(new ApiError(400, 'Multer Error', err.message));
            }
            return next(new ApiError(400, 'Image Upload Error', err.message));
        }
        next();
    });
}

const uploadMultipleImages = (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return next(new ApiError(400, 'Multer Error', err.message));
            }
            return next(new ApiError(400, 'Image Upload Error', err.message));
        }
        next();
    });
}


export { uploadSingleImage, uploadMultipleImages };