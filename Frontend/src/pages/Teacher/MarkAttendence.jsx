import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

const MarkAttendance = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({});
  const [submittedStudents, setSubmittedStudents] = useState({});

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/teachers/${id}`);
        const teacher = res.data.data;
        setTeacherId(teacher._id);
        setTeacherName(teacher.name || '');
        setClasses(teacher.assignedClasses || []);
        setSubject(teacher.subject || '');
      } catch {
        alert('❌ Failed to fetch teacher info.');
      }
    };
    fetchTeacher();
  }, [id]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/students/class/${selectedClass}`);
        const studentList = res.data.data;
        setStudents(studentList);

        const initialAttendance = {};
        studentList.forEach(student => {
          initialAttendance[student._id] = 'Present';
        });
        setAttendance(initialAttendance);
      } catch {
        alert('❌ Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  useEffect(() => {
    setSubmittedStudents({});
    setStatusMessage({});
  }, [selectedClass, date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSingleSubmit = async (studentId) => {
    setStatusMessage({});
    try {
      const data = {
        student: studentId,
        date,
        status: attendance[studentId],
        markedBy: teacherId,
        subject, // include subject in request
      };
      const res = await axios.post(`${BASE_URL}/attendence/student`, data);
      if (res.status === 201) {
        setStatusMessage(prev => ({ ...prev, [studentId]: '✅ Marked!' }));
        setSubmittedStudents(prev => ({ ...prev, [studentId]: true }));
      } else {
        setStatusMessage(prev => ({ ...prev, [studentId]: '❌ Error' }));
      }
    } catch {
      setStatusMessage(prev => ({ ...prev, [studentId]: '❌ Error' }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">🎯 Mark Attendance</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/4">
          <label className="block font-medium mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="w-full md:w-1/4">
          <label className="block font-medium mb-1">Teacher</label>
          <input
            type="text"
            value={teacherName}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="w-full md:w-1/4">
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {loading && <div className="text-center text-gray-500">Loading students...</div>}

      {!loading && students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Roll No</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.rollNo}</td>
                  <td className="px-4 py-2">
                    <select
                      value={attendance[student._id] || 'Present'}
                      onChange={(e) => handleStatusChange(student._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                      disabled={submittedStudents[student._id]}
                    >
                      <option value="Present">✅ Present</option>
                      <option value="Absent">❌ Absent</option>
                      <option value="Leave">📄 Leave</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleSingleSubmit(student._id)}
                      disabled={submittedStudents[student._id]}
                      className={`px-3 py-1 rounded text-white ${
                        submittedStudents[student._id]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {submittedStudents[student._id] ? 'Marked' : 'Submit'}
                    </button>
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {statusMessage[student._id]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
