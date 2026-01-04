import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import 'dotenv/config.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (filePath, folder) => {
    try {
        const res = await cloudinary.uploader.upload(filePath, { folder });
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file from server:', err);
            }
        });
        return res;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
}

export { uploadToCloudinary };