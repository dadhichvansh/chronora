import express from 'express';
import cors from 'cors';
import requestIp from 'request-ip';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

// Initialize express app
const app = express();

// CORS middleware
app.use(cors());

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

app.use('/api/auth', authRoutes); // Auth routes

export default app;
