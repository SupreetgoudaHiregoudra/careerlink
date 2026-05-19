const envBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

const developmentApiUrl =
  "http://localhost:3000";

export const BASE_URL =
  envBaseUrl ||
  developmentApiUrl;

/*
|--------------------------------------------------------------------------
| API PATHS
|--------------------------------------------------------------------------
*/

export const API_PATHS = {
  // =========================================
  // AUTH
  // =========================================

  AUTH: {
    REGISTER:
      "/api/auth/register",

    LOGIN:
      "/api/auth/login",

    FORGOT_PASSWORD:
      "/api/auth/forgot-password",

    RESET_PASSWORD:
      "/api/auth/reset-password",

    GET_PROFILE:
      "/api/auth/me",

    UPDATE_PROFILE:
      "/api/auth/update-profile",

    DELETE_RESUME:
      "/api/auth/resume",
  },

  // =========================================
  // ADMIN
  // =========================================

  ADMIN: {
    GET_STATS:
      "/api/admin/stats",

    GET_USERS:
      "/api/admin/users",

    DELETE_USER: (id) =>
      `/api/admin/users/${id}`,

    GET_JOBS:
      "/api/admin/jobs",

    DELETE_JOB: (id) =>
      `/api/admin/jobs/${id}`,
  },

  // =========================================
  // DASHBOARD
  // =========================================

  DASHBOARD: {
    OVERVIEW:
      "/api/analytics/overview",

    PUBLIC_STATS:
      "/api/analytics/public-stats",
  },

  // =========================================
  // JOBS
  // =========================================

  JOBS: {
    GET_ALL_JOBS:
      "/api/jobs",

    POST_JOB:
      "/api/jobs",

    GET_JOBS_EMPLOYER:
      "/api/jobs/get-jobs-employer",

    GET_JOB_BY_ID: (id) =>
      `/api/jobs/${id}`,

    UPDATE_JOB: (id) =>
      `/api/jobs/${id}`,

    TOGGLE_CLOSE: (id) =>
      `/api/jobs/${id}/toggle-close`,

    DELETE_JOB: (id) =>
      `/api/jobs/${id}`,

    SAVE_JOB: (id) =>
      `/api/saved-jobs/${id}`,

    UNSAVE_JOB: (id) =>
      `/api/saved-jobs/${id}`,

    GET_SAVED_JOBS:
      "/api/saved-jobs/my",
  },

  // =========================================
  // APPLICATIONS
  // =========================================

  APPLICATIONS: {
    APPLY_TO_JOB: (id) =>
      `/api/applications/${id}`,

    GET_ALL_APPLICATIONS:
      (id) =>
        `/api/applications/job/${id}`,

    GET_USER_APPLICATIONS:
      "/api/applications/my",

    UPDATE_STATUS: (id) =>
      `/api/applications/${id}/status`,
  },

  // =========================================
  // IMAGE
  // =========================================

  IMAGE: {
    UPLOAD_IMAGE:
      "/api/auth/upload-image",
  },
};

export default API_PATHS;