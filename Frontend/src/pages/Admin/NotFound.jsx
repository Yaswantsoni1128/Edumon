import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      {/* 404 Illustration */}
      <img
        src="./error44.jpg"
        alt="Not Found"
        className="w-80 rounded-full mb-6"
      />

      {/* Error Message */}
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>

      {/* Go Back Button */}
      <Link to="/">
        <button className="mt-6 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition">
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
