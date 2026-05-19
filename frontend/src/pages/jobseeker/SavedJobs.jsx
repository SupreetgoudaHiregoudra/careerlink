import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  Briefcase,
  ChevronDown,
  Grid3X3,
  List,
  UserCircle2,
  LogOut,
  LayoutDashboard,
  Heart,
  X,
  Menu,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import JobCard from "../../components/JobCard";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import Brand from "../../components/Brand";

const sidebarLinks = [
  {
    to: "/find-jobs",
    label: "Browse Jobs",
    icon: LayoutDashboard,
  },
  {
    to: "/saved-jobs",
    label: "Saved Jobs",
    icon: Heart,
  },
  {
    to: "/my-applications",
    label: "My Applications",
    icon: Briefcase,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: UserCircle2,
  },
];

const SavedJobs = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  const [
    savedJobs,
    setSavedJobs,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    removingId,
    setRemovingId,
  ] = useState("");

  const [
    jobView,
    setJobView,
  ] = useState("grid");

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const desktopProfileMenuRef =
    useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      navigate("/");
      return;
    }

    fetchSavedJobs();
  }, [
    isAuthenticated,
    user?.role,
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

  const fetchSavedJobs =
    async () => {
      setLoading(true);

      try {
        const res =
          await axiosInstance.get(
            API_PATHS.JOBS
              .GET_SAVED_JOBS
          );

       const jobs = (
       res.data.savedJobs || []
          )
          .map((item) => item.job)
          .filter(Boolean)
          .map((job) => ({
            ...job,
            isSaved: true,
          }));

        setSavedJobs(jobs);
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to load saved jobs"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleRemove =
    async (job) => {
      setRemovingId(job._id);

      try {
        await axiosInstance.delete(
          API_PATHS.JOBS.UNSAVE_JOB(
            job._id
          )
        );

        setSavedJobs((prev) =>
          prev.filter(
            (item) =>
              item._id !== job._id
          )
        );

        toast.success(
          "Removed from saved jobs"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to remove job"
        );
      } finally {
        setRemovingId("");
      }
    };

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

        {/* Desktop Sidebar */}

        <aside className="hidden lg:flex min-h-screen flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">

          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <Brand />
          </div>

          <nav className="space-y-2 p-4">

            {sidebarLinks.map((item) => {
              const Icon =
                item.icon;

              const isActive =
                item.to ===
                "/saved-jobs";

              return (
                <button
                  key={item.to}
                  onClick={() =>
                    navigate(item.to)
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-violet-500/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}

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

                {sidebarLinks.map((item) => {
                  const Icon =
                    item.icon;

                  const isActive =
                    item.to ===
                    "/saved-jobs";

                  return (
                    <button
                      key={item.to}
                      onClick={() => {
                        navigate(item.to);

                        setIsMobileSidebarOpen(
                          false
                        );
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                          : "text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}

              </nav>
            </div>
          </div>
        )}

        {/* Main */}

        <main className="min-w-0">

          {/* Header */}

          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-5 backdrop-blur-xl md:px-8">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setIsMobileSidebarOpen(
                    true
                  )
                }
                className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>

              <div>

                <h1 className="text-2xl font-black text-white">
                  Saved Jobs
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Manage your saved opportunities
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
                      "Job Seeker"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Job Seeker
                  </p>

                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {isDesktopProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                  <button
                    onClick={() => {
                      navigate(
                        "/profile"
                      );

                      setIsDesktopProfileMenuOpen(
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

                      navigate(
                        "/login"
                      );

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

          <section className="px-4 py-6 md:px-8">

            {/* Hero */}

            <div className="mb-8">

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                Saved Opportunities
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Your Saved Jobs
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-slate-400 leading-relaxed">
                Manage and revisit all the opportunities you saved for later.
              </p>

            </div>

            {/* Top Bar */}

            <div className="mb-6 flex items-center justify-between">

              <p className="text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {savedJobs.length}
                </span>{" "}
                saved jobs
              </p>

              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">

                <button
                  type="button"
                  onClick={() =>
                    setJobView("grid")
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    jobView === "grid"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setJobView("list")
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    jobView === "list"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>

              </div>
            </div>

            {/* Jobs */}

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
                Loading saved jobs...
              </div>
            ) : savedJobs.length ===
              0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
                No saved jobs yet.
              </div>
            ) : (
              <div
                className={
                  jobView === "grid"
                    ? "grid grid-cols-1 2xl:grid-cols-2 gap-6"
                    : "space-y-5"
                }
              >
                {savedJobs.map(
                  (job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      showSaveControl
                      isSaved
                      disableSave={
                        removingId ===
                        job._id
                      }
                      onToggleSave={
                        handleRemove
                      }
                      variant={
                        jobView ===
                        "grid"
                          ? "compact"
                          : "default"
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SavedJobs;