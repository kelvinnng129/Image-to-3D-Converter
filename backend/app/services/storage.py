import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile

from app.config import settings


class StorageService:
    """Handle file storage operations."""
    
    def __init__(self):
        self.base_path = settings.storage_dir
        self.uploads_dir = self.base_path / "uploads"
        self.outputs_dir = self.base_path / "outputs"
        
        self.uploads_dir.mkdir(parents=True, exist_ok=True)
        self.outputs_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_job_id(self) -> str:
        """Generate a unique job ID."""
        return str(uuid.uuid4())[:8].upper()
    
    async def save_upload(self, file: UploadFile, job_id: str) -> str:
        """Save uploaded file and return the file path."""
        # Get file extension
        ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
        
        # Create filename
        filename = f"{job_id}_input{ext}"
        filepath = self.uploads_dir / filename
        
        # Save file
        async with aiofiles.open(filepath, "wb") as f:
            content = await file.read()
            await f.write(content)
        
        return str(filepath)
    
    def get_upload_path(self, job_id: str, ext: str = ".jpg") -> Path:
        """Get the path for an uploaded file."""
        return self.uploads_dir / f"{job_id}_input{ext}"
    
    def get_output_path(self, job_id: str) -> Path:
        """Get the path for an output GLB file."""
        return self.outputs_dir / f"{job_id}_output.glb"
    
    def output_exists(self, job_id: str) -> bool:
        """Check if output file exists."""
        return self.get_output_path(job_id).exists()
    
    def get_file_size(self, filepath: str) -> int:
        """Get file size in bytes."""
        return os.path.getsize(filepath)
    
    def delete_job_files(self, job_id: str):
        """Delete all files for a job."""
        # Delete uploads
        for ext in [".jpg", ".jpeg", ".png", ".webp"]:
            path = self.get_upload_path(job_id, ext)
            if path.exists():
                path.unlink()
        
        # Delete output
        output = self.get_output_path(job_id)
        if output.exists():
            output.unlink()


storage = StorageService()
