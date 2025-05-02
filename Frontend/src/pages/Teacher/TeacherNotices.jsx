import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherNotices = async () => {
      try {
        // Make sure to include the full backend URL if needed
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notices/teacher`);
        
        // Check if response data is an array
        if (Array.isArray(res.data)) {
          setNotices(res.data);
        } else {
          console.error('Received data is not an array:', res.data);
          setNotices([]); // Set notices to empty array if response is not valid
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher notices:', err);
        setLoading(false);
      }
    };

    fetchTeacherNotices();
  }, []);

  if (loading) return <div className="text-center py-10 text-blue-500">Loading teacher notices...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">📚 Teacher Notices</h2>
      <div className="grid gap-4">
        {notices.length === 0 ? (
          <p className="text-gray-600 text-center">No notices for teachers at the moment.</p>
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

export default TeacherNotices;
