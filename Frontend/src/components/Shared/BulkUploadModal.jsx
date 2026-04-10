import React, { useState } from "react";
import { Upload, Download, X, AlertCircle, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import toast from "react-hot-toast";

const BulkUploadModal = ({ isOpen, onClose, onUploadSuccess, templateEndpoint, uploadEndpoint, title }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
            setResults(null);
        } else {
            toast.error("Please select a valid .xlsx file");
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get(templateEndpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error("Template download failed");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post(uploadEndpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResults(res.data.data || res.data.results);
            toast.success("Bulk processing completed");
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" >
                
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 text-sky-600">
                        <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100"> <Upload size={24} /> </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-sky-900"> Bulk <span className="text-sky-600 italic">Data Ingestion</span> </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-sky-600"> <X size={24} /> </button>
                </div>

                <div className="space-y-8">
                    {/* Template Section */}
                    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"> <FileSpreadsheet size={24} /> </div>
                            <div>
                                <h4 className="text-[11px] font-black text-indigo-900 uppercase">Institutional Template</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Download to ensure proper header mapping</p>
                            </div>
                        </div>
                        <button onClick={handleDownloadTemplate} className="px-5 py-3 bg-white text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2">
                            <Download size={14} /> Get Template
                        </button>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-4">
                        <div className={`relative h-40 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group ${file ? 'border-emerald-500 bg-emerald-50/10' : 'border-sky-100 bg-gray-50/50 hover:border-sky-300'}`}>
                            <input type="file" accept=".xlsx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {file ? (
                                <>
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"> <CheckCircle2 size={24} /> </div>
                                    <span className="text-[10px] font-black text-emerald-700 uppercase">{file.name}</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform"> <Upload size={24} /> </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Institutional Data File (.xlsx)</span>
                                </>
                            )}
                        </div>

                        {results && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-emerald-900 uppercase tracking-widest">Records Created</span>
                                    <span className="text-lg font-black text-emerald-600 tracking-tighter">{results.success}</span>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-amber-900 uppercase tracking-widest">Duplicates Skipped</span>
                                    <span className="text-lg font-black text-amber-600 tracking-tighter">{results.skipped || results.failed || 0}</span>
                                </div>
                                {results.errors?.length > 0 && (
                                    <div className="col-span-2 p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <p className="text-[9px] font-black text-red-900 uppercase mb-2">Error Logs:</p>
                                        <ul className="max-h-24 overflow-y-auto custom-scrollbar">
                                            {results.errors.map((err, i) => (
                                                <li key={i} className="text-[8px] font-bold text-red-600 uppercase flex items-center gap-2 mb-1">
                                                    <AlertCircle size={8} /> {typeof err === 'object' ? `${err.row}: ${err.error}` : err}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <button onClick={handleUpload} disabled={!file || isUploading} className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${!file || isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-sky-600 text-white shadow-xl shadow-sky-100 hover:bg-sky-700 active:scale-95'}`}>
                            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                            {isUploading ? 'Ingesting Data...' : `Execute ${title} Sync`}
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default BulkUploadModal;
