import React, { useEffect, useState, useCallback } from "react";
import { CreditCard, History, FileEdit, IndianRupee, Search, Filter, X, Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassTable from "../../components/Shared/GlassTable";
import Pagination from "../../components/Shared/Pagination";
import SearchFilter from "../../components/Shared/SearchFilter";

const FeeManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    status: "Unpaid",
    paidDate: "",
    paymentMethod: "",
  });
  const [currentId, setCurrentId] = useState(null);

  const fetchFees = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/fees`, {
        params: {
          page,
          limit: 8,
          search: searchTerm
        }
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch fee records");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFees();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchFees]);

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await api.put(`/api/fees/update/${currentId}`, formData);
        toast.success("Record updated");
      } else {
        await api.post(`/api/fees/add`, { 
          student: formData.studentId, 
          amount: formData.amount,
          status: formData.status,
          paidDate: formData.paidDate,
          paymentMethod: formData.paymentMethod
        });
        toast.success("Fee record created");
      }
      setShowModal(false);
      resetForm();
      fetchFees();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const openUpdateModal = (record) => {
    setCurrentId(record._id);
    setFormData({
      studentId: record.student?._id,
      amount: record.amount,
      status: record.status,
      paidDate: record.paidDate ? record.paidDate.substring(0, 10) : "",
      paymentMethod: record.paymentMethod || "",
    });
    setIsUpdating(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ studentId: "", amount: "", status: "Unpaid", paidDate: "", paymentMethod: "" });
    setIsUpdating(false);
    setCurrentId(null);
  };

  const columns = [
    { header: "Student", accessor: "student", render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-black text-sky-900 uppercase tracking-tight">{row.student?.name}</span>
        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">ID: {row.student?._id?.slice(-6)}</span>
      </div>
    )},
    { header: "Amount", accessor: "amount", render: (row) => (
      <div className="flex items-center gap-1 font-black text-sky-600">
        <IndianRupee size={12} />
        <span>{row.amount.toLocaleString()}</span>
      </div>
    )},
    { header: "Payment Status", accessor: "status", render: (row) => (
      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        row.status === "Paid" 
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
          : "bg-red-50 text-red-600 border border-red-100"
      }`}>
        {row.status}
      </span>
    )},
    { header: "Method", accessor: "paymentMethod", render: (row) => (
      <span className="text-[10px] font-black uppercase text-gray-500">{row.paymentMethod || "N/A"}</span>
    )},
    { header: "Actions", render: (row) => (
      <button onClick={() => openUpdateModal(row)} className="p-2 hover:bg-sky-50 text-sky-600 rounded-xl transition-all">
        <FileEdit size={18} />
      </button>
    )},
  ];

  return (
    <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-sky-900 tracking-tighter uppercase mb-2">
            Finance <span className="text-emerald-600 italic">Management</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Total Records: <span className="text-emerald-600">{pagination?.total || 0}</span>
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="group relative px-6 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-[0.98]"
        >
          <CreditCard size={18} />
          <span>Record New Payment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-xl shadow-sky-100/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">Collected</span>
          </div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</h3>
          <p className="text-3xl font-black text-sky-900">₹450,000</p>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-xl shadow-sky-100/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <History size={24} />
            </div>
            <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Overdue Amount</h3>
          <p className="text-3xl font-black text-sky-900">₹82,400</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-xl shadow-sky-100/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-black text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full">Efficiency</span>
          </div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Collection Rate</h3>
          <p className="text-3xl font-black text-sky-900">92.4%</p>
        </div>
      </div>

      <SearchFilter 
        searchTerm={searchTerm} 
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        placeholder="Search payments by student name or record ID..."
      />

      <GlassTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        emptyMessage="No financial records found."
      />

      <Pagination 
        pagination={pagination} 
        onPageChange={(p) => setPage(p)} 
      />

      {/* Premium Modal */}
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
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                      <IndianRupee size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900">
                      {isUpdating ? "Modify" : "Record"} <span className="text-emerald-600">Payment</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-emerald-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAction} className="space-y-4">
                  {!isUpdating && (
                    <input type="text" placeholder="STUDENT OBJECT ID" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-gray-300" />
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="AMOUNT (INR)" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-gray-300" />
                    
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-sky-900">
                      <option value="Unpaid">UNPAID</option>
                      <option value="Paid">PAID</option>
                      <option value="Partial">PARTIAL</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute top-2 left-4 text-[8px] font-black text-gray-400 uppercase">Payment Date</div>
                      <input type="date" value={formData.paidDate} onChange={(e) => setFormData({...formData, paidDate: e.target.value})} required className="w-full px-6 pt-6 pb-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-sky-900" />
                    </div>
                    
                    <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} required className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-sky-900">
                      <option value="">METHOD</option>
                      <option value="Cash">CASH</option>
                      <option value="UPI">UPI / ONLINE</option>
                      <option value="Bank Transfer">BANK TRANSFER</option>
                      <option value="Cheque">CHEQUE</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full mt-6 py-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98]">
                    {isUpdating ? "Update Payment Record" : "Finalize Fee Entry"}
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

export default FeeManagement;
