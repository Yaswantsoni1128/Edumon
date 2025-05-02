import React, { useEffect, useState } from "react";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    studentClass: "",
    parentContact: "",
  });
  const [studentToUpdate, setStudentToUpdate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    const { name, email, rollNo, studentClass, parentContact } = formData;
    if (!name || !email || !rollNo || !studentClass || !parentContact) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/students`, {
        name,
        email,
        rollNo,
        class: studentClass,
        parentContact,
      });
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        rollNo: "",
        studentClass: "",
        parentContact: "",
      });
      setError("");
      fetchStudents();
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const handleUpdateStudent = async () => {
    const { name, email, rollNo, studentClass, parentContact } = formData;
    if (!name || !email || !rollNo || !studentClass || !parentContact) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/students/${studentToUpdate._id}`, {
        name,
        email,
        rollNo,
        class: studentClass,
        parentContact,
      });
      setShowUpdateModal(false);
      setFormData({
        name: "",
        email: "",
        rollNo: "",
        studentClass: "",
        parentContact: "",
      });
      setStudentToUpdate(null);
      setError("");
      fetchStudents();
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass ? student.class === selectedClass : true;
    return matchesName && matchesClass;
  });

  const uniqueClasses = [...new Set(students.map((s) => s.class).filter(Boolean))];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Student Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-sky-700 transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Filter by Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-2 border rounded shadow-sm"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sky-600 text-white">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Class</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Roll No</th>
              <th className="px-6 py-3 text-left">Parent Contact</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No students found in this class.</td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{student._id.slice(-5)}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.rollNo}</td>
                  <td className="px-6 py-4">{student.parentContact}</td>
                  <td className="px-6 py-4 flex space-x-3">
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => {
                        setStudentToUpdate(student);
                        setFormData({
                          name: student.name,
                          email: student.email,
                          rollNo: student.rollNo,
                          studentClass: student.class,
                          parentContact: student.parentContact,
                        });
                        setShowUpdateModal(true);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
            {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full mb-2 p-2 border rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll No" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="studentClass" value={formData.studentClass} onChange={handleChange} placeholder="Class" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="parentContact" value={formData.parentContact} onChange={handleChange} placeholder="Parent Contact" className="w-full mb-4 p-2 border rounded" />
            <div className="flex justify-end">
              <button onClick={() => { setShowModal(false); setError(""); }} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleAddStudent} className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Student Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Student</h2>
            {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full mb-2 p-2 border rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll No" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="studentClass" value={formData.studentClass} onChange={handleChange} placeholder="Class" className="w-full mb-2 p-2 border rounded" />
            <input type="text" name="parentContact" value={formData.parentContact} onChange={handleChange} placeholder="Parent Contact" className="w-full mb-4 p-2 border rounded" />
            <div className="flex justify-end">
              <button onClick={() => { setShowUpdateModal(false); setError(""); }} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleUpdateStudent} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;