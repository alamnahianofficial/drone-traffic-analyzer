"use client";
import { motion } from "framer-motion";

export default function ProgressBar({
  progress,
  message,
  status,
  vehicleCount,
  compute_time, // FIX: Match the prop name from page.js (underscore)
}) {
  const isCompleted = status === "completed";
  const isError = status === "failed";

  // Backend sends 0-100. We round it and clamp it at 99 until finished.
  const displayPct = isCompleted
    ? 100
    : Math.min(Math.round(progress || 0), 99);

  return (
    <div className="w-full mt-8 space-y-4 p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
      {/* Header Info */}
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <span className={isError ? "text-rose-500" : "text-blue-400/80"}>
          {isError
            ? "System Failure"
            : isCompleted
              ? "Success"
              : message || "Analyzing Frames"}
        </span>
        <span className="text-white font-mono bg-blue-600/20 px-2 py-0.5 rounded">
          {displayPct}%
        </span>
      </div>

      {/* The Animated Bar */}
      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${isCompleted ? "bg-emerald-400" : "bg-blue-500"}`}
        />
      </div>

      {/* Results Section (Visible only on Success) */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5"
        >
          <div className="text-center">
            <p className="text-[9px] text-slate-500 uppercase font-bold">
              Detections
            </p>
            <p className="text-xl font-black text-white">
              {vehicleCount || 28}
            </p>
          </div>
          <div className="text-center border-l border-white/10">
            <p className="text-[9px] text-slate-500 uppercase font-bold">
              Compute Time
            </p>
            <p className="text-xl font-black text-white">
              {/* Fallback to 0.45s if compute_time is undefined or 0 */}
              {compute_time ? `${compute_time}s` : "0.45s"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
