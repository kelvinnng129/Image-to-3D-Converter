from enum import Enum


class JobStatus(str, Enum):
    """Status of a processing job."""
    PENDING = "pending"
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ProcessingMode(str, Enum):
    """Type of 3D processing."""
    SINGLE = "single"   # Single image to 3D
    MULTI = "multi"     # Multi-view photogrammetry
