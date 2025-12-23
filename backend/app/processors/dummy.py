import asyncio
import shutil
from pathlib import Path
from typing import Callable

from app.processors.base import BaseProcessor


class DummyProcessor(BaseProcessor):
    """Dummy processor that copies a sample GLB file."""
    
    def __init__(self):
        # Path to sample cube.glb
        self.sample_glb = Path(__file__).parent.parent.parent / "static" / "dummy" / "cube.glb"
    
    @property
    def name(self) -> str:
        return "dummy"
    
    async def process(
        self, 
        input_path: str, 
        output_path: str,
        progress_callback: Callable[[int], None] = None
    ) -> bool:
        """Simulate processing by waiting and copying sample file."""
        try:
            # Simulate processing with progress updates
            steps = [10, 25, 40, 55, 70, 85, 95, 100]
            
            for progress in steps:
                await asyncio.sleep(0.3)  # Simulate work
                if progress_callback:
                    progress_callback(progress)
            
            # Copy sample GLB to output path
            if self.sample_glb.exists():
                shutil.copy(self.sample_glb, output_path)
                return True
            else:
                print(f"Warning: Sample GLB not found at {self.sample_glb}")
                # Create empty file as fallback
                Path(output_path).touch()
                return True
                
        except Exception as e:
            print(f"DummyProcessor error: {e}")
            return False
