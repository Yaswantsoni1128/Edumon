import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    assignedClasses: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/teachers/all`);
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to fetch teachers!", { autoClose: 2000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      assignedClasses: formData.assignedClasses.split(",").map((cls) => cls.trim()),
    };
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/teachers/add`, data);
      setTeachers((prev) => [...prev, res.data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Teacher added successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Error adding teacher!", { autoClose: 2000 });
    }
  };

  const handleEditClick = (teacher) => {
    setCurrentTeacherId(teacher._id);
    setFormData({
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
      subject: teacher.subject,
      assignedClasses: teacher.assignedClasses.join(", "),
    });
    setShowUpdateModal(true);
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      assignedClasses: formData.assignedClasses.split(",").map((cls) => cls.trim()),
    };
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/teachers/update/${currentTeacherId}`,
        data
      );
      setTeachers((prev) =>
        prev.map((t) => (t._id === currentTeacherId ? res.data : t))
      );
      setShowUpdateModal(false);
      resetForm();
      toast.success("Teacher updated successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Error updating teacher!", { autoClose: 2000 });
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      toast.warn("Deletion cancelled", { autoClose: 2000 });
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/teachers/delete/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      toast.success("Teacher deleted successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Error deleting teacher!", { autoClose: 2000 });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      assignedClasses: "",
    });
    setCurrentTeacherId(null);
  };

  const renderModal = (isUpdate = false) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => {
            isUpdate ? setShowUpdateModal(false) : setShowAddModal(false);
            resetForm();
          }}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {isUpdate ? "Update" : "Add"} Teacher
        </h2>
        <form
          onSubmit={isUpdate ? handleUpdateTeacher : handleAddTeacher}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="assignedClasses"
            placeholder="Assigned Classes (comma-separated)"
            value={formData.assignedClasses}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
          >
            {isUpdate ? "Update" : "Add"} Teacher
          </button>
        </form>
      </div>
    </div>
  );

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.email.toLowerCase().includes(searchLower) ||
      teacher.subject.toLowerCase().includes(searchLower) ||
      teacher.assignedClasses.some((cls) =>
        cls.toLowerCase().includes(searchLower)
      );

    const matchesClass =
      classFilter === "" || teacher.assignedClasses.includes(classFilter);

    return matchesSearch && matchesClass;
  });

  const uniqueClasses = Array.from(
    new Set(teachers.flatMap((t) => t.assignedClasses || []))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Teacher Management
        </h1>
        <button
          className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-sky-700 transition"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, subject, class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
        </div>
        <div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((cls, i) => (
              <option key={i} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sky-600 text-white">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Classes</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">#{teacher._id?.slice(-4)}</td>
                <td className="px-6 py-4">{teacher.name}</td>
                <td className="px-6 py-4">{teacher.subject}</td>
                <td className="px-6 py-4">
                  {teacher.assignedClasses?.join(", ")}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-4">
                  <button onClick={() => handleEditClick(teacher)} title="Edit">
                    <PencilSquareIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher._id)}
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && renderModal(false)}
      {showUpdateModal && renderModal(true)}
    </div>
  );
};

export default TeacherManagement;
