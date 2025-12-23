import { useState, useCallback, useRef, useEffect } from 'react';
import { createJob, getJob } from '../services/api';
import { JOB_STATUS, POLL_INTERVAL } from '../utils/constants';

export default function useJob() {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const pollJobStatus = useCallback((jobId) => {
    stopPolling();

    pollIntervalRef.current = setInterval(async () => {
      try {
        const updatedJob = await getJob(jobId);
        setJob(updatedJob);

        // Stop polling when job is done
        if (
          updatedJob.status === JOB_STATUS.COMPLETED ||
          updatedJob.status === JOB_STATUS.FAILED
        ) {
          stopPolling();
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Don't stop polling on transient errors!!!!
      }
    }, POLL_INTERVAL);
  }, [stopPolling]);

  const submitJob = useCallback(async (file, mode) => {
    setIsLoading(true);
    setError(null);

    try {
      const newJob = await createJob(file, mode);
      setJob(newJob);

      // Start polling for status updates
      pollJobStatus(newJob.id);

      return newJob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pollJobStatus]);

  const resetJob = useCallback(() => {
    stopPolling();
    setJob(null);
    setError(null);
    setIsLoading(false);
  }, [stopPolling]);

  return {
    job,
    isLoading,
    error,
    submitJob,
    resetJob,
    stopPolling,
  };
}
