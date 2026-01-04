import { Router } from "express";
import { login, logout, signup, update, checkAuth } from "../controllers/auth.controller.js";
import { loginValidation, signupValidation } from "../validation/validation.js";
import { uploadSingleImage } from '../middleware/upload.middleware.js'
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

router.get("/logout", logout);

router.put('/update-profile', authMiddleware, uploadSingleImage, update);

router.get('/check-auth', authMiddleware, checkAuth)

export default router;