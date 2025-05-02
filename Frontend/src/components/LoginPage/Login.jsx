import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
        email,
        password,
        role: userType, // 🔥 Send userType (Student/Teacher/Admin)
      });

      const { token, user } = response.data;

      // Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.log(err.response?.data); // Debugging
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-sky-200">
      <div className="mt-20 flex w-3/4 max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Left Section */}
        <div className="hidden w-1/2 bg-gradient-to-b from-sky-600 to-sky-800 p-10 text-white md:flex flex-col justify-center items-center gap-4">
          <div className="bg-white p-5 rounded-full">
            <img src="./smartSchoolTracker.jpg" alt="Edumon" className="w-32 h-32 rounded-3xl" />
          </div>
          <div className="text-2xl font-bold">WELCOME TO EDUMON</div>
          <p className="text-center text-sm">
            EduMon is a smart school tracking platform that helps parents monitor attendance, assignments, fees, academic progress, and communication seamlessly.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="mb-6 text-2xl font-semibold text-gray-700">Log In</h2>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Login As</label>
              <select
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="student">Login as Student</option>
                <option value="teacher">Login as Teacher</option>
                <option value="admin">Login as Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="yaswantsoni@gmail.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="********"
                required
              />
            </div>
            <div className="mb-4 flex justify-between text-sm">
              <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
              <Link to="/signup" className="text-blue-500 hover:underline">Not a Member yet?</Link>
            </div>
            <button type="submit" className="w-full rounded bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-2 text-white font-semibold hover:opacity-90 cursor-pointer">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
