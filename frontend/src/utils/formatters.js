/**
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.4 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g, "2.5s" or "1m 30s")
 */
export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Truncate job ID for display
 * @param {string} jobId - Full job ID
 * @returns {string} Shortened ID
 */
export function formatJobId(jobId) {
  return jobId.substring(0, 8);
}
