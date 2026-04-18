"use client";
import { motion } from "framer-motion";
import {
  Play,
  Download,
  CheckCircle2,
  FileVideo,
  ExternalLink,
  Target,
  Radar,
} from "lucide-react";
import Button from "./ui/Button";

export default function VideoPlayer({ videoUrl }) {
  const fullUrl = videoUrl ? `http://localhost:8000${videoUrl}` : null;

  if (!fullUrl) {
    return (
      <div className="relative group p-12 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center overflow-hidden">
        {/* Animated Background Scan Effect */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 m-auto w-32 h-32 bg-blue-400 rounded-full pointer-events-none"
        />
        <div className="relative z-10">
          <Radar className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
            Awaiting Telemetry
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-2 max-w-[200px] mx-auto">
            Neural network is processing frame buffers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden"
    >
      {/* Premium HUD Header */}
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">
            Annotated Stream{" "}
            <span className="text-slate-400 ml-2">PROCESSED_SUCCESS</span>
          </h3>
        </div>
        <div className="hidden sm:block text-[10px] font-mono text-slate-400 font-bold">
          CODEC: H.264 / RESOLUTION: AUTO
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Professional Video Preview Area */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video group shadow-inner border border-slate-800">
          {/* HUD Overlay Elements */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 opacity-60">
            <div className="flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded text-[10px] text-white font-mono">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />{" "}
              REC 00:00:24
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6"
            >
              <Target className="w-10 h-10 text-blue-400" />
            </motion.div>

            <h4 className="text-2xl font-black text-white tracking-tight mb-2">
              Analysis Payload Ready
            </h4>
            <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed mb-8">
              ByteTrack objects identified. Open the stream to view real-time
              bounding box persistence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Launch Stream
              </a>
              <a
                href={fullUrl}
                download
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export
              </a>
            </div>
          </div>

          {/* Decorative Grid Background for Video Area */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        {/* Legend / Key Table */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 border-2 border-emerald-500 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Vehicle_Class
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 tracking-tighter">
                ID:{"{n}"}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Persistent_Track
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-blue-600/60">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Verified Output
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
