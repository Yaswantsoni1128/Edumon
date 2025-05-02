import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "All",
    visibleTill: "",
  });
  const [editNoticeId, setEditNoticeId] = useState(null);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notices`);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNotice = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notices`, formData);
      resetForm();
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateNotice = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/notices/${editNoticeId}`, formData);
      resetForm();
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (editNoticeId) {
      handleUpdateNotice();
    } else {
      handleAddNotice();
    }
  };

  const handleEditClick = (notice) => {
    setFormData({
      title: notice.title,
      message: notice.message,
      target: notice.target,
      visibleTill: notice.visibleTill.substring(0, 10),
    });
    setEditNoticeId(notice._id);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      target: "All",
      visibleTill: "",
    });
    setEditNoticeId(null);
    setShowAddModal(false);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.target.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Notice Management
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-sky-700 transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add Notice
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search notices..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Notices</h2>
        <div className="divide-y">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className="py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <p className="text-gray-500">{notice.message}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Target:</span> {notice.target} |{' '}
                  <span className="font-medium">Posted By:</span> {notice.postedBy} |{' '}
                  <span className="font-medium">Visible Till:</span>{' '}
                  {new Date(notice.visibleTill).toLocaleDateString()}
                </p>
                <span
                  className={`px-2 py-1 mt-1 inline-block rounded-full text-sm ${
                    new Date(notice.visibleTill) > new Date()
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {new Date(notice.visibleTill) > new Date()
                    ? "Active"
                    : "Expired"}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  className="text-blue-600 hover:underline flex items-center"
                  onClick={() => handleEditClick(notice)}
                >
                  <PencilIcon className="w-5 h-5 mr-1" /> Edit
                </button>
                <button
                  className="text-red-600 hover:underline flex items-center"
                  onClick={() => deleteNotice(notice._id)}
                >
                  <TrashIcon className="w-5 h-5 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editNoticeId ? "Edit Notice" : "Add New Notice"}
              </h2>
              <button onClick={resetForm}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded mb-3"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Message"
              className="w-full border p-2 rounded mb-3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded mb-3"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            >
              <option value="All">All</option>
              <option value="Teachers">Teachers</option>
              <option value="Students">Students</option>
            </select>
            
            <input
              type="date"
              className="w-full border p-2 rounded mb-3"
              value={formData.visibleTill}
              onChange={(e) => setFormData({ ...formData, visibleTill: e.target.value })}
            />

            <button
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 w-full"
              onClick={handleSubmit}
            >
              {editNoticeId ? "Update Notice" : "Submit Notice"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;
