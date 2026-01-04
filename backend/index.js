import express from 'express'
import router from './router/router.js';
import 'dotenv/config.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser'


const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', router)

    ; (async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log('Server is running on PORT : ' + PORT);

            })
        } catch (error) {
            console.log(error);
        }
    })();