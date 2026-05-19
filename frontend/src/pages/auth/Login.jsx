import React, { useState } from "react";
import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

import { validateEmail } from "../../utils/helper";

import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      rememberMe: false,
    });

  const [formState, setFormState] =
    useState({
      loading: false,
      error: {},
      showPassword: false,
      success: false,
    });

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (formState.error[name]) {
      setFormState((prev) => ({
        ...prev,
        error: {
          ...prev.error,
          [name]: "",
        },
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    const emailError =
      validateEmail(formData.email);

    if (emailError) {
      errors.email = emailError;
    }

    if (!formData.password) {
      errors.password =
        "Password is required";
    }

    setFormState((prev) => ({
      ...prev,
      error: errors,
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
    const response = await axiosInstance.post(
      API_PATHS.AUTH.LOGIN,
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      }
    );

    console.log("LOGIN RESPONSE:", response.data);

    const token = response?.data?.token;

    const loggedInUser =
      response?.data?.user;

    // IMPORTANT
    if (!token || !loggedInUser) {
      throw new Error(
        "Invalid login response"
      );
    }

    // SAVE AUTH
    login(loggedInUser, token);

    // SUCCESS UI
    setFormState((prev) => ({
      ...prev,
      loading: false,
      success: true,
      error: {},
    }));

    // REDIRECT BASED ON ROLE
// REDIRECT BASED ON ROLE

if (
  loggedInUser.role ===
  "admin"
) {

  navigate(
    "/admin-dashboard",
    { replace: true }
  );

} else if (
  loggedInUser.role ===
  "admin"
) {

  navigate(
    "/admin-dashboard",
    { replace: true }
  );

} else if (
  loggedInUser.role ===
  "employer"
) {

  navigate(
    "/employer-dashboard",
    { replace: true }
  );

} else if (
  loggedInUser.role ===
  "jobseeker"
) {

  navigate(
    "/find-jobs",
    { replace: true }
  );

} else {

  navigate("/", {
    replace: true,
  });

}

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    setFormState((prev) => ({
      ...prev,
      loading: false,
      error: {
        submit:
          err?.response?.data
            ?.message ||
          err.message ||
          "Login failed",
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
            Welcome Back!
          </h2>

          <p className="mt-3 text-slate-300">
            Login successful.
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.25),transparent_30%)]"></div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize:
              "40px 40px",
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
          className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl lg:grid-cols-2"
        >

          {/* LEFT */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles size={14} />
                CareerLink
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight">
                Your Career Journey
                Starts Here
              </h1>

              <p className="mt-5 max-w-md text-base leading-8 text-indigo-100">
                Connect with recruiters,
                discover opportunities,
                and grow your
                professional career
                through CareerLink.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Find top tech opportunities",
                "Trusted by recruiters & companies",
                "Secure authentication & profile management",
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

            <div className="mx-auto w-full max-w-md">

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
                  Welcome Back
                </h1>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Sign in to continue
                  your journey and
                  access your
                  personalized dashboard.
                </p>
              </div>

              {/* Error */}
              {formState.error.submit && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <span>
                    {
                      formState.error
                        .submit
                    }
                  </span>
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter your email"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type={
                        formState.showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      autoComplete="current-password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {formState.showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={
                        formData.rememberMe
                      }
                      onChange={
                        handleInputChange
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />

                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* BUTTON */}
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
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* FOOTER */}
                <p className="pt-2 text-center text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Create Account
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

export default Login;