import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import './configs/cloudinary.js'
import requireAjaxHeader from './middlewares/csrf.js'
import connectDB from './configs/db.js';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import AuthRouter from './routes/AuthRoutes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import type { Request as Req, Response as Res, NextFunction as Next } from 'express';

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string
    }
}

await connectDB()

const app = express();

// Extra allowed origins can be added with CLIENT_URLS="https://a.com,https://b.com"
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://thumbly-client-gilt.vercel.app',
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',').map((o) => o.trim()) : []),
]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(helmet())

app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    }, 
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: 'sessions'
    })
}))

app.use(express.json())

// Basic brute-force / abuse protection
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts, please try again later' } })
const generateLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { message: 'Generation limit reached, please try again later' } })

app.use('/api', requireAjaxHeader)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/thumbnail/generate', generateLimiter)
app.use('/api/auth', AuthRouter)
app.use('/api/thumbnail', ThumbnailRouter)
app.use('/api/user', UserRouter)

// Global error handler: any error that reaches here becomes a clean JSON response
app.use((err: any, _req: Req, res: Res, _next: Next) => {
    console.error(err)
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});