import React from "react";
import {
  FaUserPlus,
  FaClipboardList,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    navigate("/login");
  };

  return (
    <>
      {/* Top Bar with Logout Icon */}
      <div className="flex justify-between items-center px-6 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">
          EduMon Teacher Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 text-2xl transition"
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>

      <div className="px-6 sm:px-20 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 pt-10">
        <div className="bg-green-100 shadow-lg rounded-2xl p-6 text-center">
          <FaUserPlus className="text-green-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Attendance</h3>
          <p className="text-gray-600">Mark attendance</p>
          <Link to={"/teacher/attendence"}>
            <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
              Attendance
            </button>
          </Link>
        </div>

        <div className="bg-yellow-100 shadow-lg rounded-2xl p-6 text-center">
          <FaClipboardList className="text-yellow-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Assignment</h3>
          <p className="text-gray-600">Create Assignment</p>
          <Link to={"/teacher/assignment"}>
            <button className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 transition">
              Assignment
            </button>
          </Link>
        </div>

        <div className="bg-blue-100 shadow-lg rounded-2xl p-6 text-center">
          <FaEnvelopeOpenText className="text-blue-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Notices</h3>
          <p className="text-gray-600">Notices by admin.</p>
          <Link to={"/teacher/notices"}>
            <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Notices
            </button>
          </Link>
        </div>

        <div className="bg-purple-100 shadow-lg rounded-2xl p-6 text-center">
          <FaUserCircle className="text-purple-700 text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Profile</h3>
          <p className="text-gray-600">Your profile.</p>
          <Link to={"/teacher/profile"}>
            <button className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
              Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};


export default TeacherDashboard