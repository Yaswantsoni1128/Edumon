import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const FeeManagement = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    status: "Unpaid",
    paidDate: "",
    paymentMethod: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/fees`);
      setFees(res.data);
    } catch (err) {
      console.error("Error fetching fees:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStudents(), fetchFees()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const getFeeByStudentId = (studentId) => {
    return fees.find((fee) => fee.student?._id === studentId);
  };

  const openEditModal = (student) => {
    const fee = getFeeByStudentId(student._id);
    setSelectedStudent(student);
    setFormData({
      amount: fee?.amount || "",
      status: fee?.status || "Unpaid",
      paidDate: fee?.paidDate ? fee.paidDate.split("T")[0] : "",
      paymentMethod: fee?.paymentMethod || "",
    });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async () => {
    const fee = getFeeByStudentId(selectedStudent._id);
    try {
      if (fee) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/fees/update/${fee._id}`, {
          ...formData,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/fees/add`, {
          student: selectedStudent._id,
          ...formData,
        });
      }
      fetchFees();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving fee:", err);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student._id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalFeesCollected = students.reduce((sum, student) => {
    const fee = getFeeByStudentId(student._id);
    return sum + (fee?.amount || 0);
  }, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Fee Management</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search student by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
      </div>

      {/* Fee Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <CurrencyRupeeIcon className="w-12 h-12 text-sky-600" />
        <div className="ml-4">
          <h2 className="text-2xl font-bold">₹{totalFeesCollected.toLocaleString()}</h2>
          <p className="text-gray-500">Total Fees Collected</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        {loading ? (
          <p className="text-center p-4 text-gray-600">Loading data...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-600 text-white">
                <th className="px-6 py-3 text-left">Student ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Amount (₹)</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const fee = getFeeByStudentId(student._id);
                  return (
                    <tr key={student._id} className="border-b hover:bg-gray-100">
                      <td className="px-6 py-4">#{student._id?.slice(-4)}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.class || "N/A"}</td>
                      <td className="px-6 py-4">₹{fee?.amount || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            fee?.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {fee?.status || "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-sky-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Fee</h2>
            <div className="space-y-3">
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>
             
              <input
                type="date"
                name="paidDate"
                value={formData.paidDate}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="paymentMethod"
                placeholder="Payment Method"
                value={formData.paymentMethod}
                onChange={handleModalChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-sky-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
