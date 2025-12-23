"""
Depth Estimation using DPT (Dense Prediction Transformer)
Uses Hugging Face transformers with Intel DPT model
"""
import numpy as np
from PIL import Image
from pathlib import Path
import torch
from transformers import DPTImageProcessor, DPTForDepthEstimation

class DepthEstimator:
    """Estimates depth maps from single images using DPT model"""
    
    def __init__(self):
        self.device = "mps" if torch.backends.mps.is_available() else "cpu"
        self.model = None
        self.processor = None
        self._loaded = False
    
    def load_model(self):
        """Lazy load the model (only when first needed)"""
        if self._loaded:
            return
        
        print("Loading depth estimation model...")
        model_name = "Intel/dpt-hybrid-midas"
        
        self.processor = DPTImageProcessor.from_pretrained(model_name)
        self.model = DPTForDepthEstimation.from_pretrained(model_name)
        self.model.to(self.device)
        self.model.eval()
        
        self._loaded = True
        print(f"✓ Depth model loaded on {self.device}")
    
    def estimate(self, image_path: str | Path) -> np.ndarray:
        """
        Estimate depth from an image
        
        Args:
            image_path: Path to input image
            
        Returns:
            Depth map as numpy array (H, W) with values 0-1
        """
        self.load_model()
        
        # Load and prepare image
        image = Image.open(image_path).convert("RGB")
        original_size = image.size  # (W, H)
        
        # Process image for model
        inputs = self.processor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            predicted_depth = outputs.predicted_depth
        
        # Interpolate to original size
        prediction = torch.nn.functional.interpolate(
            predicted_depth.unsqueeze(1),
            size=(original_size[1], original_size[0]),  # (H, W)
            mode="bicubic",
            align_corners=False,
        ).squeeze()
        
        # Convert to numpy and normalize to 0-1
        depth_map = prediction.cpu().numpy()
        depth_min = depth_map.min()
        depth_max = depth_map.max()
        
        if depth_max - depth_min > 0:
            depth_map = (depth_map - depth_min) / (depth_max - depth_min)
        else:
            depth_map = np.zeros_like(depth_map)
        
        return depth_map


_depth_estimator = None

def get_depth_estimator() -> DepthEstimator:
    """Get or create the global depth estimator instance"""
    global _depth_estimator
    if _depth_estimator is None:
        _depth_estimator = DepthEstimator()
    return _depth_estimator
