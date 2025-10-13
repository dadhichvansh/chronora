import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

// Initialize express app
const app = express();

// Middleware
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Chronora server running 🚀' });
});

app.use('/api/auth', authRoutes); // Auth routes

export default app;
