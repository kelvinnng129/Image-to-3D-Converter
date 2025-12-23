import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Header, Footer, StepIndicator } from './components';
import { HomeView, UploadView, ProcessingView, ResultView, ErrorView } from './views';
import { useJob } from './hooks';
import { JOB_STATUS } from './utils/constants';

const APP_STATE = {
  HOME: 'HOME',
  UPLOAD: 'UPLOAD',
  PROCESSING: 'PROCESSING',
  RESULT: 'RESULT',
  ERROR: 'ERROR',
};

export default function App() {
  const [appState, setAppState] = useState(APP_STATE.HOME);
  const [selectedMode, setSelectedMode] = useState(null);
  const { job, isLoading, error, submitJob, resetJob } = useJob();

  useEffect(() => {
    if (!job) return;

    if (job.status === JOB_STATUS.COMPLETED) {
      setAppState(APP_STATE.RESULT);
    } else if (job.status === JOB_STATUS.FAILED) {
      setAppState(APP_STATE.ERROR);
    } else if (
      job.status === JOB_STATUS.PROCESSING || 
      job.status === JOB_STATUS.QUEUED ||
      job.status === JOB_STATUS.PENDING
    ) {
      setAppState(APP_STATE.PROCESSING);
    }
  }, [job]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setAppState(APP_STATE.UPLOAD);
  };

  const handleGenerate = async (file) => {
    try {
      await submitJob(file, selectedMode);
      setAppState(APP_STATE.PROCESSING);
    } catch (err) {
      console.error('Failed to submit job:', err);
      setAppState(APP_STATE.ERROR);
    }
  };

  const handleReset = () => {
    resetJob();
    setAppState(APP_STATE.HOME);
    setSelectedMode(null);
  };

  const handleRetry = () => {
    resetJob();
    setAppState(APP_STATE.UPLOAD);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-gray-100">
      <Header onReset={handleReset} />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <StepIndicator currentStep={appState} />

        <AnimatePresence mode="wait">
          {appState === APP_STATE.HOME && (
            <HomeView 
              key="home" 
              onSelectMode={handleModeSelect} 
            />
          )}
          
          {appState === APP_STATE.UPLOAD && (
            <UploadView 
              key="upload" 
              mode={selectedMode} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          )}
          
          {appState === APP_STATE.PROCESSING && (
            <ProcessingView 
              key="processing" 
              job={job}
            />
          )}
          
          {appState === APP_STATE.RESULT && (
            <ResultView 
              key="result" 
              job={job}
              onReset={handleReset} 
            />
          )}

          {appState === APP_STATE.ERROR && (
            <ErrorView 
              key="error" 
              job={job}
              onRetry={handleRetry} 
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
