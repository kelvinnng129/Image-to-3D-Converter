export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// File Upload Limits
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const PROCESSING_MODES = {
  SINGLE: 'single',
  MULTI: 'multi'
};

// Job Statuses
export const JOB_STATUS = {
  PENDING: 'pending',
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const POLL_INTERVAL = 1000;
