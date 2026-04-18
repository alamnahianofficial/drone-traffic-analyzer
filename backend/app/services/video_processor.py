import cv2
import time
import os
import torch
import pandas as pd
from ultralytics import YOLO
from app.config import YOLO_MODEL_PATH, UPLOAD_DIR, REPORTS_DIR

task_statuses = {}

def process_video(task_id: str, file_path: str):
    try:
        start_perf = time.perf_counter()
        
        # 1. HARDWARE HANDSHAKE
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        model = YOLO(str(YOLO_MODEL_PATH)).to(device)
        
        cap = cv2.VideoCapture(file_path)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # 2. ADAPTIVE MATH (The Solution for Different Video Sizes)
        # Instead of a fixed pixel count, we use a percentage of the height
        line_y = int(h * 0.65) 
        
        if total_frames > 5000:  
            # LONG VIDEO: Prioritize speed, widen gate to handle frame skips
            frame_step = 3      
            gate_buffer = int(h * 0.05) # 5% of height as buffer
            mode = "EFFICIENCY"
        else:
            # SHORT VIDEO: Prioritize precision, tight gate for 28-count baseline
            frame_step = 1      
            gate_buffer = int(h * 0.03) # 3% of height as buffer
            mode = "PRECISION"

        # 3. OUTPUT ENCODING
        output_filename = f"processed_{task_id}.mp4"
        output_path = UPLOAD_DIR / output_filename
        fourcc = cv2.VideoWriter_fourcc(*'avc1') 
        out = cv2.VideoWriter(str(output_path), fourcc, fps, (w, h))

        # 4. PROCESSING LOOP
        counted_ids = set()
        report_data = [] 

        for frame_idx in range(total_frames):
            success, frame = cap.read()
            if not success: break

            if frame_idx % frame_step != 0:
                out.write(frame)
                continue

            # Inference
            results = model.track(frame, persist=True, verbose=False, device=device, classes=[2, 3, 5, 7])
            annotated_frame = results[0].plot()
            cv2.line(annotated_frame, (0, line_y), (w, line_y), (0, 255, 0), 2)
            out.write(annotated_frame)

            if results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                ids = results[0].boxes.id.int().cpu().numpy()
                cls = results[0].boxes.cls.int().cpu().numpy()

                for box, obj_id, obj_cls in zip(boxes, ids, cls):
                    y_bottom = box[3] 
                    
                    # ADAPTIVE GATE CHECK
                    if (line_y - gate_buffer) < y_bottom < (line_y + gate_buffer):
                        if int(obj_id) not in counted_ids:
                            counted_ids.add(int(obj_id))
                            report_data.append({
                                "Vehicle ID": int(obj_id),
                                "Type": model.names[int(obj_cls)],
                                "Timestamp": round(frame_idx / fps, 2),
                                "Frame": frame_idx
                            })

            if frame_idx % 25 == 0:
                task_statuses[task_id]["progress"] = round((frame_idx / total_frames) * 100, 1)

        cap.release()
        out.release()
        time.sleep(1)

        # 5. REPORT EXPORT
        report_filename = f"{task_id}_report.xlsx"
        report_path = REPORTS_DIR / report_filename
        pd.DataFrame(report_data).to_excel(report_path, index=False)

        # 6. FINALIZE
        compute_time = round(time.perf_counter() - start_perf, 2)
        task_statuses[task_id].update({
            "status": "completed",
            "progress": 100.0,
            "vehicle_count": len(counted_ids),
            "compute_time": compute_time,
            "video_url": f"/processed/{output_filename}",
            "report_url": f"/processed/reports/{report_filename}",
            "message": f"Adaptive {mode} Mode Successful"
        })

    except Exception as e:
        task_statuses[task_id] = {"status": "failed", "message": str(e)}