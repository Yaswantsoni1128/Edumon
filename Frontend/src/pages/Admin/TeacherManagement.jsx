import React, { useEffect, useState, useCallback } from "react";
import { Plus, UserPlus, FileEdit, Trash2, Briefcase, X, Mail, Phone, Book } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";

const TeacherManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    contactNumber: "",
  });
  const [currentId, setCurrentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/teachers`, {
        params: {
          page,
          limit: 8,
          search: searchTerm
        }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch teachers");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeachers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchTeachers]);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await api.put(`/api/teachers/${currentId}`, formData);
        toast.success("Faculty record updated");
      } else {
        await api.post(`/api/teachers`, formData);
        toast.success("New teacher onboarded");
      }
      setShowModal(false);
      resetForm();
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/teachers/${deleteId}`);
      toast.success("Teacher removed");
      setIsConfirmOpen(false);
      fetchTeachers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openUpdateModal = (teacher) => {
    setCurrentId(teacher._id);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject || "",
      contactNumber: teacher.contactNumber || "",
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "", contactNumber: "" });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const columns = [
    { header: "Faculty Member", accessor: "name", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs uppercase">
          {row.name.charAt(0)}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-0.5">{row.name}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic decoration-indigo-400 decoration-1">Senior Consultant</span>
        </div>
      </div>
    )},
    { header: "Specialization", accessor: "subject", render: (row) => (
      <div className="flex items-center gap-2">
          <Book size={14} className="text-amber-500" />
          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
            {row.subject || 'All Subjects'}
          </span>
      </div>
    )},
    { header: "Contact Details", accessor: "email", render: (row) => (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-400">
                <Mail size={12} />
                <span className="text-[10px] font-bold">{row.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
                <Phone size={12} />
                <span className="text-[10px] font-bold">{row.contactNumber || 'N/A'}</span>
            </div>
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
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta text-sky-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Faculty <span className="text-indigo-600 italic">Management</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Active Staff Count: <span className="text-indigo-600">{pagination?.total || 0}</span>
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="group relative px-6 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-[0.98]"
        >
          <UserPlus size={18} />
          <span>Onboard Teacher</span>
        </button>
      </div>

      <SearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        placeholder="Search faculty by name, email or subject..."
      />

      <GlassTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
      />

      <Pagination 
        pagination={pagination} 
        onPageChange={(p) => setPage(p)} 
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Faculty Member?"
        message="This will deactivate the teacher account and restrict their access to assigned classes. This action is irreversible."
      />

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-white shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4 text-indigo-600">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                      <Briefcase size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                      {isUpdating ? "Update" : "Onboard"} <span className="text-indigo-600">Faculty</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAction} className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="FULL NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-300" />
                    <input type="email" placeholder="FACULTY EMAIL" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-300" />
                    <input type="text" placeholder="PRIMARY SUBJECT" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-300" />
                    <input type="text" placeholder="CONTACT NUMBER" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-300" />
                  </div>

                  <button type="submit" className="w-full mt-6 py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                    {isUpdating ? "Execute Update" : "Deploy Faculty Credentials"}
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

export default TeacherManagement;
