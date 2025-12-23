import { Check } from 'lucide-react';

const steps = [
  { id: 'upload', label: 'Upload' },
  { id: 'queue', label: 'Queue' },
  { id: 'process', label: 'Process' },
  { id: 'done', label: 'Done' }
];

function getStepIndex(state) {
  if (state === 'HOME') return -1;
  if (state === 'UPLOAD') return 0;
  if (state === 'PROCESSING') return 2;
  if (state === 'RESULT') return 3;
  if (state === 'ERROR') return 2;
  return 0;
}

export default function StepIndicator({ currentStep }) {
  const activeIndex = getStepIndex(currentStep);

  if (currentStep === 'HOME') return null;

  return (
    <div className="max-w-2xl mx-auto mb-12 px-4">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-10" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-black -z-10 transition-all duration-500"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${isCompleted ? 'bg-black border-black text-white' : ''}
                  ${isActive ? 'bg-white border-black text-black' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-gray-200 text-gray-300' : ''}
                `}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <span 
                className={`
                  text-xs font-medium transition-colors duration-300 
                  ${isActive || isCompleted ? 'text-black' : 'text-gray-300'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
