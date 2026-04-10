import React, { useEffect, useState, useCallback } from "react";
import { Plus, BellRing, FileEdit, Trash2, Calendar, X, Users, Megaphone } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";

const NoticeManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "All",
    visibleTill: "",
  });
  const [currentId, setCurrentId] = useState(null);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/notices`, {
        params: {
          page,
          limit: 6,
          search: searchTerm
        }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch notices");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNotices();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchNotices]);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await api.put(`/api/notices/${currentId}`, formData);
        toast.success("Notice updated");
      } else {
        await api.post(`/api/notices`, formData);
        toast.success("Notice published");
      }
      setShowModal(false);
      resetForm();
      fetchNotices();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete this notice?")) return;
    try {
      await api.delete(`/api/notices/${id}`);
      toast.success("Notice removed");
      fetchNotices();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openUpdateModal = (notice) => {
    setCurrentId(notice._id);
    setFormData({
      title: notice.title,
      message: notice.message,
      target: notice.target,
      visibleTill: notice.visibleTill.substring(0, 10),
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ title: "", message: "", target: "All", visibleTill: "" });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const columns = [
    { header: "Notice Details", accessor: "title", render: (row) => (
      <div className="flex flex-col gap-1 max-w-sm">
        <span className="text-sm font-black text-sky-900 uppercase tracking-tight">{row.title}</span>
        <span className="text-[10px] text-gray-400 line-clamp-1 font-medium">{row.message}</span>
      </div>
    )},
    { header: "Visible To", accessor: "target", render: (row) => (
      <div className="flex items-center gap-2">
        <Users size={14} className="text-indigo-400" />
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase">
          {row.target}
        </span>
      </div>
    )},
    { header: "Expiry", accessor: "visibleTill", render: (row) => {
      const isExpired = new Date(row.visibleTill) < new Date();
      return (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black">{new Date(row.visibleTill).toLocaleDateString()}</span>
          <span className={`text-[8px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-emerald-500'}`}>
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>
      );
    }},
    { header: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openUpdateModal(row)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-all">
          <FileEdit size={18} />
        </button>
        <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Notice <span className="text-orange-600 italic">Board</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Active Notices: <span className="text-orange-600">{pagination?.total || 0}</span>
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="group relative px-6 py-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center gap-3 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>Post New Notice</span>
        </button>
      </div>

      <SearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        placeholder="Search notices by title or content..."
      />

      <GlassTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        emptyMessage="The notice board is currently empty."
      />

      <Pagination 
        pagination={pagination} 
        onPageChange={(p) => setPage(p)} 
      />

      {/* Premium Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-white shadow-2xl overflow-hidden" >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4 text-orange-600">
                    <div className="p-3 bg-orange-50 rounded-2xl">
                      <Megaphone size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                      {isUpdating ? "Update" : "Publish"} <span className="text-orange-600">Notice</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-orange-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAction} className="space-y-4">
                  <input type="text" placeholder="NOTICE TITLE" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-100 transition-all text-sky-950 placeholder:text-gray-400" />
                  
                  <textarea placeholder="DETAILED MESSAGE..." rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-100 transition-all text-sky-950 placeholder:text-gray-400 resize-none" />

                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-100 transition-all text-sky-950">
                      <option value="All">TARGET: ALL</option>
                      <option value="Teachers">TARGET: TEACHERS</option>
                      <option value="Students">TARGET: STUDENTS</option>
                    </select>
                    
                    <div className="relative">
                      <div className="absolute top-2 left-4 text-[8px] font-black text-gray-400 uppercase">Visible Till</div>
                      <input type="date" value={formData.visibleTill} onChange={(e) => setFormData({...formData, visibleTill: e.target.value})} required className="w-full px-6 pt-6 pb-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-100 transition-all text-sky-950" />
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-6 py-5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-[0.98]">
                    {isUpdating ? "Confirm Changes" : "Broadcast Official Notice"}
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

export default NoticeManagement;
