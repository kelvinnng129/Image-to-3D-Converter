import asyncio
import time
from typing import Optional
from concurrent.futures import ThreadPoolExecutor

from app.models import JobStatus
from app.services.job_service import job_service
from app.services.storage import storage
from app.processors import get_processor


class JobQueue:
    """Background job processing queue."""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2)
        self.processor = get_processor()
    
    async def process_job(self, job_id: str) -> bool:
        """Process a single job."""
        job = job_service.get_job(job_id)
        
        if not job:
            print(f"Job {job_id} not found")
            return False
        
        start_time = time.time()
        
        try:
            # Update status to processing
            job_service.update_job_status(job_id, JobStatus.PROCESSING, progress=0)
            
            input_path = job.input_file
            output_path = str(storage.get_output_path(job_id))
            
            def update_progress(progress: int):
                job_service.update_job_status(job_id, JobStatus.PROCESSING, progress=progress)
            
            # Run processor
            success = await self.processor.process(
                input_path=input_path,
                output_path=output_path,
                progress_callback=update_progress
            )
            
            processing_time = time.time() - start_time
            
            if success:
                job_service.complete_job(job_id, output_path, processing_time)
                print(f"✓ Job {job_id} completed in {processing_time:.2f}s")
                return True
            else:
                job_service.fail_job(job_id, "Processing failed")
                print(f"✗ Job {job_id} failed")
                return False
                
        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = str(e)
            job_service.fail_job(job_id, error_msg)
            print(f"✗ Job {job_id} error: {error_msg}")
            return False
    
    def enqueue(self, job_id: str):
        """Add job to background processing queue."""
        # to queued
        job_service.update_job_status(job_id, JobStatus.QUEUED)
        
        # background
        asyncio.create_task(self.process_job(job_id))
        print(f"Job {job_id} enqueued")


job_queue = JobQueue()
