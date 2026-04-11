
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/User.routes.js';
import connectDB from './config/db.js';
import studentRoutes from "./routes/Student.routes.js"
import teacherRoutes from "./routes/Teacher.routes.js";
import feeRoutes from "./routes/Fee.routes.js"; 
import noticeRoutes from "./routes/Notice.routes.js"
import assignmentRoutes from "./routes/Assignment.routes.js"
import attendenceRoutes from "./routes/Attendence.routes.js"
import classRoutes from "./routes/Class.routes.js";

// Load environment variables
dotenv.config();

// db connection
connectDB();

// Initialize express app
const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,   // deployed frontend (if any)
  "http://localhost:5173",    // local dev
  "http://10.0.2.2:5173",    // emulator dev
  "capacitor://localhost",   // Android APK (MOST IMPORTANT)
  "http://localhost"         // fallback
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/fees", feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendence', attendenceRoutes);
app.use('/api/classes', classRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to EduMon API');
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);
