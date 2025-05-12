import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/signup`, {
        name: fullName,
        email,
        password,
        role: "admin", // Admin-only signup
        contactNumber,
        schoolName,
      });

      console.log(res)

      setSuccess("Admin account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex py-5 items-center justify-center bg-gradient-to-r from-sky-100 to-sky-200">
      <div className="mt-20 flex w-3/4 max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Left Section */}
        <div className="hidden w-1/2 bg-gradient-to-b from-sky-600 to-sky-800 p-10 text-white md:flex flex-col justify-center items-center gap-4">
          <div className="bg-white p-5 rounded-full">
            <img src="./smartSchoolTracker.jpg" alt="Edumon" className="w-32 h-32 rounded-3xl" />
          </div>
          <div className="text-2xl font-bold">WELCOME TO EDUMON</div>
          <p className="text-center text-sm">
            EduMon is a smart school tracking platform that helps parents monitor attendance,
            assignments, fees, academic progress, and communication seamlessly.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="mb-6 text-2xl font-semibold text-gray-700">Admin Sign Up</h2>

          <p className="text-sm text-gray-500 mb-4">
            Only admins can sign up using this form. Students and Teachers will be created by the admin.
          </p>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex justify-between items-center gap-2">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Admin Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  required
                  className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Yaswant Soni"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                <input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  type="tel"
                  required
                  className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="9999999999"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">School Name</label>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                type="text"
                required
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Bal Bharati Sr Sec School"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="yaswantsoni@gmail.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="********"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded border px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled= "true"
              // disabled={loading}
              className="w-full  rounded bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-2 text-white font-semibold hover:opacity-90"
            >
              {loading ? "Creating Account..." : "SIGN UP"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
