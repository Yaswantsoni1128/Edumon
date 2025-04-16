
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/User.routes.js';
import connectDB from './config/db.js';
import studentRoutes from "./routes/Student.routes.js"
import teacherRoutes from "./routes/Teacher.routes.js";
import feeRoutes from "./routes/Fee.routes.js"; 
import noticeRoutes from "./routes/Notice.routes.js"

// Load environment variables
dotenv.config();

// db connection
connectDB();

// Initialize express app
const app = express();

// Middleware
// import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/fees", feeRoutes);
app.use('/api/notices', noticeRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to EduMon API');
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);
