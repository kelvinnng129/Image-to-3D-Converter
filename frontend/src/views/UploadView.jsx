import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { useFileUpload } from '../hooks';
import { formatFileSize } from '../utils/formatters';

export default function UploadView({ mode, onGenerate, isLoading }) {
  const {
    file,
    error,
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    clearFile,
  } = useFileUpload();

  const handleSubmit = () => {
    if (file) {
      onGenerate(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-xl mx-auto pt-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
        <p className="text-gray-500 mt-1">
          Mode: <span className="font-medium text-black">
            {mode === 'single' ? 'Quick Preview' : 'Full 360°'}
          </span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Drop Zone */}
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
            ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
          `}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
          />
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Upload size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Drop your image here</h3>
          <p className="text-gray-500 text-sm mt-2">or click to browse</p>
          <p className="text-xs text-gray-400 mt-6">JPG, PNG, WebP • Max 20MB</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <button 
            onClick={clearFile}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium text-white transition-all duration-200
            ${file && !isLoading 
              ? 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 cursor-not-allowed'}
          `}
        >
          {isLoading ? 'Uploading...' : 'Generate 3D Model'}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-yellow-500">💡</span> Tips for best results
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span> Use even lighting without harsh shadows
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span> Avoid transparent or highly reflective objects
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400">•</span> Keep the subject centered in the frame
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
