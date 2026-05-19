// utils/validation.js

/*
|--------------------------------------------------------------------------
| EMAIL VALIDATION
|--------------------------------------------------------------------------
*/

export const validateEmail = (email) => {
  const trimmedEmail = email?.trim();

  if (!trimmedEmail) {
    return "Email address is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| PASSWORD VALIDATION
|--------------------------------------------------------------------------
|
| Rules:
| - Minimum 8 characters
| - At least 1 uppercase
| - At least 1 lowercase
| - At least 1 number
| - At least 1 special character
|
*/

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    return "Password must contain at least one special character";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| NAME VALIDATION
|--------------------------------------------------------------------------
*/

export const validateName = (name) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return "Full name is required";
  }

  if (trimmedName.length < 2) {
    return "Name must contain at least 2 characters";
  }

  if (trimmedName.length > 50) {
    return "Name cannot exceed 50 characters";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| AVATAR VALIDATION
|--------------------------------------------------------------------------
*/

export const validateAvatar = (file) => {
  // avatar optional
  if (!file) return "";

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Avatar must be JPG, PNG, or WEBP format";
  }

  // 5MB
  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return "Avatar size must be less than 5MB";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| RESUME VALIDATION
|--------------------------------------------------------------------------
*/

export const validateResume = (file) => {
  if (!file) return "";

  const allowedTypes = [
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Resume must be a PDF document";
  }

  // 10MB
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    return "Resume size must be less than 10MB";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| JOB VALIDATION
|--------------------------------------------------------------------------
*/

export const validateJobForm = (values) => {
  if (!values?.title?.trim()) {
    return "Job title is required";
  }

  if (!values?.description?.trim()) {
    return "Job description is required";
  }

  if (!values?.requirements?.trim()) {
    return "Job requirements are required";
  }

  if (!values?.type?.trim()) {
    return "Job type is required";
  }

  return "";
};