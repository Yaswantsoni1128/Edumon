
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

// Load environment variables
dotenv.config();

// db connection
connectDB();

// Initialize express app
const app = express();

// Middleware
// import cors from 'cors';
app.use(cors({ origin: `${process.env.FRONTEND_URL}`, credentials: true }));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/fees", feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendence', attendenceRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to EduMon API');
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);
