"use client";
import { useState, useEffect, useRef } from "react";
import {
  Radar,
  RefreshCw,
  Loader2,
  Play,
  Download,
  ChevronLeft,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import { uploadVideo, checkStatus } from "../lib/api";
import UploadZone from "../components/UploadZone";
import ProgressBar from "../components/ui/ProgressBar";
import ReportCard from "../components/ReportCard";

export default function Home() {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handleUpload = async (file) => {
    try {
      setIsProcessing(true);
      setShowStream(false);
      setTaskId(null);
      setStatus(null);
      const { task_id } = await uploadVideo(file);
      setTaskId(task_id);

      pollRef.current = setInterval(async () => {
        const data = await checkStatus(task_id);
        setStatus(data);
        if (data.status === "completed" || data.status === "failed") {
          stopPolling();
          setIsProcessing(false);
        }
      }, 1500);
    } catch (err) {
      setIsProcessing(false);
      alert("Upload failed. Check if backend is running on port 8000.");
    }
  };

  const handleReset = () => {
    stopPolling();
    setTaskId(null);
    setStatus(null);
    setIsProcessing(false);
    setShowStream(false);
  };

  // URL Helpers
  const baseUrl = "http://localhost:8000";
  const videoUrl = status?.video_url ? `${baseUrl}${status.video_url}` : null;
  const reportUrl = status?.report_url
    ? `${baseUrl}${status.report_url}`
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Radar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase leading-none">
                Drone Traffic <span className="text-blue-600">Analyzer</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Developed by Nahian Alam
              </p>
            </div>
          </div>
          {taskId && (
            <button
              onClick={handleReset}
              className="text-xs font-bold border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-100 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!taskId ? (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Intelligent Traffic <br /> Monitoring
            </h2>
            <UploadZone onUpload={handleUpload} disabled={isProcessing} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
              {/* 1. PROCESSING VIEW */}
              {(isProcessing || status?.status === "processing") && (
                <div className="absolute inset-0 z-30 bg-slate-900 flex flex-col items-center justify-center p-12 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                    <div className="relative h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-4 w-full max-w-md">
                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
                          {status?.message || "Running Inference..."}
                        </p>
                        <h3 className="text-white font-bold text-lg">
                          AI Pipeline Active
                        </h3>
                      </div>
                      <span className="text-white font-mono text-2xl font-black">
                        {/* FIX: Removed * 100 here to solve the 9900% bug */}
                        {Math.round(status?.progress || 0)}%
                      </span>
                    </div>

                    <ProgressBar
                      progress={status?.progress || 0}
                      status={status?.status}
                      message={status?.message}
                    />
                  </div>
                </div>
              )}

              {/* 2. VIDEO PLAYER VIEW */}
              {showStream && videoUrl && (
                <div className="absolute inset-0 z-40 bg-black flex flex-col">
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                  <button
                    onClick={() => setShowStream(false)}
                    className="absolute top-4 left-4 z-50 bg-black/60 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 backdrop-blur-md border border-white/10"
                  >
                    <ChevronLeft size={14} /> Exit Stream
                  </button>
                </div>
              )}

              {/* 3. READY VIEW */}
              {status?.status === "completed" && !showStream && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center text-white bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900">
                  <Activity className="text-blue-500 w-12 h-12 animate-pulse mb-6" />
                  <h2 className="text-2xl font-black mb-2">
                    Analysis Payload Ready
                  </h2>
                  <p className="text-slate-400 text-xs mb-8 font-medium">
                    Telemetry Synchronized | Nahian Alam Pipeline
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowStream(true)}
                      className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 transition-all"
                    >
                      <Play size={14} fill="currentColor" /> Launch Stream
                    </button>
                    <a
                      href={reportUrl}
                      download
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-blue-700 transition-all"
                    >
                      <FileSpreadsheet size={14} /> Download Excel
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              {status?.status === "completed" && (
                <ReportCard
                  taskId={taskId}
                  vehicleCount={status.vehicle_count}
                  duration={status.compute_time} // Mapping fixed compute_time
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
