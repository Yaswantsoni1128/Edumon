import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaRegFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/assignments/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssignments(response.data);
      } catch (err) {
        setError('Failed to load assignments');
        toast.error('Error loading assignments!');
      }

      setLoading(false);
    };

    fetchAssignments();
  }, []);

  return (
    <div className="container mx-auto mt-12 px-6">
      <h1 className="text-4xl text-center font-bold text-indigo-600 mb-8">Your Assignments</h1>

      {loading && (
        <div className="flex justify-center mb-8">
          {/* Custom Loading Spinner using Tailwind */}
          <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center bg-red-500 text-white rounded p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-3">
            <div className="alert alert-info text-center bg-blue-100 text-blue-700 rounded p-4">
              No assignments found for your class.
            </div>
          </div>
        ) : (
          assignments.map((assignment) => (
            <motion.div
              key={assignment._id}
              className="card shadow-lg rounded-lg overflow-hidden bg-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaRegFileAlt className="text-indigo-500 text-3xl mr-2" />
                  <h5 className="text-xl font-semibold text-gray-800">{assignment.title}</h5>
                </div>
                <p className="text-gray-600 mb-4">
                  {assignment.description || 'No description available'}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Subject:</strong> {assignment.subject}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Assigned By:</strong> {assignment.createdBy?.name}
                </p>

                <a
                  href="#!"
                  className="btn btn-primary mt-4 block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Submit Assignment
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignment;
