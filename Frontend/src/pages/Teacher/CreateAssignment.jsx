import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const CreateAssignment = () => {
  

  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));  // Parse the user object from localStorage
  
  // Check if the user exists and has the _id property
  const id = user ? user._id : null;
  console.log("id",id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
  });
  // Fetch teacher profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        // Assuming the response data contains subject and assignedClasses
        const { subject, assignedClasses } = response.data.data;
        setAssignedClasses(assignedClasses);
        setFormData((prev) => ({ ...prev, subject }));  // Autofill subject
      } catch (error) {
        console.error('Failed to fetch teacher profile:', error);
        setStatus({
          loading: false,
          message: 'Failed to load profile data.',
          error: true,
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/assignments`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setStatus({ loading: false, message: 'Assignment created successfully!', error: false });
      setFormData({
        title: '',
        description: '',
        subject: formData.subject,
        class: '',
        dueDate: '',
      });
    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || 'Error creating assignment',
        error: true,
      });
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-purple-100 shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">📘 Create New Assignment</h2>

      {status.message && (
        <div
          className={`flex items-center gap-2 p-3 mb-5 rounded-md ${status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {status.error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Assignment Title *"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="subject"
          value={formData.subject}
          readOnly
          className="p-3 rounded-xl border border-gray-300 bg-gray-100 cursor-not-allowed"
        />

        {loadingProfile ? (
          <div className="col-span-1 md:col-span-2 text-blue-600">Loading profile...</div>
        ) : (
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class *</option>
            {assignedClasses.length > 0 ? (
              assignedClasses.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))
            ) : (
              <option disabled>No assigned classes available</option>
            )}
          </select>
        )}

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="col-span-1 md:col-span-2 p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <motion.button
          type="submit"
          disabled={status.loading}
          whileTap={{ scale: 0.95 }}
          className="col-span-1 md:col-span-2 mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 flex justify-center items-center gap-2"
        >
          {status.loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Assignment'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateAssignment;
