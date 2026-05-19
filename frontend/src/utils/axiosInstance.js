// utils/axiosInstance.js

import axios from "axios";

import { BASE_URL } from "./apiPaths";

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

const axiosInstance = axios.create({
  baseURL: BASE_URL,

  timeout: 80000,

  headers: {
    "Content-Type": "application/json",

    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Automatically attach JWT token
|
*/

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| Handles:
| - Unauthorized users
| - Token expiration
| - Server errors
| - Timeout errors
|
*/

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    // SERVER RESPONDED
    if (error.response) {
      const status = error.response.status;

      /*
      |--------------------------------------------------------------------------
      | 401 UNAUTHORIZED
      |--------------------------------------------------------------------------
      */

      if (status === 401) {
        const hasToken = Boolean(
          localStorage.getItem("token")
        );

        // avoid redirect loop
        if (hasToken) {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          // redirect to login
          window.location.href = "/login";
        }
      }

      /*
      |--------------------------------------------------------------------------
      | 403 FORBIDDEN
      |--------------------------------------------------------------------------
      */

      else if (status === 403) {
        console.error(
          "Access denied. You do not have permission."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | 404 NOT FOUND
      |--------------------------------------------------------------------------
      */

      else if (status === 404) {
        console.error(
          "Requested resource was not found."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | 500 SERVER ERROR
      |--------------------------------------------------------------------------
      */

      else if (status >= 500) {
        console.error(
          "Server error. Please try again later."
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NETWORK / TIMEOUT ERRORS
    |--------------------------------------------------------------------------
    */

    else if (error.code === "ECONNABORTED") {
      console.error(
        "Request timeout. Please try again."
      );
    }

    else if (error.message === "Network Error") {
      console.error(
        "Unable to connect to server."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;