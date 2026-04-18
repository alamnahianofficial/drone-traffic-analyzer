"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, AlertCircle, ShieldCheck } from "lucide-react";

export default function UploadZone({ onUpload, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const files = e.dataTransfer.files;
      if (files?.[0]) handleFileSelect(files[0]);
    },
    [disabled],
  );

  const handleFileSelect = (file) => {
    setError(null);
    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-matroska",
      "video/webm",
    ];
    const validExts = [".mp4", ".avi", ".mov", ".mkv", ".webm"];
    const fileExt = "." + file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExts.includes(fileExt)) {
      setError(
        "Please select a valid video file (.mp4, .avi, .mov, .mkv, or .webm)",
      );
      return;
    }
    console.log(
      "📁 File selected:",
      file.name,
      (file.size / 1024 / 1024).toFixed(2) + " MB",
    );
    onUpload(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-500 cursor-pointer 
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 scale-[1.01] shadow-2xl shadow-blue-500/10"
              : disabled
                ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
          }`}
      >
        <input
          type="file"
          accept=".mp4,.avi,.mov,.mkv,.webm"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          id="video-upload"
        />

        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={isDragging ? { y: -10 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div
              className={`p-5 rounded-3xl transition-colors duration-300 ${isDragging ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"}`}
            >
              <FileVideo className="w-10 h-10" />
            </div>
          </motion.div>

          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900 tracking-tight">
              {disabled ? "Engine processing data..." : "Ingest drone footage"}
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Drag and drop to begin vehicle tracking analysis
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
              ${disabled ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"}`}
          >
            {disabled ? "Analysis Active" : "Select Video Feed"}
          </motion.div>

          {/* New technical badges for premium feel */}
          {!disabled && (
            <div className="flex items-center gap-4 pt-4 opacity-40">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Secure
              </div>
              <span className="h-1 w-1 bg-slate-400 rounded-full"></span>
              <div className="text-[10px] font-black uppercase tracking-widest">
                Batch v4.0
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isDragging && !disabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] flex items-center justify-center pointer-events-none"
            >
              <div className="flex items-center gap-2 text-blue-600 text-sm font-black uppercase tracking-widest">
                <Upload className="w-5 h-5 animate-bounce" />
                <span>Release to analyze</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest leading-none">
                Validation Error
              </p>
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
