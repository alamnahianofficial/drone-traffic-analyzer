# Smart Drone Traffic Analyzer

### Computer Vision Automation Full-Stack Development

---

## 1. Project Overview

This is a professional full-stack solution designed to process drone-captured video for traffic management. The system automates vehicle detection, persistent tracking, and data reporting, allowing users to upload `.mp4` files and receive comprehensive traffic analytics.

## 2. Technical Architecture

In compliance with the **ANTS** assessment requirements, the project utilizes a **decoupled Full-Stack architecture**:

- **Frontend (Next.js):** A modern React-based interface featuring a "corporate premium" aesthetic. It manages the user workflow, including file uploads and real-time **loading/processing states** to ensure a responsive User Experience (UX).
- **Backend (FastAPI):** A high-performance Python backend that handles the Computer Vision (CV) pipeline. It utilizes background tasks to process video without blocking the API.
- **Communication:** Data and video files are exchanged via **RESTful APIs**. The backend provides structured JSON responses for tracking data, which are then rendered on the frontend.

---

## 3. Unique Adaptive Detection Pipeline

The core of this solution is a custom **Adaptive Pipeline** designed specifically to solve the challenge of double-counting and varying video resolutions:

- **Resolution-Agnostic Gate:** Instead of static pixel coordinates, the "Detection Gate" is dynamically set at **65% of the frame height**. This allows the counting logic to remain consistent regardless of whether the input is 720p, 1080p, or 4K.
- **Dynamic Catchment Buffer:** The system establishes a trigger zone (scaling between **3% to 5%** of height) based on the video's resolution. This ensures that fast-moving vehicles are captured even if their movement between frames "jumps" across a single line.
- **ID State Persistence:** I utilized a persistent tracking algorithm (YOLOv8 + ByteTrack logic). Once a unique vehicle ID is logged as "Counted," it is stored in a session set. This prevents re-counting if a vehicle stops, slows down, or is temporarily occluded by obstacles.

---

## 4. Automation & Reporting

Upon completion, the system generates a downloadable **CSV/Excel report** containing:

- **Total Unique Vehicle Count** categorized by class (Car, Truck, Bus, etc.).
- **Processing Duration:** Total time taken by the pipeline to analyze the footage.
- **Temporal Analytics:** Exact frame indices and timestamps for every detection event.

## 5. Engineering Assumptions

- The drone footage provides a top-down or high-angle perspective.
- Vehicles are counted upon crossing the 65% height threshold.
- The system prioritizes GPU acceleration (CUDA) but includes an automated fallback to CPU.

---

## 6. Local Setup & Installation

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    - **Windows:** `python -m venv venv` then `.\venv\Scripts\activate`
    - **Mac/Linux:** `python3 -m venv venv` then `source venv/bin/activate`
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

---

**Developed by Nahian Alam**
