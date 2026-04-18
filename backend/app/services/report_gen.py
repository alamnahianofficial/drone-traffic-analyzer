import pandas as pd
from pathlib import Path
from app.config import UPLOAD_DIR

def generate_report(task_id, detection_log, counted_ids, duration):
    """
    Generates a structured Excel report as per ANTS technical requirements.
    Ensures directories are created and data integrity is maintained for long clips.
    """
    try:
        # 1. Setup paths
        report_folder = UPLOAD_DIR / "reports"
        report_folder.mkdir(parents=True, exist_ok=True) 
        report_path = report_folder / f"{task_id}_report.xlsx"
        
        # 2. Prepare Data Sheets [cite: 37, 39, 41]
        # Sheet 1: Executive Summary [cite: 38, 40]
        summary_data = {
            "Category": ["System Metrics", "System Metrics", "Vehicle Breakdown"],
            "Metric": ["Total Unique Vehicles", "Processing Duration (s)", "Total Detected Objects"],
            "Value": [len(counted_ids), duration, len(detection_log)]
        }
        df_summary = pd.DataFrame(summary_data)

        # Sheet 2: Detailed Telemetry [cite: 41]
        df_details = pd.DataFrame(detection_log)
        
        # 3. Write to Excel using openpyxl engine
        with pd.ExcelWriter(report_path, engine='openpyxl') as writer:
            df_summary.to_excel(writer, sheet_name="Executive Summary", index=False)
            df_details.to_excel(writer, sheet_name="Detection Details", index=False)
            
        print(f"Report successfully generated at: {report_path}")
        return str(report_path)

    except Exception as e:
        print(f"Report Generation Error: {e}")
        return None