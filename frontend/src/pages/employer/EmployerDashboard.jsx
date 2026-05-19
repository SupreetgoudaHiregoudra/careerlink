import { useEffect, useMemo, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Briefcase,
  ClipboardList,
  Users,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  Settings,
  CheckCircle2,
  Clock3,
  UserCircle2,
  ArrowUpRight,
  ChevronDown,
  X,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import { useAuth } from "../../context/AuthContext";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import Brand from "../../components/Brand";

const StatCard = ({
  label,
  value,
  icon,
  gradient,
  subtitle,
}) => (
  <div
    className={`relative overflow-hidden rounded-[28px] p-5 text-white shadow-2xl ${gradient}`}
  >
    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/80">
          {label}
        </p>

        <h2 className="mt-3 text-4xl font-black">
          {value}
        </h2>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
          <TrendingUp className="h-4 w-4" />
          {subtitle}
        </div>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
        {icon}
      </div>
    </div>
  </div>
);

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const getRelativeDays = (
  isoDate
) => {
  if (!isoDate)
    return "Recently";

  const then = new Date(
    isoDate
  ).getTime();

  const now = Date.now();

  const days = Math.max(
    0,
    Math.floor(
      (now - then) /
        (1000 *
          60 *
          60 *
          24)
    )
  );

  return days === 0
    ? "Today"
    : `${days} day${
        days > 1 ? "s" : ""
      } ago`;
};

const sidebarLinks = [
  {
    to: "/employer-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    to: "/post-job",
    label: "Post Job",
    icon: Plus,
  },
  {
    to: "/manage-jobs",
    label: "Manage Jobs",
    icon: ClipboardList,
  },
  {
    to: "/company-profile",
    label: "Company Profile",
    icon: Building2,
  },
];

const EmployerDashboard = () => {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  const [jobs, setJobs] =
    useState([]);

  const [
    recentApplications,
    setRecentApplications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    isMobileProfileMenuOpen,
    setIsMobileProfileMenuOpen,
  ] = useState(false);

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const mobileProfileMenuRef =
    useRef(null);

  const desktopProfileMenuRef =
    useRef(null);

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        setLoading(true);

        try {
          const res =
            await axiosInstance.get(
              API_PATHS.JOBS
                .GET_JOBS_EMPLOYER
            );

         let employerJobs = [];

if (Array.isArray(res.data)) {
  employerJobs = res.data;
} else if (
  Array.isArray(res.data.jobs)
) {
  employerJobs = res.data.jobs;
} else if (
  Array.isArray(res.data.data)
) {
  employerJobs = res.data.data;
}

setJobs(employerJobs);

          if (
            employerJobs.length > 0
          ) {
            const appRequests =
              employerJobs
                .slice(0, 8)
                .map((job) =>
                  axiosInstance.get(
                    API_PATHS
                      .APPLICATIONS
                      .GET_ALL_APPLICATIONS(
                        job._id
                      )
                  )
                );

            const appResponses =
              await Promise.allSettled(
                appRequests
              );

            const allApplications =
  appResponses
    .filter(
      (result) =>
        result.status ===
        "fulfilled"
    )
    .flatMap(
      (result) =>
        result.value?.data
          ?.applications || []
    )
                .sort(
                  (a, b) =>
                    new Date(
                      b.createdAt ||
                        0
                    ) -
                    new Date(
                      a.createdAt ||
                        0
                    )
                )
                .slice(0, 4);

            setRecentApplications(
              allApplications
            );
          } else {
            setRecentApplications(
              []
            );
          }
        } catch (error) {
          toast.error(
            error?.response?.data
              ?.message ||
              "Failed to load dashboard"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (
      !isMobileProfileMenuOpen
    )
      return undefined;

    const handleClickOutside = (
      event
    ) => {
      if (
        !mobileProfileMenuRef.current?.contains(
          event.target
        )
      ) {
        setIsMobileProfileMenuOpen(
          false
        );
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
  }, [
    isMobileProfileMenuOpen,
  ]);

  useEffect(() => {
    if (
      !isDesktopProfileMenuOpen
    )
      return undefined;

    const handleClickOutside = (
      event
    ) => {
      if (
        !desktopProfileMenuRef.current?.contains(
          event.target
        )
      ) {
        setIsDesktopProfileMenuOpen(
          false
        );
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
  }, [
    isDesktopProfileMenuOpen,
  ]);

  const stats = useMemo(() => {

  const safeJobs = Array.isArray(jobs)
    ? jobs
    : [];

  const safeApplications =
    Array.isArray(
      recentApplications
    )
      ? recentApplications
      : [];

  const activeJobs =
    safeJobs.filter(
      (job) => !job.isClosed
    ).length;

  const totalApplications =
    safeJobs.reduce(
      (sum, job) =>
        sum +
        (job.applicationCount ||
          0),
      0
    );

  const hired =
    safeApplications.filter(
      (application) =>
        application?.status?.toLowerCase() ===
        "accepted"
    ).length;

  return {
    activeJobs,
    totalApplications,
    hired,
  };
}, [jobs, recentApplications]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
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

      <div className="relative z-10 lg:grid lg:grid-cols-[280px_1fr]">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex min-h-screen flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
          
          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <Link to="/">
              <Brand />
            </Link>
          </div>

          <nav className="space-y-2 p-4">
            {sidebarLinks.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      item.active
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-violet-500/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              }
            )}
          </nav>

          <div className="mt-auto border-t border-white/10 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            
            <button
              onClick={() =>
                setIsMobileSidebarOpen(
                  false
                )
              }
              className="absolute inset-0 bg-black/60"
            />

            <div className="relative h-full w-72 border-r border-white/10 bg-slate-950 p-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Brand />

                <button
                  onClick={() =>
                    setIsMobileSidebarOpen(
                      false
                    )
                  }
                  className="rounded-xl p-2 hover:bg-white/10"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <nav className="mt-5 space-y-2">
                {sidebarLinks.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <Link
                        key={
                          item.to
                        }
                        to={item.to}
                        onClick={() =>
                          setIsMobileSidebarOpen(
                            false
                          )
                        }
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                          item.active
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {
                          item.label
                        }
                      </Link>
                    );
                  }
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0">
          
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-5 backdrop-blur-xl md:px-8">
            
            <div>
              <button
                onClick={() =>
                  setIsMobileSidebarOpen(
                    true
                  )
                }
                className="lg:hidden"
              >
                <Brand />
              </button>

              <div className="hidden lg:block">

                <h1 className="mt-3 text-2xl font-black">
                  Welcome Back,
                  {` `}
                  {user?.name ||
                    "Employer"}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Here's what’s
                  happening with
                  your jobs today
                </p>
              </div>
            </div>

            {/* Profile */}
            <div
              className="relative"
              ref={
                desktopProfileMenuRef
              }
            >
              <button
                onClick={() =>
                  setIsDesktopProfileMenuOpen(
                    (
                      prev
                    ) => !prev
                  )
                }
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
              >
                {user?.avatar ? (
                  <img
                    src={resolveMediaUrl(
                      user.avatar
                    )}
                    alt={
                      user.name
                    }
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-10 w-10 text-indigo-400" />
                )}

                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-white">
                    {user?.name ||
                      "Employer"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Employer
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {isDesktopProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                  
                  <button
                    onClick={() => {
                      navigate(
                        "/company-profile"
                      );

                      setIsDesktopProfileMenuOpen(
                        false
                      );
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();

                      setIsDesktopProfileMenuOpen(
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
          <section className="space-y-8 p-5 md:p-8">
            
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
                Loading Dashboard...
              </div>
            ) : (
              <>
                {/* Stats */}
                <section className="grid gap-5 md:grid-cols-3">
                  
                  <StatCard
                    label="Active Jobs"
                    value={
                      stats.activeJobs
                    }
                    subtitle="Open positions"
                    icon={
                      <Briefcase className="h-7 w-7" />
                    }
                    gradient="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500"
                  />

                  <StatCard
                    label="Applications"
                    value={
                      stats.totalApplications
                    }
                    subtitle="Total received"
                    icon={
                      <Users className="h-7 w-7" />
                    }
                    gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
                  />

                  <StatCard
                    label="Hired"
                    value={
                      stats.hired
                    }
                    subtitle="Candidates selected"
                    icon={
                      <CheckCircle2 className="h-7 w-7" />
                    }
                    gradient="bg-gradient-to-r from-violet-600 to-fuchsia-600"
                  />
                </section>

                {/* Grid */}
                <section className="grid gap-6 xl:grid-cols-2">
                  
                  {/* Jobs */}
                  <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Recent Job
                          Posts
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Your latest
                          published jobs
                        </p>
                      </div>

                      <Link
                        to="/manage-jobs"
                        className="text-sm font-semibold text-indigo-300 hover:text-white"
                      >
                        View all
                      </Link>
                    </div>

                    <div className="mt-6 space-y-4">
                      
                      {jobs.length ===
                      0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                          No jobs posted
                          yet.
                        </div>
                      ) : (
                        jobs
                          .slice(0, 3)
                          .map((job) => (
                            <div
                              key={
                                job._id
                              }
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                              <div className="flex items-center gap-4">
                                
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                                  <Briefcase className="h-6 w-6" />
                                </div>

                                <div>
                                  <h3 className="font-semibold text-white">
                                    {
                                      job.title
                                    }
                                  </h3>

                                  <p className="mt-1 text-sm text-slate-400">
                                    {
                                      job.location
                                    }{" "}
                                    •{" "}
                                    {formatDate(
                                      job.createdAt
                                    )}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  job.isClosed
                                    ? "bg-rose-500/10 text-rose-300"
                                    : "bg-emerald-500/10 text-emerald-300"
                                }`}
                              >
                                {job.isClosed
                                  ? "Closed"
                                  : "Active"}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Recent
                          Applications
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Latest
                          candidate
                          activity
                        </p>
                      </div>

                      <Activity className="h-6 w-6 text-indigo-300" />
                    </div>

                    <div className="mt-6 space-y-4">
                      
                      {recentApplications.length ===
                      0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                          No applications
                          yet.
                        </div>
                      ) : (
                        recentApplications.map(
                          (
                            application
                          ) => {
                            const applicantName =
                              application
                                ?.applicant
                                ?.name ||
                              "Applicant";

                            return (
                              <div
                                key={
                                  application._id
                                }
                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex items-center gap-4">
                                  
                                  {application
                                    ?.applicant
                                    ?.avatar ? (
                                    <img
                                      src={resolveMediaUrl(
                                        application
                                          .applicant
                                          .avatar
                                      )}
                                      alt={
                                        applicantName
                                      }
                                      className="h-12 w-12 rounded-2xl object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                                      <Users className="h-5 w-5" />
                                    </div>
                                  )}

                                  <div>
                                    <h3 className="font-semibold text-white">
                                      {
                                        applicantName
                                      }
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                      {application
                                        ?.job
                                        ?.title ||
                                        "Applied Job"}
                                    </p>
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                                  <Clock3 className="h-4 w-4" />
                                  {getRelativeDays(
                                    application?.createdAt
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Manage your
                      hiring workflow
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    
                    <Link
                      to="/post-job"
                      className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                        <Plus className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-white">
                        Post New Job
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Create and
                        publish new
                        opportunities
                      </p>
                    </Link>

                    <Link
                      to="/manage-jobs"
                      className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                        <ClipboardList className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-white">
                        Manage Jobs
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Edit, close,
                        and monitor
                        your listings
                      </p>
                    </Link>

                    <Link
                      to="/company-profile"
                      className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-violet-500/40 hover:bg-violet-500/10"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                        <Settings className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-white">
                        Company
                        Settings
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Update your
                        company
                        profile and
                        branding
                      </p>
                    </Link>
                  </div>
                </section>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;