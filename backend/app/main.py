import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import video
from app.config import UPLOAD_DIR

app = FastAPI(title="Smart Drone Traffic Analyzer")

# 1. Fix CORS (Crucial for Dhaka local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Ensure Folders Exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "reports").mkdir(parents=True, exist_ok=True)

# 3. Mount Static Files (So you can view video/excel in browser)
app.mount("/processed", StaticFiles(directory=str(UPLOAD_DIR)), name="processed")

# 4. Include Router with ONE prefix
app.include_router(video.router, prefix="/api/video")

@app.get("/")
async def root():
    return {"status": "online", "dev": "Nahian Alam"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)