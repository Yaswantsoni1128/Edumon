import React, { useEffect, useState, useCallback, useRef } from "react";
import { Plus, UserPlus, FileEdit, Trash2, GraduationCap, X, Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import * as XLSX from "xlsx";

const StudentManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    fatherName: "",
    studentClass: "",
    parentContact: "",
  });
  const [currentId, setCurrentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/students`, {
        params: {
          page,
          limit: 8,
          search: searchTerm,
          class: selectedClass
        }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, selectedClass]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchStudents]);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, class: formData.studentClass };
      if (isUpdating) {
        await api.put(`/api/students/${currentId}`, payload);
        toast.success("Student updated successfully");
      } else {
        await api.post(`/api/students`, payload);
        toast.success("Student registered. Check email for details.");
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/students/${deleteId}`);
      toast.success("Record deleted");
      setIsConfirmOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleBulkUpload = async () => {
      if (!bulkFile) return toast.error("Please select a file first");
      
      const formDataUpload = new FormData();
      formDataUpload.append("file", bulkFile);

      setIsBulkLoading(true);
      try {
          const res = await api.post("/api/students/bulk", formDataUpload, {
              headers: { "Content-Type": "multipart/form-data" }
          });
          toast.success(res.data.message);
          setShowBulkModal(false);
          setBulkFile(null);
          fetchStudents();
      } catch (err) {
          toast.error(err.response?.data?.message || "Bulk upload failed");
      } finally {
          setIsBulkLoading(false);
      }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Name: "John Doe",
        Email: "john@example.com",
        RollNo: "101",
        Class: "10",
        ParentContact: "9876543210",
        FatherName: "Richard Doe"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    
    // Write and download
    XLSX.writeFile(workbook, "Student_Bulk_Template.xlsx");
    toast.success("Excel template generated successfully");
  };

  const openUpdateModal = (student) => {
    setCurrentId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      fatherName: student.fatherName || "",
      studentClass: student.class,
      parentContact: student.parentContact,
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", rollNo: "", fatherName: "", studentClass: "", parentContact: "" });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const columns = [
    { header: "Roll & Name", accessor: "name", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[9px] uppercase">
          {row.rollNo}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-0.5">{row.name}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">S/O {row.fatherName || 'N/A'}</span>
        </div>
      </div>
    )},
    { header: "Academic", accessor: "class", render: (row) => (
      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">
        Grade {row.class}
      </span>
    )},
    { header: "Contact Info", accessor: "parentContact", render: (row) => (
        <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-600">{row.parentContact}</span>
            <span className="text-[9px] font-medium text-gray-400">{row.email}</span>
        </div>
    )},
    { header: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openUpdateModal(row)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-all">
          <FileEdit size={18} />
        </button>
        <button onClick={() => { setDeleteId(row._id); setIsConfirmOpen(true); }} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Student <span className="text-sky-600 italic">Enrollment</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Current Session Records: <span className="text-sky-600">{pagination?.total || 0}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button
                onClick={() => setShowBulkModal(true)}
                className="flex-1 lg:flex-none px-6 py-4 bg-white border border-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-50 hover:bg-sky-50 transition-all flex items-center justify-center gap-3"
            >
                <Upload size={18} />
                <span>Bulk Import</span>
            </button>
            <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="flex-1 lg:flex-none px-6 py-4 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                <UserPlus size={18} />
                <span>New Student</span>
            </button>
        </div>
      </div>

      <SearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        placeholder="Search by Name, Email, or Roll Number..."
        filters={[
          { 
            label: "All Grades", 
            value: selectedClass, 
            onChange: (val) => { setSelectedClass(val); setPage(1); },
            options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => ({ value: c, text: `Grade ${c}` }))
          }
        ]}
      />

      <GlassTable columns={columns} data={data} isLoading={isLoading} />

      <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />

      {/* Progressive Deletion Alert */}
      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Record?"
        message="This will permanently remove the student and their associated login credentials. This action cannot be undone."
      />

      {/* Bulk Upload Modal */}
      <AnimatePresence>
          {showBulkModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBulkModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                      <div className="flex justify-between items-center mb-10">
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                  <FileSpreadsheet size={24} />
                              </div>
                              <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">Bulk <span className="text-indigo-600">Import</span></h2>
                          </div>
                          <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-sky-600"><X size={24} /></button>
                      </div>

                      <div 
                        onClick={() => fileInputRef.current.click()}
                        className="border-2 border-dashed border-sky-100 bg-sky-50/30 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50 hover:border-sky-300 transition-all mb-8"
                      >
                          <input type="file" ref={fileInputRef} onChange={(e) => setBulkFile(e.target.files[0])} className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                          <Upload size={40} className="text-sky-400 mb-4" />
                          <p className="text-sm font-black text-sky-900 uppercase tracking-widest">{bulkFile ? bulkFile.name : "Select Spreadsheet"}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">CSV or Excel files only</p>
                      </div>

                      <div className="flex flex-col gap-4">
                          <button 
                            disabled={!bulkFile || isBulkLoading}
                            onClick={handleBulkUpload}
                            className="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                          >
                              {isBulkLoading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                              <span>{isBulkLoading ? "Processing Records..." : "Process Bulk Upload"}</span>
                          </button>
                          <button 
                            onClick={downloadTemplate}
                            className="w-full py-5 bg-white border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                          >
                              <Download size={18} />
                              <span>Download Excel Template</span>
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-white shadow-2xl overflow-hidden" >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4 text-sky-600">
                    <div className="p-3 bg-sky-50 rounded-2xl">
                      <GraduationCap size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                      {isUpdating ? "Update" : "Register"} <span className="text-sky-600">Student</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-sky-600 transition-colors"> <X size={24} /> </button>
                </div>

                <form onSubmit={handleAction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="STUDENT FULL NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300" />
                    <input type="email" placeholder="OFFICIAL EMAIL" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300" />
                    <input type="text" placeholder="FATHER'S NAME" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} required className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300" />
                    <input type="text" placeholder="ROLL NUMBER" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300" />
                    <select name="studentClass" value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all text-sky-900">
                      <option value="">GRADE</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                    <input type="text" placeholder="PARENT CONTACT" value={formData.parentContact} onChange={(e) => setFormData({...formData, parentContact: e.target.value})} required className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-gray-300" />
                  </div>

                  <button type="submit" className="w-full mt-6 py-5 bg-sky-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-[0.98]">
                    {isUpdating ? "Confirm Changes" : "Submit & Send Access Details"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;