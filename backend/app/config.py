# backend/app/config.py
from pathlib import Path
import sys

# Base directory = backend/
BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

REPORTS_DIR = UPLOAD_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# ✅ Models directory
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
YOLO_MODEL_PATH = MODELS_DIR / "yolov8n.pt"

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}

# Debug logs (optional, keep for now)
print(f"[CONFIG] BASE_DIR: {BASE_DIR}", file=sys.stderr)
print(f"[CONFIG] MODEL_PATH: {YOLO_MODEL_PATH}", file=sys.stderr)