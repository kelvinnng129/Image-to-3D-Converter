from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.models import JobResponse, ProcessingMode
from app.services import storage, job_service, job_queue
from app.api.dependencies import validate_image

router = APIRouter(prefix="/api", tags=["jobs"])


@router.post("/jobs", response_model=JobResponse)
async def create_job(
    file: UploadFile = File(...),
    mode: ProcessingMode = ProcessingMode.SINGLE
):
    """
    Create a new 3D generation job.
    
    - Upload an image file (JPG, PNG, WebP)
    - Returns job ID to track progress
    - Processing starts automatically in background
    """
    # Validate file
    await validate_image(file)
    
    # Generate job ID
    job_id = storage.generate_job_id()
    
    # Save uploaded file
    input_path = await storage.save_upload(file, job_id)
    file_size = storage.get_file_size(input_path)
    
    # Create job in database
    job = job_service.create_job(
        job_id=job_id,
        mode=mode,
        input_file=input_path,
        file_size=file_size
    )
    
    # Start processing in background
    job_queue.enqueue(job_id)
    
    return job


@router.get("/jobs", response_model=List[JobResponse])
async def list_jobs(limit: int = 20):
    """List all jobs."""
    jobs = job_service.get_all_jobs(limit=limit)
    return jobs


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """Get job status by ID."""
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job


@router.get("/jobs/{job_id}/model.glb")
async def download_model(job_id: str):
    """Download the generated 3D model."""
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Job not completed. Status: {job.status}"
        )
    
    output_path = storage.get_output_path(job_id)
    
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="Model file not found")
    
    return FileResponse(
        path=str(output_path),
        filename=f"{job_id}.glb",
        media_type="model/gltf-binary"
    )


@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a job and its files."""
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Delete files
    storage.delete_job_files(job_id)
    
    # Delete from database
    job_service.delete_job(job_id)
    
    return {"message": "Job deleted", "job_id": job_id}
