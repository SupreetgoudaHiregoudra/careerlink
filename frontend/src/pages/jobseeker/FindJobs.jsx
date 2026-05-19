import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Bookmark,
  ChevronDown,
  Grid3X3,
  List,
  UserCircle2,
  LogOut,
  LayoutDashboard,
  Heart,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/JobCard";
import FilterContent from "../../components/FilterContent";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import Brand from "../../components/Brand";

const FindJobs = () => {
  const { user, isAuthenticated, logout } =
    useAuth();

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [savingId, setSavingId] =
    useState("");

  const [jobView, setJobView] =
    useState("grid");

  const [
    isProfileMenuOpen,
    setIsProfileMenuOpen,
  ] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const profileMenuRef = useRef(null);

  const defaultFilters = {
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  };

  const [filters, setFilters] =
    useState(defaultFilters);

  const jobTypeOptions = [
    "Remote",
    "Full-Time",
    "Part-Time",
    "Contract",
    "Internship",
  ];

  const categoryOptions = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "IT & Software",
    "Customer-service",
    "Product",
    "Operations",
    "Finance",
  ];

  const fetchJobs = async (
    activeFilters = defaultFilters
  ) => {
    setLoading(true);

    try {
      const params = {};

      if (activeFilters.keyword.trim())
        params.keyword =
          activeFilters.keyword.trim();

      if (activeFilters.location.trim())
        params.location =
          activeFilters.location.trim();

      if (activeFilters.category.trim())
        params.category =
          activeFilters.category.trim();

      if (activeFilters.type.trim())
        params.type =
          activeFilters.type.trim();

      if (activeFilters.minSalary)
        params.minSalary = Number(
          activeFilters.minSalary
        );

      if (activeFilters.maxSalary)
        params.maxSalary = Number(
          activeFilters.maxSalary
        );

      if (
        isAuthenticated &&
        user?._id &&
        user?.role === "jobseeker"
      ) {
        params.userId = user._id;
      }

      const res =
        await axiosInstance.get(
          API_PATHS.JOBS.GET_ALL_JOBS,
          { params }
        );

      if (res.data?.success) {
        setJobs(res.data.jobs || []);
      } else {
        setJobs([]);
      }
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to load jobs"
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    isAuthenticated,
    user?._id,
    user?.role,
  ]);

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

  const handleSearch = (event) => {
    event.preventDefault();
    fetchJobs(filters);
  };

  const handleFilterChange = (
    field,
    value
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    fetchJobs(defaultFilters);
  };

  const handleToggleSave = async (
    job
  ) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSavingId(job._id);

    try {
      if (job.isSaved) {
        await axiosInstance.delete(
          API_PATHS.JOBS.UNSAVE_JOB(
            job._id
          )
        );

        toast.success(
          "Removed from saved jobs"
        );
      } else {
        await axiosInstance.post(
          API_PATHS.JOBS.SAVE_JOB(
            job._id
          )
        );

        toast.success(
          "Job saved successfully!"
        );
      }

      fetchJobs(filters);
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update saved jobs"
      );
    } finally {
      setSavingId("");
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

      <div className="relative z-10 lg:grid lg:grid-cols-[280px_1fr]">

        {/* Desktop Sidebar */}

        <aside className="hidden lg:flex min-h-screen flex-col border-r border-white/10 bg-black/20 backdrop-blur-2xl">

          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <Brand />
          </div>

          <nav className="space-y-2 p-4">

            <button
              onClick={() =>
                navigate("/find-jobs")
              }
              className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-medium text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Browse Jobs
            </button>

            <button
              onClick={() =>
                navigate("/saved-jobs")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <Heart className="h-5 w-5" />
              Saved Jobs
            </button>

            <button
              onClick={() =>
                navigate("/my-applications")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <Briefcase className="h-5 w-5" />
              My Applications
            </button>

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
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
                  className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-medium text-white"
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
                  onClick={() => {
                    navigate("/my-applications");
                    setIsSidebarOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
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

          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-4 md:px-6 backdrop-blur-2xl">

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

                <h1 className="text-2xl md:text-3xl font-black text-white">
                  Find Jobs
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Discover premium opportunities
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
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
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
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-rose-400 transition hover:bg-rose-500/10"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          </header>

          {/* Main Content */}

          <main className="px-4 md:px-6 py-6">

            <div className="max-w-7xl mx-auto">

              {/* Hero */}

              <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8">

                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                  Career Opportunities
                </div>

                <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Find Your Dream Job
                </h1>

                <p className="mt-5 max-w-3xl text-base md:text-lg text-slate-400 leading-relaxed">
                  Discover premium opportunities from top companies,
                  apply instantly, and build your future with CareerLink.
                </p>

                <div className="mt-8">
                  <FilterContent
                    filters={filters}
                    onChange={handleFilterChange}
                    onApply={handleSearch}
                    loading={loading}
                  />
                </div>

              </div>

              {/* Jobs Section */}

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">

                {/* Filter Sidebar */}

                <aside className="sticky top-24 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

                  <div className="flex items-center justify-between">

                    <h3 className="text-xl font-semibold text-white">
                      Filter Jobs
                    </h3>

                    <button
                      onClick={handleResetFilters}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Clear All
                    </button>

                  </div>

                  {/* Job Type */}

                  <div className="mt-8">

                    <p className="mb-4 text-lg font-semibold text-white">
                      Job Type
                    </p>

                    <div className="space-y-3">

                      {jobTypeOptions.map((typeOption) => (
                        <label
                          key={typeOption}
                          className="flex items-center gap-3 text-slate-300"
                        >
                          <input
                            type="checkbox"
                            checked={filters.type === typeOption}
                            onChange={() =>
                              handleFilterChange(
                                "type",
                                filters.type === typeOption
                                  ? ""
                                  : typeOption
                              )
                            }
                          />

                          {typeOption}
                        </label>
                      ))}

                    </div>
                  </div>

                  {/* Salary */}

                  <div className="mt-8 border-t border-white/10 pt-8">

                    <p className="mb-4 text-lg font-semibold text-white">
                      Salary Range
                    </p>

                    <div className="grid grid-cols-2 gap-3">

                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minSalary}
                        onChange={(e) =>
                          handleFilterChange(
                            "minSalary",
                            e.target.value
                          )
                        }
                        className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                      />

                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxSalary}
                        onChange={(e) =>
                          handleFilterChange(
                            "maxSalary",
                            e.target.value
                          )
                        }
                        className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                      />

                    </div>
                  </div>

                  {/* Category */}

                  <div className="mt-8 border-t border-white/10 pt-8">

                    <p className="mb-4 text-lg font-semibold text-white">
                      Category
                    </p>

                    <div className="space-y-3">

                      {categoryOptions.map((categoryOption) => (
                        <label
                          key={categoryOption}
                          className="flex items-center gap-3 text-slate-300"
                        >
                          <input
                            type="checkbox"
                            checked={
                              filters.category === categoryOption
                            }
                            onChange={() =>
                              handleFilterChange(
                                "category",
                                filters.category === categoryOption
                                  ? ""
                                  : categoryOption
                              )
                            }
                          />

                          {categoryOption}
                        </label>
                      ))}

                    </div>
                  </div>
                </aside>

                {/* Jobs */}

                <section>

                  <div className="mb-6 flex items-center justify-between">

                    <p className="text-slate-300">
                      Showing{" "}
                      <span className="font-bold text-white">
                        {jobs.length}
                      </span>{" "}
                      jobs
                    </p>

                    <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">

                      <button
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

                  {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-400">
                      Loading jobs...
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-400">
                      No jobs found.
                    </div>
                  ) : (
                    <div
                      className={
                        jobView === "grid"
                          ? "grid grid-cols-1 2xl:grid-cols-2 gap-6"
                          : "space-y-5"
                      }
                    >
                      {jobs.map((job) => (
                        <JobCard
                          key={job._id}
                          job={job}
                          showSaveControl
                          isSaved={Boolean(job.isSaved)}
                          disableSave={savingId === job._id}
                          onToggleSave={handleToggleSave}
                          variant={
                            jobView === "grid"
                              ? "compact"
                              : "default"
                          }
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;