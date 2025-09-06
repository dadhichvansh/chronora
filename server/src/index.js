import express from 'express';
import cors from 'cors';
import { connectDB } from './db/db.js';

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Chronora server running 🚀');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening to server at http://localhost:${process.env.PORT}`);
});
