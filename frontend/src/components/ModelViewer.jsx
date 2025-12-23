import { useEffect, useRef, useState } from 'react';
import { GridBackground } from './GridBackground';

export default function ModelViewer({ modelUrl, className = '' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);

  useEffect(() => {
    import('@google/model-viewer').catch(err => {
      console.error('Failed to load model-viewer:', err);
    });
  }, []);

  useEffect(() => {
    if (modelUrl) {
      setLoading(true);
      setError(null);
    }
  }, [modelUrl]);

  useEffect(() => {
    const handleLoad = () => {
      console.log('Model loaded successfully');
      setLoading(false);
    };
    
    const handleError = (e) => {
      console.error('Model error:', e);
      setError('Failed to load model');
      setLoading(false);
    };

    // Use MutationObserver to detect when model-viewer is ready
    const timer = setTimeout(() => {
      const viewer = document.querySelector('model-viewer');
      if (viewer) {
        viewer.addEventListener('load', handleLoad);
        viewer.addEventListener('error', handleError);
        
        if (viewer.loaded) {
          setLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [modelUrl]);

  if (!modelUrl) {
    return (
      <div 
        className={`
          w-full h-80 bg-gray-50 border border-gray-200 rounded-xl 
          relative overflow-hidden flex items-center justify-center
          ${className}
        `}
      >
        <GridBackground />
        <p className="text-gray-400 z-10">No model to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`
        w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 
        border border-gray-200 rounded-xl relative overflow-hidden
        ${className}
      `}
    >
      <GridBackground />
      
      {/* Google Model Viewer */}
      <model-viewer
        ref={modelRef}
        src={modelUrl}
        alt="3D Model"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        exposure="0.8"
        camera-orbit="45deg 55deg 2.5m"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto auto"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          backgroundColor: 'transparent',
        }}
      />

      {/* Loading indicator - auto-hide after 3 seconds */}
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20 bg-white/50 transition-opacity duration-500"
          style={{ animation: 'fadeOut 0.5s ease-in-out 3s forwards' }}
        >
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading 3D model...</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400 z-20 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
