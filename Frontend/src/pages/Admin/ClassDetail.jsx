import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, Trash2, GraduationCap, School, ShieldCheck, Mail, Hash, MapPin, X, Loader2, BookOpen, UserCheck, Plus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import toast from "react-hot-toast";
import GlassTable from "../../components/Shared/GlassTable";
import SearchFilter from "../../components/Shared/SearchFilter";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Faculty Data for dropdowns
  const [teachers, setTeachers] = useState([]);

  // Assignment Logic State
  const [studentsList, setStudentsList] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    classTeacherId: "",
    subjects: [{ subjectName: "", teacherId: "" }]
  });

  const fetchSupportData = async () => {
    try {
      const res = await api.get('/api/teachers');
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error("Support data fetch failed");
    }
  };

  const fetchClassDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/classes/${id}`);
      setClassData(res.data.data);
      // Pre-fill edit form
      setEditFormData({
        classTeacherId: res.data.data.classTeacherId?._id || "",
        subjects: res.data.data.subjects?.length > 0 ? res.data.data.subjects : [{ subjectName: "", teacherId: "" }]
      });
    } catch (err) {
      toast.error("Failed to load class profile");
      navigate("/admin/classes");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  const fetchAvailableStudents = async () => {
      try {
          const res = await api.get("/api/students", { params: { search: searchStudent, limit: 10 } });
          setStudentsList(res.data.data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    fetchClassDetails();
    fetchSupportData();
  }, [fetchClassDetails]);

  useEffect(() => {
    if (showAssignModal) {
        const timeoutId = setTimeout(fetchAvailableStudents, 300);
        return () => clearTimeout(timeoutId);
    }
  }, [searchStudent, showAssignModal]);

  const handleUpdateStructure = async (e) => {
    e.preventDefault();
    try {
        await api.put(`/api/classes/${id}`, editFormData);
        toast.success("Academic structure updated");
        setShowEditModal(false);
        fetchClassDetails();
    } catch (err) {
        toast.error("Sync failed");
    }
  };

  const assignStudent = async (studentId) => {
    setIsAssigning(true);
    try {
      await api.post("/api/classes/assign-student", { classId: id, studentId });
      toast.success("Student successfully enrolled");
      setShowAssignModal(false);
      fetchClassDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      await api.post("/api/classes/remove-student", { classId: id, studentId });
      toast.success("Student removed from roster");
      fetchClassDetails();
    } catch (err) {
      toast.error("Withdrawal failed");
    }
  };

  const addSubjectRow = () => {
    setEditFormData({ ...editFormData, subjects: [...editFormData.subjects, { subjectName: "", teacherId: "" }] });
  };

  const removeSubjectRow = (index) => {
    const fresh = editFormData.subjects.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, subjects: fresh });
  };

  const columns = [
    { header: "Academic ID", accessor: "admissionNumber", render: (row) => (
        <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-lg uppercase tracking-widest">{row.admissionNumber}</span>
    )},
    { header: "Student Identity", accessor: "fullName", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[9px] uppercase">
          {row.fullName.charAt(0)}
        </div>
        <div className="flex flex-col">
            <span className="font-black text-sky-900 leading-none mb-0.5">{row.fullName}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Roll No #{row.rollNumber || 'N/A'}</span>
        </div>
      </div>
    )},
    { header: "Withdrawal", render: (row) => (
      <button onClick={() => removeStudent(row._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
        <Trash2 size={16} />
      </button>
    )},
  ];

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-sky-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Instructional Profile...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen font-jakarta text-sky-950">
      <div className="mb-12">
        <button onClick={() => navigate("/admin/classes")} className="flex items-center gap-2 text-gray-400 hover:text-sky-600 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest">Back to Management</span>
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-sky-100/30 border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <School size={40} />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-sky-950 uppercase tracking-tighter">{classData.displayName}</h1>
                        <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">{classData.academicYear}</span>
                   </div>
                   <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase">
                            <Users size={14} className="text-indigo-400" />
                            <span>{classData.currentStrength} Scholars Enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-sky-400" />
                            <span>{classData.medium} Media</span>
                        </div>
                   </div>
                </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <button 
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 md:w-auto px-6 py-5 bg-white border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-50 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
                >
                    <Settings size={18} />
                    <span>Scale Structure</span>
                </button>
                <button 
                    onClick={() => setShowAssignModal(true)}
                    className="flex-1 md:w-auto px-8 py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <UserPlus size={18} />
                    <span>Enroll Scholars</span>
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-50">Assigned Faculty Lead</h3>
              {classData.classTeacherId ? (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black uppercase border border-indigo-100">
                        {classData.classTeacherId.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-sky-950 uppercase tracking-tight">{classData.classTeacherId.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 lowercase">{classData.classTeacherId.email}</p>
                    </div>
                </div>
              ) : (
                <div onClick={() => setShowEditModal(true)} className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-200 transition-all group">
                    <UserCheck size={28} className="text-gray-200 mb-3 group-hover:text-indigo-400 transition-colors" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">No Teacher Assigned</p>
                    <p className="text-[8px] font-bold text-gray-300 uppercase mt-1">Click to appoint lead</p>
                </div>
              )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-50">Curriculum Matrix</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {classData.subjects?.map((sub, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-sky-950 uppercase tracking-tight italic">{sub.subjectName}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{teachers.find(t => (t.userId?._id || t.userId) === sub.teacherId)?.fullName || 'Faculty TBA'}</span>
                        </div>
                    ))}
                    {(classData.subjects?.length === 0 || !classData.subjects) && (
                        <div onClick={() => setShowEditModal(true)} className="md:col-span-3 p-6 border-2 border-dashed border-gray-100 rounded-2xl text-center cursor-pointer hover:border-indigo-200">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Subjects Established</p>
                        </div>
                    )}
               </div>
          </div>
      </div>

      <div className="mb-20">
        <h2 className="text-xl font-black text-sky-950 uppercase tracking-tighter mb-8 ml-2 flex items-center gap-3">
            <Users size={24} className="text-indigo-600" />
            Classroom <span className="text-indigo-600 italic">Roster</span>
        </h2>
        <GlassTable columns={columns} data={classData.studentIds || []} />
      </div>

      {/* Edit Structure Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col max-h-[90vh]" >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4 text-indigo-600">
                        <Settings size={24} />
                        <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                            Refine <span className="text-indigo-600 italic">Academic Structure</span>
                        </h2>
                    </div>
                    <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-indigo-600"> <X size={24} /> </button>
                </div>

                <form onSubmit={handleUpdateStructure} className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2"> <UserCheck size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Faculty Leadership</span> </div>
                        <select value={editFormData.classTeacherId} onChange={(e) => setEditFormData({...editFormData, classTeacherId: e.target.value})} className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-sky-950 outline-none">
                            <option value="">APPOINT CLASS TEACHER</option>
                            {teachers.filter(t => t.isActive).map(t => <option key={t._id} value={t.userId?._id || t.userId}>{t.fullName} ({t.designation})</option>)}
                        </select>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2"> <BookOpen size={14} className="text-indigo-600" /> <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curriculum Matrix</span> </div>
                            <button type="button" onClick={addSubjectRow} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5 hover:scale-105 transition-all"> <Plus size={14} /> Add Subject </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {editFormData.subjects.map((sub, idx) => (
                                <div key={idx} className="group relative flex items-center gap-3 p-4 bg-gray-100 border border-gray-200 rounded-2xl transition-all hover:border-indigo-100">
                                    <input type="text" placeholder="SUBJECT NAME" value={sub.subjectName} onChange={(e) => {
                                        const news = [...editFormData.subjects];
                                        news[idx].subjectName = e.target.value;
                                        setEditFormData({...editFormData, subjects: news});
                                    }} className="flex-1 bg-transparent text-[10px] font-black uppercase text-sky-950 outline-none" required />
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <select value={sub.teacherId} onChange={(e) => {
                                        const news = [...editFormData.subjects];
                                        news[idx].teacherId = e.target.value;
                                        setEditFormData({...editFormData, subjects: news});
                                    }} className="flex-1 bg-transparent text-[9px] font-bold uppercase text-indigo-600 outline-none">
                                        <option value="">CHOOSE TEACHER</option>
                                        {teachers.map(t => <option key={t._id} value={t.userId?._id || t.userId}>{t.fullName}</option>)}
                                    </select>
                                    <button type="button" onClick={() => removeSubjectRow(idx)} className="opacity-0 group-hover:opacity-100 p-1 bg-red-50 text-red-500 rounded-lg transition-all"> <X size={12} /> </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3m] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                        Synchronize Academic Assignments
                    </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enroll Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(false)} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-2xl max-h-[80vh] flex flex-col" >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4 text-indigo-600">
                        <UserPlus size={24} />
                        <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                            Enroll <span className="text-indigo-600 italic">Students</span>
                        </h2>
                    </div>
                    <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-indigo-600 transition-colors"> <X size={24} /> </button>
                </div>

                <div className="mb-8">
                    <input type="text" placeholder="Search students..." value={searchStudent} onChange={(e) => setSearchStudent(e.target.value)} className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all text-sky-950" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {studentsList.map(student => (
                        <div key={student._id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-indigo-50/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm border border-gray-100"> {student.fullName.charAt(0)} </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-sky-900 text-xs uppercase leading-none mb-1">{student.fullName}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">#{student.admissionNumber}</span>
                                </div>
                             </div>
                             <button disabled={isAssigning || student.currentClassId} onClick={() => assignStudent(student._id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${student.currentClassId ? 'bg-gray-100 text-gray-400' : 'bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-xl shadow-indigo-100'}`}>
                                {student.currentClassId ? 'Assigned' : 'Enroll Now'}
                             </button>
                        </div>
                    ))}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassDetail;
