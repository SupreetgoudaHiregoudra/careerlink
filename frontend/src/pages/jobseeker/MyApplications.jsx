import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  Briefcase,
  Calendar,
  ChevronDown,
  Clock3,
  ExternalLink,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  UserCircle2,
  Menu,
  X,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import { useAuth } from "../../context/AuthContext";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import Brand from "../../components/Brand";

const statusStyles = {
  Applied:
    "bg-blue-500/15 text-blue-300 border border-blue-500/20",

  Reviewing:
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",

  Shortlisted:
    "bg-violet-500/15 text-violet-300 border border-violet-500/20",

  Selected:
    "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",

  Rejected:
    "bg-rose-500/15 text-rose-300 border border-rose-500/20",
};

const MyApplications = () => {
  const navigate = useNavigate();

  const { user, logout } =
    useAuth();

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  ] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const profileMenuRef =
    useRef(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen)
      return undefined;

    const handleClickOutside = (
      event
    ) => {
      if (
        !profileMenuRef.current?.contains(
          event.target
        )
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isProfileMenuOpen]);

  const fetchApplications =
    async () => {
      setLoading(true);

      try {
        const res =
          await axiosInstance.get(
            API_PATHS.APPLICATIONS
              .GET_USER_APPLICATIONS
          );

        if (res.data?.success) {
          setApplications(
            res.data.applications || []
          );
        }
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_30%)]" />

      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize:
              "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 lg:grid lg:grid-cols-[290px_1fr]">

        {/* Desktop Sidebar */}

        <aside className="hidden lg:flex min-h-screen w-[280px] flex-col border-r border-white/10 bg-black/20 backdrop-blur-2xl">

          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <Brand />
          </div>

          <nav className="space-y-2 p-4">

            <button
              onClick={() =>
                navigate("/find-jobs")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Browse Jobs
            </button>

            <button
              onClick={() =>
                navigate("/saved-jobs")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Heart className="h-5 w-5" />
              Saved Jobs
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-violet-500/20"
            >
              <Briefcase className="h-5 w-5" />
              My Applications
            </button>

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <UserCircle2 className="h-5 w-5" />
              Profile
            </button>

          </nav>

          <div className="mt-auto border-t border-white/10 p-4">

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>

          </div>
        </aside>

        {/* Mobile Sidebar */}

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">

            <div
              className="absolute inset-0 bg-black/70"
              onClick={() =>
                setIsSidebarOpen(false)
              }
            />

            <aside className="relative flex h-full w-[280px] flex-col border-r border-white/10 bg-[#0b1120] backdrop-blur-2xl">

              <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

                <Brand />

                <button
                  onClick={() =>
                    setIsSidebarOpen(false)
                  }
                  className="rounded-xl p-2 hover:bg-white/10"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

              </div>

              <nav className="space-y-2 p-4">

                <button
                  onClick={() => {
                    navigate("/find-jobs");
                    setIsSidebarOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Browse Jobs
                </button>

                <button
                  onClick={() => {
                    navigate("/saved-jobs");
                    setIsSidebarOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  <Heart className="h-5 w-5" />
                  Saved Jobs
                </button>

                <button
                  className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-medium text-white"
                >
                  <Briefcase className="h-5 w-5" />
                  My Applications
                </button>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsSidebarOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  <UserCircle2 className="h-5 w-5" />
                  Profile
                </button>

              </nav>
            </aside>
          </div>
        )}

        {/* Main */}

        <div className="min-w-0">

          {/* Header */}

          <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-black/30 px-6 backdrop-blur-2xl">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setIsSidebarOpen(true)
                }
                className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>

              <div>
                <h1 className="text-3xl font-black text-white">
                  My Applications
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Track all your job applications
                </p>
              </div>

            </div>

            {/* Profile */}

            <div
              className="relative"
              ref={profileMenuRef}
            >
              <button
                onClick={() =>
                  setIsProfileMenuOpen(
                    (prev) => !prev
                  )
                }
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
              >
                {user?.avatar ? (
                  <img
                    src={resolveMediaUrl(
                      user.avatar
                    )}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-10 w-10 text-indigo-400" />
                )}

                <div className="hidden text-left md:block">

                  <p className="text-sm font-semibold text-white">
                    {user?.name ||
                      "Job Seeker"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Job Seeker
                  </p>

                </div>

                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                  <button
                    onClick={() => {
                      navigate("/profile");

                      setIsProfileMenuOpen(
                        false
                      );
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();

                      navigate("/login");

                      setIsProfileMenuOpen(
                        false
                      );
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-rose-400 transition hover:bg-rose-500/10"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          </header>

          {/* Content */}

          <main className="px-4 py-6 md:px-8">

            <div className="mb-8">

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                Career Progress
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Track Your Applications
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-slate-400 leading-relaxed">
                Stay updated on your application progress and recruiter responses.
              </p>

            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                No applications found.
              </div>
            ) : (
              <div className="space-y-6">

                {applications.map(
                  (application) => {
                    const job =
                      application.job;

                    return (
                      <div
                        key={
                          application._id
                        }
                        className="rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-7 transition hover:border-indigo-500/30 hover:bg-white/[0.07]"
                      >

                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                          {/* Left */}

                          <div className="flex gap-5">

                            <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/10 bg-black/20 shrink-0">

                              {job?.company
                                ?.companyLogo ? (
                                <img
                                  src={resolveMediaUrl(
                                    job.company.companyLogo
                                  )}
                                  alt="Company"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Briefcase className="h-8 w-8 text-slate-500" />
                                </div>
                              )}

                            </div>

                            <div>

                              <h3 className="text-2xl font-bold text-white">
                                {job?.title}
                              </h3>

                              <p className="mt-1 text-slate-400">
                                {job?.company?.companyName}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">

                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-indigo-400" />
                                  {job?.location}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-indigo-400" />
                                  Applied on{" "}
                                  {new Date(
                                    application.createdAt
                                  ).toLocaleDateString()}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Clock3 className="h-4 w-4 text-indigo-400" />
                                  {job?.type}
                                </div>

                              </div>
                            </div>
                          </div>

                          {/* Right */}

                          <div className="flex flex-col items-start gap-4 xl:items-end">

                            <div
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                statusStyles[
                                  application.status
                                ] ||
                                "bg-white/10 text-white"
                              }`}
                            >
                              {application.status}
                            </div>

                            <button
                              onClick={() =>
                                navigate(
                                  `/job/${job?._id}`
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                              View Job
                              <ExternalLink className="h-4 w-4" />
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;