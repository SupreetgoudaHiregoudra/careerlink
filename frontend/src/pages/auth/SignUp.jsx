import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BriefcaseBusiness,
  ShieldCheck,
  Camera,
} from "lucide-react";

import {
  validateAvatar,
  validatePassword,
} from "../../utils/helper";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import uploadImage from "../../utils/uploadImage";

import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      avatar: null,
      role: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [formState, setFormState] =
    useState({
      loading: false,
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
      avatarPreview: null,
      success: false,
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: "",
        },
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          role: "",
        },
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const error =
        validateAvatar(file);

      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            avatar: error,
          },
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      const reader =
        new FileReader();

      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview:
            e.target.result,
          errors: {
            ...prev.errors,
            avatar: "",
          },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.role)
      errors.role =
        "Please select a role";

    if (!formData.fullName)
      errors.fullName =
        "Enter full name";

    if (!formData.email)
      errors.email = "Enter email";

    const passwordError =
      validatePassword(
        formData.password
      );

    if (passwordError)
      errors.password =
        passwordError;

    if (!formData.confirmPassword) {
      errors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match";
    }

    setFormState((prev) => ({
      ...prev,
      errors,
    }));

    return (
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      let avatarUrl = "";

      if (formData.avatar) {
        const imgUploadRes =
          await uploadImage(
            formData.avatar
          );

        avatarUrl =
          imgUploadRes.imageUrl ||
          "";
      }

      const response =
        await axiosInstance.post(
          API_PATHS.AUTH.REGISTER,
          {
            avatar:
              avatarUrl || "",
            role: formData.role,
            name: formData.fullName,
            email: formData.email,
            password:
              formData.password,
          }
        );

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      const { token } =
        response.data;

      if (token) {
        login(response.data.user, token);

       const targetPath =
  response?.data?.user?.role ===
  "employer"
    ? "/employer-dashboard"
    : "/find-jobs";

        setTimeout(() => {
          navigate(targetPath, {
            replace: true,
          });
        }, 1800);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data
              ?.message ||
            "Registration failed. Please try again.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-2xl"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-white">
            Account Created!
          </h2>

          <p className="mt-3 text-slate-300">
            Welcome to CareerLink.
            Redirecting to your
            dashboard...
          </p>

          <div className="mt-6 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.22),transparent_30%)]"></div>

      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="grid w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl lg:grid-cols-2"
        >
          
          {/* LEFT */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white">
            
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles size={14} />
                CareerLink
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight">
                Build Your Professional Future
              </h1>

              <p className="mt-5 max-w-md text-base leading-8 text-indigo-100">
                Join thousands of recruiters
                and job seekers using
                CareerLink to grow careers
                and hire top talent.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Verified recruiters & companies",
                "Smart career matching",
                "Secure profile management",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <ShieldCheck size={18} />
                  </div>

                  <span className="text-sm text-indigo-100">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white px-6 py-10 md:px-10">
            
            <div className="mx-auto max-w-md">
              
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    CareerLink
                  </h2>

                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Career Platform
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mt-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  Create Account
                </h1>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Start your journey with
                  CareerLink and unlock
                  career opportunities.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    {formState.avatarPreview ? (
                      <img
                        src={
                          formState.avatarPreview
                        }
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <input
                      type="file"
                      id="avatar"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={
                        handleAvatarChange
                      }
                      className="hidden"
                    />

                    <label
                      htmlFor="avatar"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <Camera className="h-4 w-4" />
                      Upload Photo
                    </label>

                    <p className="mt-2 text-xs text-slate-500">
                      JPG, PNG or WEBP
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Select Role
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    
                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          "jobseeker"
                        )
                      }
                      className={`rounded-2xl border-2 p-5 transition-all ${
                        formData.role ===
                        "jobseeker"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <UserCheck className="mx-auto h-8 w-8" />

                      <p className="mt-3 font-semibold">
                        Job Seeker
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          "employer"
                        )
                      }
                      className={`rounded-2xl border-2 p-5 transition-all ${
                        formData.role ===
                        "employer"
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 hover:border-violet-300"
                      }`}
                    >
                      <Building2 className="mx-auto h-8 w-8" />

                      <p className="mt-3 font-semibold">
                        Employer
                      </p>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <InputField
                  icon={User}
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your full name"
                  error={
                    formState.errors
                      .fullName
                  }
                />

                {/* Email */}
                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your email"
                  error={
                    formState.errors.email
                  }
                />

                {/* Password */}
                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={
                    handleInputChange
                  }
                  show={
                    formState.showPassword
                  }
                  toggle={() =>
                    setFormState(
                      (
                        prev
                      ) => ({
                        ...prev,
                        showPassword:
                          !prev.showPassword,
                      })
                    )
                  }
                  error={
                    formState.errors
                      .password
                  }
                />

                {/* Confirm */}
                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={
                    handleInputChange
                  }
                  show={
                    formState.showConfirmPassword
                  }
                  toggle={() =>
                    setFormState(
                      (
                        prev
                      ) => ({
                        ...prev,
                        showConfirmPassword:
                          !prev.showConfirmPassword,
                      })
                    )
                  }
                  error={
                    formState.errors
                      .confirmPassword
                  }
                />

                {/* Submit Error */}
                {formState.errors
                  .submit && (
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {
                        formState.errors
                          .submit
                      }
                    </span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    formState.loading
                  }
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                >
                  {formState.loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* Reusable Input */
const InputField = ({
  icon: Icon,
  label,
  error,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">
      <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      <input
        {...props}
        className={`h-14 w-full rounded-2xl border bg-slate-50 pl-12 pr-4 text-sm outline-none transition ${
          error
            ? "border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
        } focus:ring-4`}
      />
    </div>

    {error && (
      <p className="mt-2 flex items-center gap-2 text-sm text-rose-600">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
);

/* Password Field */
const PasswordField = ({
  label,
  show,
  toggle,
  error,
  ...props
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">
      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      <input
        type={show ? "text" : "password"}
        {...props}
        className={`h-14 w-full rounded-2xl border bg-slate-50 pl-12 pr-12 text-sm outline-none transition ${
          error
            ? "border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
        } focus:ring-4`}
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {show ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>

    {error && (
      <p className="mt-2 flex items-center gap-2 text-sm text-rose-600">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
);

export default SignUp;