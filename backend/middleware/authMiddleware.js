import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ status: 401, message: 'Access Denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded._id) {
            return res.status(400).json({ status: 400, message: 'Invalid token.' });
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(400).json({ status: 400, message: 'Invalid token.' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({ status: 400, message: 'Invalid token.' });
    }
};
export default authMiddleware;