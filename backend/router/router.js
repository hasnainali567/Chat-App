import { Router } from "express";
import authRouter from './auth.routes.js';
import messageRouter from './message.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/message', messageRouter);

router.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message;
    const errors = err.errors
    res.status(status).json({status, message, errors});
})


export default router;