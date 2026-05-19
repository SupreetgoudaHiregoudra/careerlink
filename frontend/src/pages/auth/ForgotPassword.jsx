import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  validateEmail,
  validatePassword,
} from "../../utils/helper";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") || "";

  const isResetMode = Boolean(token);

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const [resetLink, setResetLink] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const title = useMemo(() => {
    return isResetMode
      ? "Reset Password"
      : "Forgot Password";
  }, [isResetMode]);

  const handleGenerateLink = async (
    event
  ) => {
    event.preventDefault();

    const emailError =
      validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);

    setError("");

    setSuccess("");

    try {
      const res =
        await axiosInstance.post(
          API_PATHS.AUTH.FORGOT_PASSWORD,
          { email }
        );

      setSuccess(
        "Reset link generated successfully."
      );

      setResetLink(
        res.data?.resetUrl || ""
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to generate reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    event
  ) => {
    event.preventDefault();

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    setLoading(true);

    setError("");

    setSuccess("");

    try {
      const res =
        await axiosInstance.post(
          API_PATHS.AUTH.RESET_PASSWORD,
          {
            token,
            password,
          }
        );

      setSuccess(
        res.data?.message ||
          "Password reset successful"
      );

      setPassword("");

      setConfirmPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl lg:grid-cols-2">
          
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white">
            
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles size={14} />
                CareerLink Security
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight">
                Secure Your Account
              </h1>

              <p className="mt-5 max-w-md text-base leading-8 text-indigo-100">
                Recover access to your CareerLink
                profile and continue exploring
                career opportunities seamlessly.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Encrypted authentication flow",
                "Safe password recovery process",
                "Trusted by job seekers & recruiters",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck size={18} />
                  </div>

                  <span className="text-sm text-indigo-100">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white px-6 py-10 md:px-10">
            
            <div className="mx-auto w-full max-w-md">
              
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  CareerLink
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                  {title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {isResetMode
                    ? "Create a strong password to secure your account."
                    : "Enter your registered email address to receive a password reset link."}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {!isResetMode ? (
                <form
                  className="mt-8 space-y-5"
                  onSubmit={handleGenerateLink}
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Reset Link"
                    )}
                  </button>

                  {resetLink && (
                    <a
                      href={resetLink}
                      className="block break-all rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
                    >
                      {resetLink}
                    </a>
                  )}
                </form>
              ) : (
                <form
                  className="mt-8 space-y-5"
                  onSubmit={handleResetPassword}
                >
                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      New Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}

              <p className="mt-8 text-center text-sm text-slate-600">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;