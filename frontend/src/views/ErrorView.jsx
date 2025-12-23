import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function ErrorView({ job, onRetry }) {
  const errorMessage = job?.error_message || 'We couldn\'t generate a 3D model. The input image might be too blurry or have low contrast.';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto pt-16 text-center"
    >
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Failed</h2>
      <p className="text-gray-500 mb-8">
        {errorMessage}
      </p>

      {job && (
        <p className="text-xs text-gray-400 mb-4">
          Job ID: {job.id}
        </p>
      )}

      <button 
        onClick={onRetry}
        className="w-full bg-black text-white h-12 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Try Again
      </button>
      
      <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-2">Common fixes:</h4>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
          <li>Use a higher resolution image</li>
          <li>Ensure the object is well-lit</li>
          <li>Try a simpler background</li>
        </ul>
      </div>
    </motion.div>
  );
}
