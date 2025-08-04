import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Enable All CORS Requests
app.use(cors());

app.use(express.json());

// server/server.js

// ... other imports

const app = express();
app.use(cors());
app.use(express.json());

// START: ADD THIS DEBUGGING CODE
app.get('/debug-connection', (req, res) => {
    const connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    res.json({
        state: connectionState,
        dbName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
    });
});
// END: ADD THIS DEBUGGING CODE

mongoose.connect(process.env.MONGO_URI)
// ... rest of the file

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));