import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

const Attendance = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/attendence/student/${id}`);
      console.log('✅ API Response:', res.data); // Debug log
      setRecords(res.data || []);
    } catch (err) {
      alert('❌ Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [id]);

  const filteredRecords = Array.isArray(records)
    ? records.filter(record => {
        return (
          (filter === 'All' || record.status === filter) &&
          (record.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
            record.student?.rollNo?.toLowerCase().includes(search.toLowerCase()))
        );
      })
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">📋 Your Attendance</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading attendance records...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border text-left">Date</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">Marked By</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border text-center">{idx + 1}</td>
                  <td className="py-2 px-4 border">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className={`py-2 px-4 border font-semibold ${rec.status === 'Present' ? 'text-green-600' : rec.status === 'Absent' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {rec.status}
                  </td>
                  <td className="py-2 px-4 border">{rec.markedBy?.name || 'N/A'}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
