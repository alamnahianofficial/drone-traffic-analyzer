from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from app.services.video_processor import process_video, task_statuses
import uuid
import shutil
from pathlib import Path
from app.config import UPLOAD_DIR

router = APIRouter(tags=["Video"])

@router.post("/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    save_path = UPLOAD_DIR / f"{task_id}{Path(file.filename).suffix}"
    
    # Save file efficiently
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Initialize Status
    task_statuses[task_id] = {
        "status": "processing",
        "progress": 0,
        "message": "Initializing AI Engine...",
        "vehicle_count": 0,
        "compute_time": 0.0
    }
    
    background_tasks.add_task(process_video, task_id, str(save_path))
    return {"task_id": task_id}

@router.get("/status")
async def get_status(task_id: str):
    if task_id not in task_statuses:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_statuses[task_id]