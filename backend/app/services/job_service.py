from datetime import datetime
from typing import Optional, List
from sqlmodel import Session, select

from app.models import Job, JobStatus, ProcessingMode
from app.db.database import engine


class JobService:
    """Handle job CRUD operations."""
    
    def create_job(self, job_id: str, mode: ProcessingMode, input_file: str, file_size: int) -> Job:
        """Create a new job."""
        job = Job(
            id=job_id,
            mode=mode,
            status=JobStatus.PENDING,
            progress=0,
            input_file=input_file,
            file_size=file_size,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        with Session(engine) as session:
            session.add(job)
            session.commit()
            session.refresh(job)
            return job
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Get a job by ID."""
        with Session(engine) as session:
            statement = select(Job).where(Job.id == job_id)
            job = session.exec(statement).first()
            return job
    
    def get_all_jobs(self, limit: int = 100) -> List[Job]:
        """Get all jobs."""
        with Session(engine) as session:
            statement = select(Job).order_by(Job.created_at.desc()).limit(limit)
            jobs = session.exec(statement).all()
            return list(jobs)
    
    def update_job_status(
        self, 
        job_id: str, 
        status: JobStatus, 
        progress: int = None,
        error_message: str = None
    ) -> Optional[Job]:
        """Update job status."""
        with Session(engine) as session:
            statement = select(Job).where(Job.id == job_id)
            job = session.exec(statement).first()
            
            if not job:
                return None
            
            job.status = status
            job.updated_at = datetime.utcnow()
            
            if progress is not None:
                job.progress = progress
            
            if error_message is not None:
                job.error_message = error_message
            
            if status == JobStatus.COMPLETED:
                job.completed_at = datetime.utcnow()
            
            session.add(job)
            session.commit()
            session.refresh(job)
            return job
    
    def complete_job(self, job_id: str, output_file: str, processing_time: float) -> Optional[Job]:
        """Mark job as completed."""
        with Session(engine) as session:
            statement = select(Job).where(Job.id == job_id)
            job = session.exec(statement).first()
            
            if not job:
                return None
            
            job.status = JobStatus.COMPLETED
            job.progress = 100
            job.output_file = output_file
            job.processing_time = processing_time
            job.completed_at = datetime.utcnow()
            job.updated_at = datetime.utcnow()
            
            session.add(job)
            session.commit()
            session.refresh(job)
            return job
    
    def fail_job(self, job_id: str, error_message: str) -> Optional[Job]:
        """Mark job as failed."""
        return self.update_job_status(
            job_id=job_id,
            status=JobStatus.FAILED,
            error_message=error_message
        )
    
    def delete_job(self, job_id: str) -> bool:
        """Delete a job."""
        with Session(engine) as session:
            statement = select(Job).where(Job.id == job_id)
            job = session.exec(statement).first()
            
            if not job:
                return False
            
            session.delete(job)
            session.commit()
            return True


job_service = JobService()
