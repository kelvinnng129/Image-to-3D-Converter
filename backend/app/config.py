from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Storage
    storage_path: str = "./data"
    
    # DB
    database_url: str = "sqlite:///./data/jobs.db"
    
    replicate_api_token: str = ""
    
    # Processor type: dummy, depth, replicate
    processor_type: str = "depth"
    
    class Config:
        env_file = ".env"
        extra = "ignore"
    
    @property
    def storage_dir(self) -> Path:
        """Get storage directory as Path object."""
        path = Path(self.storage_path)
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()
