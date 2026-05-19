// utils/uploadImage.js

import axiosInstance from "./axiosInstance";

import { API_PATHS } from "./apiPaths";

import { resolveMediaUrl } from "./mediaUrl";

/*
|--------------------------------------------------------------------------
| IMAGE / FILE UPLOAD UTILITY
|--------------------------------------------------------------------------
|
| Handles:
| - Profile image uploads
| - Company logo uploads
| - Resume uploads
| - Multipart form requests
|
*/

const uploadImage = async (file) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  if (!file) {
    throw new Error("No file selected");
  }

  /*
  |--------------------------------------------------------------------------
  | FORM DATA
  |--------------------------------------------------------------------------
  */

  const formData = new FormData();

  formData.append("image", file);

  try {
    /*
    |--------------------------------------------------------------------------
    | API REQUEST
    |--------------------------------------------------------------------------
    */

    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    /*
    |--------------------------------------------------------------------------
    | RESOLVE FINAL URL
    |--------------------------------------------------------------------------
    */

    const rawUrl =
      response?.data?.imageUrl ||
      response?.data?.url ||
      "";

    const imageUrl =
      resolveMediaUrl(rawUrl);

    /*
    |--------------------------------------------------------------------------
    | RETURN RESPONSE
    |--------------------------------------------------------------------------
    */

    return {
      ...response.data,

      imageUrl,
    };
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | LOG ERROR
    |--------------------------------------------------------------------------
    */

    console.error(
      "Error uploading file:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | THROW CLEAN ERROR
    |--------------------------------------------------------------------------
    */

    throw (
      error?.response?.data ||
      error ||
      new Error("Upload failed")
    );
  }
};

export default uploadImage;