import express from 'express'
import router from './router/router.js';
import 'dotenv/config.js'
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { server, app } from './utils/socket.js';
import path from 'path';

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

app.use('/api', router)

    ; (async () => {
        try {
            await connectDB();
            server.listen(PORT, () => {
                console.log('Server is running on PORT : ' + PORT);

            })
        } catch (error) {
            console.log(error);
        }
    })();