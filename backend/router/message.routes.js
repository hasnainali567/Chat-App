import { Router } from "express";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadMultipleImages } from "../middleware/upload.middleware.js";

const router = Router();

router.get('/users', authMiddleware, getUserForSidebar);
router.get('/:id', authMiddleware, getMessages);
router.post('/send/:id', authMiddleware, uploadMultipleImages, sendMessage);

export default router;