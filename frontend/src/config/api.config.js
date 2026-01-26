/**
 * API Configuration
 * Automatically detects environment and uses the correct backend URL
 */

// Detect if we're in production (HTTPS or non-localhost domain)
const isProduction = window.location.protocol === 'https:' || 
                     (window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1');

// Production backend URL - update this to match your actual backend URL
// If your backend is on Render.com, it should be something like:
// https://your-backend-app.onrender.com
const PRODUCTION_API_URL = 'https://chat-app-1-c1ml.onrender.com';
const DEVELOPMENT_API_URL = 'http://localhost:3000';

// Get API URL from environment variable, or use smart defaults
const getApiUrl = () => {
  // First, check if VITE_API_URL is explicitly set (build-time env var)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    return envApiUrl.trim();
  }
  
  // If in production (HTTPS or non-localhost), use production backend
  if (isProduction) {
    return PRODUCTION_API_URL;
  }
  
  // Otherwise, use development backend
  return DEVELOPMENT_API_URL;
};

export const API_URL = getApiUrl();

// Log for debugging
console.log('🌐 API Configuration:', {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  isProduction,
  apiUrl: API_URL,
  envVar: import.meta.env.VITE_API_URL || 'not set'
});
