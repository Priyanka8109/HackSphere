/**
 * API Endpoint Configuration (Experiment 7)
 * - In Docker: Defaults to relative paths (/api/...) proxied by Nginx to the backend container
 * - In Local Dev: Proxied via vite.config.js to http://localhost:5000
 * - In Direct Mode: Can be overridden by setting VITE_API_BASE_URL
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE}/api/auth/register`,
  LOGIN: `${API_BASE}/api/auth/login`,

  // User & Profile
  PROFILE: `${API_BASE}/api/users/profile`,

  // Admin
  ADMIN_USERS: `${API_BASE}/api/admin/users`,

  // Hackathons
  HACKATHONS: `${API_BASE}/api/hackathons`,
};

export default API_ENDPOINTS;
