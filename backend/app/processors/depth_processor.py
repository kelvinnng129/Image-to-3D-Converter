"""
Real AI Processor using Depth Estimation + Mesh Generation
"""
import asyncio
from pathlib import Path
from typing import Callable, Optional

from app.processors.base import BaseProcessor


class DepthProcessor(BaseProcessor):
    """Process images to 3D using depth estimation."""
    
    def __init__(self):
        self._depth_estimator = None
        self._loaded = False
    
    @property
    def name(self) -> str:
        """Return processor name."""
        return "depth"
    
    def _lazy_load(self):
        """Lazy load the depth estimator (heavy imports)."""
        if self._loaded:
            return
        
        from app.services.depth_estimator import get_depth_estimator
        self._depth_estimator = get_depth_estimator()
        self._loaded = True
    
    async def process(
        self,
        input_path: str,
        output_path: str,
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> bool:
        """
        Process an image to 3D model.
        """
        from app.services.mesh_generator import create_mesh_generator
        
        try:
            input_path = Path(input_path)
            output_path = Path(output_path)
            
            # Ensure output directory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Stage 1: Load model (0-10%)
            if progress_callback:
                progress_callback(5)
            
            print("Loading depth estimation model...")
            self._lazy_load()
            
            if progress_callback:
                progress_callback(10)
            
            # Stage 2: Depth Estimation (10-50%)
            print(f"Estimating depth for: {input_path}")
            if progress_callback:
                progress_callback(15)
            
            # Run depth estimation in thread pool
            loop = asyncio.get_event_loop()
            depth_map = await loop.run_in_executor(
                None,
                self._depth_estimator.estimate,
                input_path
            )
            
            print(f"Depth map shape: {depth_map.shape}")
            if progress_callback:
                progress_callback(50)
            
            # Stage 3: Mesh Generation (50-90%)
            print("Generating 3D mesh...")
            if progress_callback:
                progress_callback(55)
            
            mesh_generator = create_mesh_generator(depth_scale=0.3)
            
            await loop.run_in_executor(
                None,
                mesh_generator.generate,
                input_path,
                depth_map,
                output_path
            )
            
            if progress_callback:
                progress_callback(90)
            
            # Stage 4: Verify output (90-100%)
            if not output_path.exists():
                raise RuntimeError("GLB file was not created")
            
            file_size = output_path.stat().st_size
            print(f"GLB file created: {file_size} bytes")
            
            if file_size < 100:
                raise RuntimeError("GLB file is too small")
            
            if progress_callback:
                progress_callback(100)
            
            return True
            
        except Exception as e:
            print(f"DepthProcessor error: {e}")
            import traceback
            traceback.print_exc()
            raise
