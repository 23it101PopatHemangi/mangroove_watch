// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import connectDB from './config/database.js';
// import errorHandler from './middleware/errorHandler.js';

// // Import routes
// import authRoutes from './routes/auth.js';
// import reportRoutes from './routes/reports.js';
// import alertRoutes from './routes/alerts.js';

// // Load environment variables
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Security middleware
// app.use(helmet());

// // CORS configuration
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://your-frontend-domain.com'] 
//     : ['http://localhost:3000', 'http://localhost:5173'],
//   credentials: true
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Compression middleware
// app.use(compression());

// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Eco Report Center API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/alerts', alertRoutes);

// // API documentation endpoint
// app.get('/api', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Eco Report Center API',
//     version: '1.0.0',
//     endpoints: {
//       auth: {
//         'POST /api/auth/register': 'Register a new user',
//         'POST /api/auth/login': 'Login user',
//         'GET /api/auth/me': 'Get current user profile',
//         'PUT /api/auth/profile': 'Update user profile',
//         'PUT /api/auth/password': 'Change password',
//         'POST /api/auth/forgot-password': 'Request password reset',
//         'GET /api/auth/leaderboard': 'Get user leaderboard',
//         'GET /api/auth/stats': 'Get user statistics'
//       },
//       reports: {
//         'GET /api/reports': 'Get all reports',
//         'POST /api/reports': 'Create new report',
//         'GET /api/reports/:id': 'Get single report',
//         'PUT /api/reports/:id': 'Update report',
//         'DELETE /api/reports/:id': 'Delete report',
//         'POST /api/reports/:id/upvote': 'Upvote report',
//         'DELETE /api/reports/:id/upvote': 'Remove upvote',
//         'POST /api/reports/:id/comments': 'Add comment to report',
//         'GET /api/reports/user/me': 'Get user\'s reports'
//       },
//       alerts: {
//         'GET /api/alerts': 'Get all alerts',
//         'POST /api/alerts': 'Create new alert (admin/moderator)',
//         'GET /api/alerts/:id': 'Get single alert',
//         'PUT /api/alerts/:id': 'Update alert (admin/moderator)',
//         'DELETE /api/alerts/:id': 'Delete alert (admin/moderator)',
//         'PUT /api/alerts/:id/approve': 'Approve alert (admin/moderator)',
//         'POST /api/alerts/:id/acknowledge': 'Acknowledge alert',
//         'GET /api/alerts/area/:lat/:lng': 'Get alerts in area'
//       }
//     }
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // Error handling middleware
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//   console.log(`📊 Health check: http://localhost:${PORT}/health`);
//   console.log(`📚 API docs: http://localhost:${PORT}/api`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log('Shutting down the server due to uncaught exception');
//   process.exit(1);
// });

// export default app;


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import alertRoutes from "./routes/alerts.js";
import smsRoutes from "./routes/sms.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ---------------- Security ----------------
app.use(helmet());

// ---------------- CORS ----------------
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL // ✅ set this in .env for production
        : ["http://localhost:3000", "http://localhost:5173"], // React dev servers
    credentials: true,
  })
);

// ---------------- Rate Limiting ----------------
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// ---------------- Middleware ----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// ---------------- Health Check ----------------
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Eco Report Center API is running ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ---------------- API Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sms", smsRoutes);

// ---------------- API Docs ----------------
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Eco Report Center API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/me": "Get current user profile",
      },
      reports: {
        "GET /api/reports": "Get all reports",
        "POST /api/reports": "Create new report",
      },
      alerts: {
        "GET /api/alerts": "Get all alerts",
        "POST /api/alerts": "Create new alert",
      },
    },
  });
});

// ---------------- 404 Handler ----------------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found 🚫`,
  });
});

// ---------------- Error Middleware ----------------
app.use(errorHandler);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});

// ---------------- Error Handlers ----------------
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
