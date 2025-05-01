import express from 'express';
// import {
//   markAttendance,
//   getAttendanceByStudent,
//   getAttendanceByDate,
//   getStudentAttendanceByDate
// } from '../controllers/Attendence.controllers.js';
import { markSingleAttendance, markBulkAttendance, getAttendanceByStudent, getAttendanceByDate, getStudentAttendanceByDate } from '../controllers/Attendence.controllers.js';

const router = express.Router();

// router.post('/', markAttendance); // Mark or update attendance
// router.get('/student/:studentId', getAttendanceByStudent); // All records for one student
// router.get('/date/:date', getAttendanceByDate); // All records on a specific date
// router.get('/student/:studentId/date/:date', getStudentAttendanceByDate); // Specific student/date
// router.post('/attendance/single', markSingleAttendance);

// POST route for bulk attendance
router.post('/bulk', markBulkAttendance);
router.post('/student', markSingleAttendance);

// GET routes for attendance data
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/date/:date', getAttendanceByDate);
router.get('/student/:studentId/date/:date', getStudentAttendanceByDate);


export default router;
