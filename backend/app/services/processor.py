"""
Job Processor - Orchestrates the image-to-3D pipeline
"""
import asyncio
import time
from pathlib import Path

from app.services.job_service import job_service
from app.services.storage import storage
from app.models import JobStatus


async def update_progress(job_id: str, progress: int, status: str = "processing"):
    """Helper to update job progress"""
    job_service.update_job_status(job_id, status=JobStatus(status), progress=progress)
    await asyncio.sleep(0.01)


async def process_job(job_id: str, image_path: str, output_path: str, mode: str):
    """
    Process an image-to-3D job using the real AI pipeline
    
    Args:
        job_id: Unique job identifier
        image_path: Path to uploaded image
        output_path: Where to save the GLB file
        mode: 'single' or 'multi' (affects depth scale)
    """
    # for avoid circular imports and delay model loading
    from app.services.depth_estimator import get_depth_estimator
    from app.services.mesh_generator import create_mesh_generator
    
    start_time = time.time()
    
    try:
        # Stage 1: Initialize (0-10%)
        await update_progress(job_id, 5)
        
        image_path = Path(image_path)
        output_path = Path(output_path)
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        await update_progress(job_id, 10)
        
        # Stage 2: Depth Estimation (10-50%)
        await update_progress(job_id, 15)
        
        depth_estimator = get_depth_estimator()
        
        # Run depth estimation in thread pool (CPU-bound)
        loop = asyncio.get_event_loop()
        depth_map = await loop.run_in_executor(
            None, 
            depth_estimator.estimate, 
            image_path
        )
        
        await update_progress(job_id, 50)
        
        # Stage 3: Mesh Generation (50-80%)
        await update_progress(job_id, 55)
        
        # Adjust depth scale based on mode
        depth_scale = 0.2 if mode == "single" else 0.4
        mesh_generator = create_mesh_generator(depth_scale=depth_scale)
        
        # Run mesh generation in thread pool
        await loop.run_in_executor(
            None,
            mesh_generator.generate,
            image_path,
            depth_map,
            output_path
        )
        
        await update_progress(job_id, 80)
        
        # Stage 4: Finalization (80-100%)
        await update_progress(job_id, 90)
        
        # Verify output exists
        if not output_path.exists():
            raise RuntimeError("GLB file was not created")
        
        file_size = output_path.stat().st_size
        if file_size < 100:
            raise RuntimeError("GLB file is too small, generation may have failed")
        
        processing_time = time.time() - start_time
        
        # Mark as complete
        job_service.complete_job(
            job_id=job_id,
            output_file=str(output_path),
            processing_time=processing_time
        )
        
        print(f"✓ Job {job_id} completed in {processing_time:.2f}s (output: {file_size} bytes)")
        
    except Exception as e:
        processing_time = time.time() - start_time
        error_message = str(e)
        
        job_service.fail_job(
            job_id=job_id,
            error_message=error_message
        )
        
        print(f"✗ Job {job_id} failed after {processing_time:.2f}s: {error_message}")
        raise
