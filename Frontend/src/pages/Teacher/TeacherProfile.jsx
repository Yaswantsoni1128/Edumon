import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, User, BookOpen, ListChecks } from 'lucide-react';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) {
      console.error("No teacher ID provided in route params.");
      setErrorMsg("Invalid teacher ID.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/teachers/${id}`);
        const { success, data, message } = res.data;

        if (success) {
          setTeacher(data);
        } else {
          setErrorMsg(message || "Failed to fetch profile.");
        }
      } catch (err) {
        if (err.response) {
          const { message } = err.response.data;
          setErrorMsg(message || "Failed to fetch profile.");
        } else {
          setErrorMsg("Network or server error.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (errorMsg || !teacher) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        {errorMsg || "Teacher not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={18} /> Go Back
        </button>

        <div className="flex flex-col items-center">
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <User size={40} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold mb-1">{teacher.name}</h2>
          <p className="text-gray-500 mb-4">Teacher Profile</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail size={18} /> <span>{teacher.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen size={18} /> <span>Subject: {teacher.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone size={18} /> <span>Phone: {teacher.phone}</span>
          </div>

          {/* Assigned Classes */}
          {teacher.assignedClasses?.length > 0 && (
            <div className="flex items-start gap-2 text-gray-700">
              <ListChecks size={18} className="mt-1" />
              <div>
                <p className="font-semibold">Assigned Classes:</p>
                <ul className="list-disc list-inside text-sm">
                  {teacher.assignedClasses.map((cls, index) => (
                    <li key={index}>{cls}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
