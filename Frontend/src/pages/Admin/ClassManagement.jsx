import React, { useEffect, useState, useCallback } from "react";
import { Plus, Building2, FileEdit, Trash2, Users, X, Home, GraduationCap, Layout, BookOpen, UserCheck, Upload } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import BulkUploadModal from "../../components/Shared/BulkUploadModal";

const ClassManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: "2024-25",
    className: "",
    section: "",
    stream: "General",
    medium: "English",
    board: "CBSE",
    roomNumber: "",
    shift: "Morning",
    classTeacherId: "",
    subjects: []
  });
  const [currentId, setCurrentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/classes`, {
        params: { page, limit: 8, search: searchTerm }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, schoolId: "SCH-001" };
      if (isUpdating) {
        await api.put(`/api/classes/${currentId}`, payload);
        toast.success("Class configuration synchronized");
      } else {
        await api.post(`/api/classes`, payload);
        toast.success("New Classroom unit established. Assign faculty in details.");
      }
      setShowModal(false);
      resetForm();
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({
      academicYear: "2024-25", className: "", section: "", stream: "General",
      medium: "English", board: "CBSE", roomNumber: "", shift: "Morning",
      classTeacherId: "", subjects: []
    });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const openUpdateModal = (item) => {
    setCurrentId(item._id);
    setFormData({
      ...item,
      subjects: item.subjects || []
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const columns = [
    { header: "Institutional Unit", accessor: "displayName", render: (row) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
          {row.className}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-1 uppercase tracking-tight">Grade {row.className} • {row.section}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{row.academicYear} SESSION</span>
        </div>
      </div>
    )},
    { header: "Academic Metadata", render: (row) => (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-sky-600 px-2 py-0.5 bg-sky-50 rounded-md w-fit uppercase tracking-tighter italic">{row.stream}</span>
            <span className="text-[9px] font-bold text-gray-400 capitalize">{row.subjects?.length || 0} Subjects Defined</span>
        </div>
    )},
    { header: "Current Roster", render: (row) => (
      <div className="flex items-center gap-2">
          <Users size={14} className={row.currentStrength > 0 ? "text-indigo-400" : "text-gray-300"} />
          <span className="text-[10px] font-black text-sky-950 italic">{row.currentStrength} Scholars Enrolled</span>
      </div>
    )},
    { header: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <Link to={`/admin/classes/${row._id}`} title="Manage Roster & Faculty" className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-all"> <Layout size={18} /> </Link>
        <button onClick={() => openUpdateModal(row)} title="Edit Configuration" className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"> <FileEdit size={18} /> </button>
        <button onClick={() => { setDeleteId(row._id); setIsConfirmOpen(true); }} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"> <Trash2 size={18} /> </button>
      </div>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Academic <span className="text-indigo-600 italic">Structures</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic font-black tracking-widest">Institutional Classroom Infrastructure</p>
        </div>

        <div className="flex items-center gap-3">
            <button onClick={() => setShowBulkModal(true)} className="px-8 py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-50 border border-indigo-100 flex items-center gap-3 hover:bg-indigo-50 transition-all font-black">
                <Upload size={18} />
                Bulk Import
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-[0.98] transition-all">
                <Plus size={18} />
                Establish Unit
            </button>
        </div>
      </div>

      <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Filter by Grade, Section, or Year..." />
      <GlassTable columns={columns} data={data} isLoading={isLoading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={async () => { await api.delete(`/api/classes/${deleteId}`); fetchClasses(); setIsConfirmOpen(false); }} title="Decommission Unit?" message="This will archive the classroom unit. Student records will remain independent but lose their primary placement." />

      <BulkUploadModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onUploadSuccess={fetchClasses} templateEndpoint="/api/classes/template" uploadEndpoint="/api/classes/bulk" title="Class" />

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4 text-indigo-600">
                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100"> <Home size={24} /> </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900"> {isUpdating ? 'Modify' : 'Initialize'} <span className="text-indigo-600 italic">Classroom Unit</span> </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-indigo-600 transition-colors"> <X size={24} /> </button>
              </div>

              <form onSubmit={handleAction} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 md:col-span-2">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2"> <GraduationCap size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Specifications</span> </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="GRADE (e.g. 10)" value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                            <input type="text" placeholder="SECTION (e.g. A)" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-sky-950">
                                {['2023-24', '2024-25', '2025-26'].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select value={formData.stream} onChange={(e) => setFormData({...formData, stream: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-sky-950">
                                {['General', 'Science', 'Commerce', 'Arts'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" placeholder="ROOM NO" value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                            <select value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none col-span-2">
                                <option value="Morning">Morning Shift</option> <option value="Afternoon">Afternoon Shift</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-relaxed">
                        Note: Faculty leads (Class Teacher) and Curriculum (Subjects) can be assigned from the detailed classroom view after the unit is established.
                    </p>
                </div>

                <button type="submit" className="w-full py-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                  {isUpdating ? 'Synchronize Unit Configuration' : 'Confirm Classroom Deployment'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassManagement;
