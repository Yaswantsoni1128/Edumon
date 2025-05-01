import React from "react";
import {
  FaUserPlus,
  FaClipboardList,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    navigate("/login");
  };

  return (
    <>
      {/* Elegant Top Bar with Logout */}
      <div className="flex justify-between items-center px-6 py-4 sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-gray-800">
                EduMon Admin Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-2xl transition"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
      {/* 
      <h2 className="text-5xl font-bold mb-4 text-center pt-6">Dashboard Features</h2>
      <p className="text-center text-sm mb-6 px-8 sm:px-20 md:px-32 lg:px-44 text-gray-600">
        The EduMon dashboard empowers school administrators with a comprehensive suite
        of tools to manage students, teachers, fees, and notices efficiently. Designed
        for clarity and control, the system ensures seamless operation of academic
        workflows, enhances communication, and simplifies everyday administrative tasks.
        Explore the core features below to keep your school organized and up to date.
      </p> */}

      <div className="px-6 sm:px-20 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 pt-10">
        <div className="bg-green-100 shadow-lg rounded-2xl p-6 text-center">
          <FaUserPlus className="text-green-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Student Management</h3>
          <p className="text-gray-600">Add and manage student profiles easily.</p>
          <Link to={"/admin/student"}>
            <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
              Add Student
            </button>
          </Link>
        </div>

        <div className="bg-yellow-100 shadow-lg rounded-2xl p-6 text-center">
          <FaClipboardList className="text-yellow-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Teacher Management</h3>
          <p className="text-gray-600">Assign and monitor teachers across classes.</p>
          <Link to={"/admin/teacher"}>
            <button className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 transition">
              Add Teacher
            </button>
          </Link>
        </div>

        <div className="bg-blue-100 shadow-lg rounded-2xl p-6 text-center">
          <FaEnvelopeOpenText className="text-blue-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Fee Management</h3>
          <p className="text-gray-600">Track and manage student fee records.</p>
          <Link to={"/admin/fee"}>
            <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Fee Management
            </button>
          </Link>
        </div>

        <div className="bg-purple-100 shadow-lg rounded-2xl p-6 text-center">
          <FaUserCircle className="text-purple-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Notice Board</h3>
          <p className="text-gray-600">Create and broadcast important notices.</p>
          <Link to={"/admin/notice"}>
            <button className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
              Add Notice
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
