import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function HomeView({ onSelectMode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto text-center pt-12"
    >
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Image to 3D
      </h1>
      <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto">
        Transform your photos into interactive 3D models. <br/>
        Open source, self-hostable, and developer friendly.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
        {/* Mode A - Quick Preview */}
        <button 
          onClick={() => onSelectMode('single')}
          className="group text-left p-8 rounded-xl border border-gray-200 bg-white hover:border-black hover:shadow-lg transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
              ~30 seconds
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Preview</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Upload a single image for a fast depth-based 3D preview. Best for rapid prototyping and front-facing objects.
          </p>
        </button>

        {/* Mode B - Full 360° */}
        <button 
          onClick={() => onSelectMode('multi')}
          className="group text-left p-8 rounded-xl border border-gray-200 bg-white hover:border-black hover:shadow-lg transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              High Quality
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Full 360° Model</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Upload 20-60 photos for a true photogrammetric reconstruction. Best for e-commerce assets and game props.
          </p>
        </button>
      </div>
    </motion.div>
  );
}
