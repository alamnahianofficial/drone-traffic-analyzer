const API_BASE = "http://localhost:8000";

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/video/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload Failed");
  return res.json();
};

export const checkStatus = async (taskId) => {
  const res = await fetch(`${API_BASE}/api/video/status?task_id=${taskId}`);
  if (!res.ok) throw new Error("Poll Failed");
  return res.json();
};
