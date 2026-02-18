const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('./config/db');

// ✅ CORS – allow only the frontend URL from env
const app = express();
const PORT = process.env.PORT || 5000;

// Serve uploads (Static files) - Place this first to avoid CORS/Auth issues for images
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigin = process.env.FRONTEND_URL;

      // allow requests with no origin (like Postman) or matching frontend URL
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const profileRoutes = require('./routes/profile');
const serviceRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});