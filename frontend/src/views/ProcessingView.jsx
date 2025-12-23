import { motion } from 'framer-motion';
import { JOB_STATUS } from '../utils/constants';

// Get status message based on progress
function getStatusMessage(progress, status) {
  if (status === JOB_STATUS.QUEUED) return 'Waiting in queue...';
  if (progress < 20) return 'Analyzing image depth...';
  if (progress < 50) return 'Generating 3D mesh...';
  if (progress < 80) return 'Applying texture maps...';
  return 'Optimizing GLB for web...';
}

export default function ProcessingView({ job }) {
  const progress = job?.progress || 0;
  const status = job?.status || JOB_STATUS.PROCESSING;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-lg mx-auto pt-16 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {getStatusMessage(progress, status)}
      </h2>
      <p className="text-gray-500 mb-12">Your 3D model is being created</p>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-black rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
      
      <p className="text-sm text-gray-400 font-medium">
        {progress}% complete
      </p>

      {/* Job Info */}
      {job && (
        <div className="mt-4 text-xs text-gray-400">
          Job ID: {job.id}
        </div>
      )}

      {/* What's Happening */}
      <div className="mt-16 text-left bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">What's happening</h4>
        <div className="space-y-3">
          {[
            { label: 'Analyzing image depth', threshold: 0 },
            { label: 'Generating 3D mesh', threshold: 20 },
            { label: 'Applying texture', threshold: 50 },
            { label: 'Optimizing for web', threshold: 80 },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div 
                className={`w-1.5 h-1.5 rounded-full ${
                  progress > step.threshold ? 'bg-green-500' : 'bg-gray-200'
                }`} 
              />
              <span className={progress > step.threshold ? 'text-gray-700' : 'text-gray-400'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
