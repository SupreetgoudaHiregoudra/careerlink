// utils/mediaUrl.js

import { BASE_URL } from "./apiPaths";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

/*
|--------------------------------------------------------------------------
| GET API ORIGIN
|--------------------------------------------------------------------------
|
| Example:
| BASE_URL = https://careerlink-backend.vercel.app
|
| Returns:
| https://careerlink-backend.vercel.app
|
*/

const getBaseOrigin = () => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return window.location.origin;
  }
};

/*
|--------------------------------------------------------------------------
| RESOLVE MEDIA URL
|--------------------------------------------------------------------------
|
| Handles:
| - Full URLs
| - Relative URLs
| - Upload paths
| - Blob URLs
| - Base64 images
|
*/

export const resolveMediaUrl = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  const raw = value.trim();

  if (!raw) {
    return "";
  }

  /*
  |--------------------------------------------------------------------------
  | BLOB / BASE64
  |--------------------------------------------------------------------------
  */

  if (
    raw.startsWith("blob:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  const baseOrigin = getBaseOrigin();

  /*
  |--------------------------------------------------------------------------
  | FULL ABSOLUTE URL
  |--------------------------------------------------------------------------
  */

  if (ABSOLUTE_URL_REGEX.test(raw)) {
    try {
      const parsed = new URL(raw);

      /*
      |--------------------------------------------------------------------------
      | FIX BROKEN UPLOAD URLS
      |--------------------------------------------------------------------------
      |
      | Example:
      | Frontend URL:
      | https://careerlink.vercel.app/uploads/file.png
      |
      | Convert to:
      | https://careerlink-backend.vercel.app/uploads/file.png
      |
      */

      if (
        parsed.pathname.startsWith("/uploads/") &&
        parsed.origin === window.location.origin &&
        parsed.origin !== baseOrigin
      ) {
        return `${baseOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      return parsed.href;
    } catch {
      return raw;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RELATIVE PATHS
  |--------------------------------------------------------------------------
  */

  if (raw.startsWith("/")) {
    return `${baseOrigin}${raw}`;
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL STRING PATH
  |--------------------------------------------------------------------------
  */

  return `${baseOrigin}/${raw}`;
};

export default resolveMediaUrl;