import React, { useEffect, useState, useCallback } from "react";
import { Plus, UserPlus, FileEdit, Trash2, GraduationCap, X, Mail, Phone, Calendar, Hash, MapPin, Building2, UserCircle, Briefcase, Upload } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import BulkUploadModal from "../../components/Shared/BulkUploadModal";

const StudentManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    admissionNumber: "",
    srNo: "",
    rollNumber: "",
    gender: "Male",
    dateOfBirth: "",
    currentClassId: "",
    section: "",
    parentName: "",
    parentContact: "",
    address: {
      street: "",
      village: "",
      city: "",
      pincode: "",
      district: "",
      state: ""
    }
  });
  const [currentId, setCurrentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/students`, {
        params: { page, limit: 8, search: searchTerm }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchTeachersAndClasses();
  }, []);

  const fetchTeachersAndClasses = async () => {
    try {
      const classRes = await api.get('/api/classes');
      setClasses(classRes.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchStudents]);

  // Pincode Lookup Logic
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData(prev => ({ ...prev, address: { ...prev.address, pincode } }));
    
    if (pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
            const detail = data[0].PostOffice[0];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    district: detail.District,
                    state: detail.State,
                    city: detail.Block === "NA" ? detail.Name : detail.Block
                }
            }));
            toast.success(`District: ${detail.District} detected`);
        }
      } catch (err) {
        console.error("Pincode API error");
      }
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await api.put(`/api/students/${currentId}`, formData);
        toast.success("Student profile updated");
      } else {
        await api.post(`/api/students`, formData);
        toast.success("Student enrolled. Credentials generated.");
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "", email: "", admissionNumber: "", srNo: "", rollNumber: "",
      gender: "Male", dateOfBirth: "", currentClassId: "", section: "",
      parentName: "", parentContact: "",
      address: { street: "", village: "", city: "", pincode: "", district: "", state: "" }
    });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const openUpdateModal = (student) => {
    setCurrentId(student._id);
    setFormData({
      ...student,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
      address: student.address || { street: "", village: "", city: "", pincode: "", district: "", state: "" }
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const columns = [
    { header: "Institutional Record", render: (row) => (
       <div className="flex flex-col">
           <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit mb-1 uppercase tracking-tighter italic">ADM: {row.admissionNumber}</span>
           <span className="text-[9px] font-bold text-gray-400">SR: {row.srNo || 'N/A'}</span>
       </div>
    )},
    { header: "Scholar", accessor: "fullName", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-black text-xs uppercase">
          {row.fullName.charAt(0)}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-0.5 uppercase tracking-tight">{row.fullName}</span>
            <span className="text-[9px] font-bold text-gray-400 capitalize">{row.gender} • {row.section || 'General'}</span>
        </div>
      </div>
    )},
    { header: "Guardian Info", render: (row) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-sky-900 uppercase italic">{row.parentName || 'Unknown'}</span>
            <div className="flex items-center gap-2 text-gray-400">
                <Phone size={10} className="text-sky-500" />
                <span className="text-[9px] font-bold">{row.parentContact || 'No Contact'}</span>
            </div>
        </div>
    )},
    { header: "Residential", render: (row) => (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-600">{row.address?.village || row.address?.city}</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{row.address?.pincode} • {row.address?.district}</span>
        </div>
    )},
    { header: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openUpdateModal(row)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-all">
          <FileEdit size={16} />
        </button>
        <button onClick={() => { setDeleteId(row._id); setIsConfirmOpen(true); }} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta text-sky-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Scholar <span className="text-sky-600 italic">Enrollment</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic tracking-widest">
            Institutional Board Authority
          </p>
        </div>

        <div className="flex items-center gap-3">
            <button onClick={() => setShowBulkModal(true)} className="px-6 py-4 bg-white text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-50 border border-sky-100 flex items-center gap-3 hover:bg-sky-50 transition-all">
                <Upload size={18} />
                Bulk Ingestion
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-4 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-100 flex items-center gap-3 active:scale-95 transition-all">
                <UserPlus size={18} />
                Onboard Scholar
            </button>
        </div>
      </div>

      <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Filter by Name, SR No, or Admission ID..." />
      <GlassTable columns={columns} data={data} isLoading={isLoading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={async () => { await api.delete(`/api/students/${deleteId}`); fetchStudents(); setIsConfirmOpen(false); }} title="Remove Scholar Record?" message="This will archive all academic and financial logs for this student." />

      <BulkUploadModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onUploadSuccess={fetchStudents} templateEndpoint="/api/students/template" uploadEndpoint="/api/students/bulk" title="Scholar" />

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4 text-sky-600">
                  <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100"> <GraduationCap size={24} /> </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900"> {isUpdating ? 'Modify' : 'Enroll'} <span className="text-sky-600 italic">Scholar Profile</span> </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-sky-600"> <X size={24} /> </button>
              </div>

              <form onSubmit={handleAction} className="space-y-10">
                {/* Academic Identity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <UserCircle size={14} className="text-sky-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Academic Identity</span>
                  </div>
                  <input type="text" placeholder="FULL NAME" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="col-span-2 px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="text" placeholder="ADMISSION NO" value={formData.admissionNumber} onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                  <input type="text" placeholder="SR NO (SCHOLAR REGISTER)" value={formData.srNo} onChange={(e) => setFormData({...formData, srNo: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                  <div className="relative">
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                    <span className="absolute -top-2 left-6 bg-white px-2 text-[8px] font-black text-gray-400 uppercase">DOB</span>
                  </div>
                </div>

                {/* Grade Placement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <Building2 size={14} className="text-sky-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Placement</span>
                  </div>
                  <select value={formData.currentClassId} onChange={(e) => setFormData({...formData, currentClassId: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required>
                    <option value="">SELECT CLASS</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.displayName}</option>)}
                  </select>
                  <input type="text" placeholder="SECTION / STREAM" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                </div>

                {/* Family Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <Briefcase size={14} className="text-sky-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guardian & Communication</span>
                  </div>
                  <input type="text" placeholder="PARENT / GUARDIAN NAME" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} className="col-span-1 px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="GUARDIAN CONTACT" value={formData.parentContact} onChange={(e) => setFormData({...formData, parentContact: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="email" placeholder="OFFICIAL SCHOLAR EMAIL" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                </div>

                {/* Residential Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <MapPin size={14} className="text-sky-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Residential Intelligence</span>
                  </div>
                  <input type="text" placeholder="STREET / HOUSE NO" value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="md:col-span-2 px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                  <input type="text" placeholder="PINCODE (REQUIRED)" value={formData.address.pincode} onChange={handlePincodeChange} className="px-6 py-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-[10px] font-black uppercase text-indigo-900 outline-none" maxLength={6} required />
                  <input type="text" placeholder="VILLAGE" value={formData.address.village} onChange={(e) => setFormData({...formData, address: {...formData.address, village: e.target.value}})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="CITY" value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="DISTRICT (AUTO)" value={formData.address.district} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 outline-none" readOnly />
                  <input type="text" placeholder="STATE (AUTO)" value={formData.address.state} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 outline-none" readOnly />
                </div>

                <button type="submit" className="w-full py-5 bg-sky-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-700 active:scale-[0.98] transition-all">
                  {isUpdating ? 'Execute Profile Update' : 'Finalize Scholar Admission'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;