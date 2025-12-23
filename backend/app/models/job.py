from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

from app.models.enums import JobStatus, ProcessingMode


class JobBase(SQLModel):
    """Base job fields."""
    mode: ProcessingMode
    status: JobStatus
    progress: int
    error_message: Optional[str]


class Job(JobBase, table=True):
    """Job database model."""
    __tablename__ = "jobs"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    mode: ProcessingMode = Field(default=ProcessingMode.SINGLE)
    status: JobStatus = Field(default=JobStatus.PENDING)
    progress: int = Field(default=0, ge=0, le=100)
    error_message: Optional[str] = Field(default=None)
    
    # File paths
    input_file: Optional[str] = Field(default=None)
    output_file: Optional[str] = Field(default=None)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)
    
    # Metadata
    file_size: Optional[int] = Field(default=None)
    processing_time: Optional[float] = Field(default=None)


class JobCreate(SQLModel):
    """Request model for creating a job."""
    mode: ProcessingMode = Field(default=ProcessingMode.SINGLE)


class JobResponse(SQLModel):
    """Response model for job data."""
    id: str
    mode: ProcessingMode
    status: JobStatus
    progress: int
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    file_size: Optional[int]
    processing_time: Optional[float]
    
    model_config = {"from_attributes": True}
