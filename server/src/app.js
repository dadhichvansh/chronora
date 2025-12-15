import express from 'express';
import cors from 'cors';
import requestIp from 'request-ip';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import commentsRoutes from './routes/comment.routes.js';
import userRoutes from './routes/user.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

// Initialize express app
const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // your frontend URL
    credentials: true, // allow cookies and auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// IP address logging middleware
app.use(requestIp.mw());

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Chronora server running 🚀' });
});

app.use(authMiddleware); // Apply auth middleware to all routes below
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/posts', postRoutes); // Post routes
app.use('/api/comments', commentsRoutes); // Comment routes
app.use('/api/users', userRoutes); // User routes

export default app;
