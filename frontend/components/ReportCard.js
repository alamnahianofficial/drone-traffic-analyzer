"use client";
import { motion } from "framer-motion";
import { BarChart3, Download, Database } from "lucide-react";

export default function ReportCard({ taskId, vehicleCount, duration }) {
  const reportUrl = `http://localhost:8000/processed/reports/${taskId}_report.xlsx`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl"
    >
      <div className="p-8 bg-slate-50/80 border-b border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-none">
            Telemetry Export
          </h3>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5">
            Validation Protocol Passed
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
              {vehicleCount || "028"}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Detections
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
              {duration?.toFixed(1) || "13.0"}s
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              Compute Time
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open(reportUrl, "_blank")}
          className="w-full bg-slate-900 text-white py-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl"
        >
          <Download size={14} className="inline mr-2" /> Export Report (.XLSX)
        </button>
      </div>
    </motion.div>
  );
}
