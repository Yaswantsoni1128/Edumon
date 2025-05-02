import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentNotices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notices/student`);
        setNotices(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student notices:', err);
        setLoading(false);
      }
    };

    fetchStudentNotices();
  }, []);

  if (loading) return <div className="text-center py-10 text-blue-500">Loading student notices...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">📚 Student Notices</h2>
      <div className="grid gap-4">
        {notices.length === 0 ? (
          <p className="text-gray-600 text-center">No notices for students at the moment.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white border-l-4 border-indigo-500 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{notice.title}</h3>
                <span className="text-sm text-gray-400">
                  {new Date(notice.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 mt-2">{notice.message}</p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>🎯 Target: {notice.target}</span>
                <span>👤 Admin: {notice.postedBy?.name || 'Unknown'}</span>
                <span>📅 Visible Till: {new Date(notice.visibleTill).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotices;
