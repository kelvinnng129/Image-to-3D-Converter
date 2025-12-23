import { motion } from 'framer-motion';
import { Download, Box } from 'lucide-react';
import { ModelViewer } from '../components';
import { getModelUrl, downloadModel } from '../services/api';
import { formatFileSize, formatTime, formatJobId } from '../utils/formatters';

export default function ResultView({ job, onReset }) {
  const handleDownload = () => {
    downloadModel(job.id);
  };

  const modelUrl = getModelUrl(job.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto pt-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Generation Complete</h2>
          <p className="text-gray-500 font-medium">
            Job ID: <span className="text-gray-900">{formatJobId(job.id)}</span>
            {job.processing_time && (
              <> • {formatTime(job.processing_time)} inference time</>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="px-5 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            New Upload
          </button>
          <button 
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Download .GLB
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <ModelViewer modelUrl={modelUrl} className="mb-8" />

      {/* Details Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Box size={18} className="text-gray-900" />
          <h3 className="font-bold text-gray-900">Model Details</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Job ID</span>
            <span className="font-mono text-gray-900 font-medium">{job.id}</span>
          </div>
          <div className="w-full h-px bg-gray-50" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Mode</span>
            <span className="font-mono text-gray-900 font-medium">
              {job.mode === 'single' ? 'Quick Preview' : 'Full 360°'}
            </span>
          </div>
          <div className="w-full h-px bg-gray-50" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Input File Size</span>
            <span className="font-mono text-gray-900 font-medium">
              {formatFileSize(job.file_size)}
            </span>
          </div>
          <div className="w-full h-px bg-gray-50" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Processing Time</span>
            <span className="font-mono text-gray-900 font-medium">
              {job.processing_time ? formatTime(job.processing_time) : 'N/A'}
            </span>
          </div>
          <div className="w-full h-px bg-gray-50" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Format</span>
            <span className="font-mono text-gray-900 font-medium">GLB</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
