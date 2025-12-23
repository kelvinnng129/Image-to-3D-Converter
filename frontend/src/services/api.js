import { API_URL } from '../utils/constants';

/**
 * API Client for Image-to-3D Backend
 */

/**
 * Create a new job by uploading an image
 * @param {File} file - Image file to upload
 * @param {string} mode - Processing mode ('single' or 'multi')
 * @returns {Promise<object>} Job object
 */
export async function createJob(file, mode = 'single') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', mode);

  const response = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create job');
  }

  return response.json();
}

/**
 * Get job status by ID
 * @param {string} jobId - Job ID
 * @returns {Promise<object>} Job object
 */
export async function getJob(jobId) {
  const response = await fetch(`${API_URL}/api/jobs/${jobId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Job not found');
    }
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get job');
  }

  return response.json();
}

/**
 * Get all jobs
 * @param {number} limit - Maximum number of jobs to return
 * @returns {Promise<Array>} Array of job objects
 */
export async function getJobs(limit = 20) {
  const response = await fetch(`${API_URL}/api/jobs?limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get jobs');
  }

  return response.json();
}

/**
 * Get model download URL
 * @param {string} jobId - Job ID
 * @returns {string} Download URL
 */
export function getModelUrl(jobId) {
  return `${API_URL}/api/jobs/${jobId}/model.glb`;
}

export async function downloadModel(jobId) {
  const url = getModelUrl(jobId);
  
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${jobId}.glb`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Delete a job
 * @param {string} jobId - Job ID
 * @returns {Promise<object>} Response
 */
export async function deleteJob(jobId) {
  const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete job');
  }

  return response.json();
}

/**
 * Check API health
 * @returns {Promise<object>} Health status
 */
export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
