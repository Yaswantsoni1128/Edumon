import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTeacherModal = ({ onClose, onTeacherAdded }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/classes`);
        setClassOptions(res.data);
      } catch (err) {
        console.error("Error fetching class options:", err);
      }
    };
    fetchClassOptions();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/teacher`, {
        name,
        subject,
        assignedClass,
      });
      onTeacherAdded();
      onClose();
    } catch (err) {
      console.error("Error adding teacher:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Teacher</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select
          className="w-full mb-3 p-2 border rounded"
          value={assignedClass}
          onChange={(e) => setAssignedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-sky-600 text-white rounded" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;
