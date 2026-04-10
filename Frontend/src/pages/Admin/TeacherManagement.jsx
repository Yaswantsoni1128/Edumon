import React, { useEffect, useState, useCallback } from "react";
import { Plus, UserPlus, FileEdit, Trash2, Briefcase, X, Mail, Phone, Book, Hash, GraduationCap, DollarSign, Landmark, MapPin, Search, UserCircle, Settings2, Upload } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import BulkUploadModal from "../../components/Shared/BulkUploadModal";

const TeacherManagement = () => {
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
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    address: {
      street: "",
      village: "",
      city: "",
      pincode: "",
      district: "",
      state: ""
    },
    teacherType: "Primary",
    designation: "Teacher",
    experienceYears: 0,
    qualificationDetails: [{ degreeName: "", fieldOfStudy: "" }],
    salary: { fixedAmount: 0 },
    classIds: [],
    subjectIds: [],
    classTeacherOf: null
  });

  const [currentId, setCurrentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/teachers`, {
        params: { page, limit: 8, search: searchTerm }
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
    fetchTeachers();
    fetchSupportData();
  }, [fetchTeachers]);

  const fetchSupportData = async () => {
    try {
      const classRes = await api.get('/api/classes');
      setClasses(classRes.data.data || []);
    } catch (err) {
      console.error("Support Data Fetch Error");
    }
  };

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
        await api.put(`/api/teachers/${currentId}`, formData);
        toast.success("Faculty record updated");
      } else {
        await api.post(`/api/teachers`, formData);
        toast.success("New teacher onboarded successfully.");
      }
      setShowModal(false);
      resetForm();
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({ 
        fullName: "", email: "", phoneNumber: "", gender: "Male", 
        dateOfBirth: "", address: { street: "", village: "", city: "", pincode: "", district: "", state: "" }, 
        teacherType: "Primary", 
        designation: "Teacher", experienceYears: 0,
        qualificationDetails: [{ degreeName: "", fieldOfStudy: "" }],
        salary: { fixedAmount: 0 },
        classIds: [], subjectIds: [], classTeacherOf: null
    });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const openUpdateModal = (teacher) => {
    setCurrentId(teacher._id);
    setFormData({
      ...teacher,
      dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : "",
      qualificationDetails: teacher.qualificationDetails?.length > 0 ? teacher.qualificationDetails : [{ degreeName: "", fieldOfStudy: "" }],
      classIds: teacher.classIds?.map(c => typeof c === 'object' ? c._id : c) || [],
      classTeacherOf: teacher.classTeacherOf?._id || teacher.classTeacherOf,
      address: teacher.address || { street: "", village: "", city: "", pincode: "", district: "", state: "" }
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const columns = [
    { header: "Faculty Lead", accessor: "fullName", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-xs uppercase">
          {row.fullName.charAt(0)}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-1 uppercase tracking-tight">{row.fullName}</span>
            <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md w-fit tracking-tighter italic">{row.teacherType} Specialist</span>
        </div>
      </div>
    )},
    { header: "Professional Info", render: (row) => (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-400">
                <Mail size={12} className="text-sky-500" />
                <span className="text-[10px] font-bold text-sky-900">{row.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
                <Phone size={12} className="text-sky-500" />
                <span className="text-[10px] font-bold text-sky-900">{row.phoneNumber}</span>
            </div>
        </div>
    )},
    { header: "Residential", render: (row) => (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-600">{row.address?.village || row.address?.city || 'N/A'}</span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{row.address?.pincode} • {row.address?.district}</span>
        </div>
    )},
    { header: "Deployment", render: (row) => (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md w-fit tracking-tighter uppercase italic">{row.classIds?.length || 0} Classes Assigned</span>
            {row.classTeacherOf && <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tight">Class Teacher: {row.classTeacherOf?.displayName}</span>}
        </div>
    )},
    { header: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openUpdateModal(row)} title="Configure Assignments" className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"> <Settings2 size={18} /> </button>
        <button onClick={() => { setDeleteId(row._id); setIsConfirmOpen(true); }} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"> <Trash2 size={18} /> </button>
      </div>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta text-sky-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Faculty <span className="text-indigo-600 italic">Administration</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic font-black tracking-widest">Institutional Professional Roster Control</p>
        </div>

        <div className="flex items-center gap-3">
            <button onClick={() => setShowBulkModal(true)} className="px-8 py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-50 border border-indigo-100 flex items-center gap-3 hover:bg-indigo-50 transition-all">
                <Upload size={18} />
                Bulk Scale
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95 transition-all">
                <UserPlus size={18} />
                Onboard Faculty
            </button>
        </div>
      </div>

      <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Filter by Name, Specialization, or ID..." />
      <GlassTable columns={columns} data={data} isLoading={isLoading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={async () => { await api.delete(`/api/teachers/${deleteId}`); fetchTeachers(); setIsConfirmOpen(false); }} title="Remove Professional Record?" message="Archived records will be moved to the institutional repository." />

      <BulkUploadModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onUploadSuccess={fetchTeachers} templateEndpoint="/api/teachers/template" uploadEndpoint="/api/teachers/bulk" title="Teacher" />

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4 text-indigo-600">
                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100"> <Briefcase size={24} /> </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900"> {isUpdating ? 'Modify' : 'Enroll'} <span className="text-indigo-600 italic">Faculty Profile</span> </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-indigo-600"> <X size={24} /> </button>
              </div>

              <form onSubmit={handleAction} className="space-y-10">
                {/* Identity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2"> <UserCircle size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Identity</span> </div>
                  <input type="text" placeholder="FULL NAME" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="col-span-2 px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950">
                    <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option>
                  </select>
                  <input type="email" placeholder="OFFICIAL EMAIL" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="PRIMARY CONTACT" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <div className="relative">
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                    <span className="absolute -top-2 left-6 bg-white px-2 text-[8px] font-black text-gray-400 uppercase">DOB</span>
                  </div>
                </div>

                {/* Professional Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2"> <GraduationCap size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Standing</span> </div>
                  <select value={formData.teacherType} onChange={(e) => setFormData({...formData, teacherType: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950">
                    {['Primary', 'Upper Primary', 'Secondary', 'Senior Secondary'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                  <input type="text" placeholder="DESIGNATION (e.g. HOD)" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
                    <input type="number" placeholder="FIXED SALARY" value={formData.salary.fixedAmount} onChange={(e) => setFormData({...formData, salary: { ...formData.salary, fixedAmount: e.target.value }})} className="w-full px-14 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase text-emerald-700 outline-none" />
                  </div>
                </div>

                {/* Residential Intelligence */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 pb-2 border-b border-gray-100 flex items-center gap-2"> <MapPin size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Residential Intelligence</span> </div>
                  <input type="text" placeholder="STREET / HOUSE NO" value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="md:col-span-2 px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                  <input type="text" placeholder="PINCODE (REQUIRED)" value={formData.address.pincode} onChange={handlePincodeChange} className="px-6 py-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-[10px] font-black uppercase text-indigo-900 outline-none" maxLength={6} required />
                  <input type="text" placeholder="VILLAGE" value={formData.address.village} onChange={(e) => setFormData({...formData, address: {...formData.address, village: e.target.value}})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="CITY" value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" required />
                  <input type="text" placeholder="DISTRICT (AUTO)" value={formData.address.district} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 outline-none" readOnly />
                  <input type="text" placeholder="STATE (AUTO)" value={formData.address.state} className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 outline-none" readOnly />
                </div>

                {/* Qualifications */}
                <div className="space-y-4">
                    <div className="pb-2 border-b border-gray-100 flex items-center gap-2"> <Landmark size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Qualification</span> </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="DEGREE NAME" value={formData.qualificationDetails[0].degreeName} onChange={(e) => setFormData({...formData, qualificationDetails: [{ ...formData.qualificationDetails[0], degreeName: e.target.value }]})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                        <input type="text" placeholder="FIELD OF STUDY" value={formData.qualificationDetails[0].fieldOfStudy} onChange={(e) => setFormData({...formData, qualificationDetails: [{ ...formData.qualificationDetails[0], fieldOfStudy: e.target.value }]})} className="px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none" />
                    </div>
                </div>

                {/* Academic Load (Visible only during update) */}
                {isUpdating && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
                        <div className="md:col-span-2 pb-2 border-b border-indigo-100 flex items-center gap-2"> <Book size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Academic Deployment Configuration</span> </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-indigo-600 uppercase ml-2">Class Assignments (Multiple)</span>
                            <div className="flex flex-wrap gap-2 p-4 bg-white border border-indigo-100 rounded-2xl min-h-[80px]">
                                {classes.map(c => (
                                    <button key={c._id} type="button" onClick={() => {
                                        const exists = formData.classIds.includes(c._id);
                                        setFormData({ ...formData, classIds: exists ? formData.classIds.filter(id => id !== c._id) : [...formData.classIds, c._id] });
                                    }} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${formData.classIds.includes(c._id) ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-400 border border-indigo-100'}`}>
                                        {c.displayName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-indigo-600 uppercase ml-2">Appoint as Class Teacher</span>
                            <select value={formData.classTeacherOf || ""} onChange={(e) => setFormData({...formData, classTeacherOf: e.target.value || null})} className="w-full px-6 py-4 bg-white border border-indigo-200 rounded-2xl text-[10px] font-black uppercase text-indigo-900">
                                <option value="">NONE / ASSISTANT</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.displayName}</option>)}
                            </select>
                        </div>
                    </motion.div>
                )}

                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-[9px] font-bold text-amber-700 leading-relaxed italic">
                        <span className="font-black">NOTE:</span> Initial onboarding focuses on professional identity and residential verification. Deployment specifics (Class Teacher roles and Subject Assignments) are managed via the <span className="font-black italic">Configuration Setting</span> after the professional record is established.
                    </p>
                </div>

                <button type="submit" className="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                  {isUpdating ? 'Synchronize Faculty Deployment' : 'Finalize Faculty Enrollment'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherManagement;
