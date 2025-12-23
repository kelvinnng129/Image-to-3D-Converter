from abc import ABC, abstractmethod
from typing import Callable


class BaseProcessor(ABC):
    """Abstract base class for 3D processors."""
    
    @abstractmethod
    async def process(
        self, 
        input_path: str, 
        output_path: str,
        progress_callback: Callable[[int], None] = None
    ) -> bool:
        """
        Process an image to generate a 3D model.
        
        Args:
            input_path: Path to input image
            output_path: Path to save output GLB
            progress_callback: Function to report progress (0-100)
            
        Returns:
            True if successful, False otherwise
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return processor name."""
        pass
