"""Processors module."""

from app.processors.base import BaseProcessor
from app.processors.dummy import DummyProcessor
from app.processors.depth_processor import DepthProcessor
from app.config import settings


def get_processor() -> BaseProcessor:
    """Get the configured processor."""
    processor_type = getattr(settings, 'processor_type', 'depth')
    
    if processor_type == "dummy":
        return DummyProcessor()
    elif processor_type == "depth":
        return DepthProcessor()
    else:
        # Default to real depth processor
        return DepthProcessor()


__all__ = ["BaseProcessor", "DummyProcessor", "DepthProcessor", "get_processor"]
