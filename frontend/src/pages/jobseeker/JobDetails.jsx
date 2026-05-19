import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  ArrowLeft,
  Bookmark,
  BadgeCheck,
  ClipboardList,
  Building,
  LayoutDashboard,
  Heart,
  UserCircle2,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
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

const formatSalary = (
  amount,
  currency = "INR"
) => {
  const value = Number(amount || 0);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
};

const formatCategories = (
  categoryValue
) => {
  if (
    Array.isArray(categoryValue)
  ) {
    const values =
      categoryValue.filter(Boolean);

    return values.length > 0
      ? values.join(", ")
      : "General";
  }

  if (
    typeof categoryValue ===
      "string" &&
    categoryValue.trim()
  ) {
    return categoryValue;
  }

  return "General";
};

const getSalarySuffix = (
  salaryType
) => {
  if (salaryType === "Hourly")
    return "/hr";

  if (salaryType === "Monthly")
    return "/month";

  return "/year";
};

const formatSalaryRange = (
  job
) =>
  `${formatSalary(
    job.salaryMin,
    job.currency
  )} - ${formatSalary(
    job.salaryMax,
    job.currency
  )}`;

const JobDetails = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [applying, setApplying] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const desktopProfileMenuRef =
    useRef(null);

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
  }, [isDesktopProfileMenuOpen]);

  const fetchJobDetails =
    async () => {
      setLoading(true);

      try {
        const params = {};

        if (
          isAuthenticated &&
          user?._id
        ) {
          params.userId =
            user._id;
        }

        const res =
          await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(
              id
            ),
            { params }
          );

        if (res.data?.success) {
          setJob(res.data.job);
        }
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchJobDetails();
  }, [
    id,
    isAuthenticated,
    user?._id,
  ]);

  const handleApply =
    async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      if (
        user?.role !==
        "jobseeker"
      ) {
        toast.error(
          "Only job seekers can apply"
        );

        return;
      }

      setApplying(true);

      try {
        await axiosInstance.post(
          API_PATHS.APPLICATIONS.APPLY_TO_JOB(
            id
          )
        );

        toast.success(
          "Application submitted"
        );

        setJob((prev) => ({
          ...prev,
          applicationStatus:
            "Applied",
        }));
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to apply"
        );
      } finally {
        setApplying(false);
      }
    };

  const handleSaveJob =
    async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      setSaving(true);

      try {
        if (job?.isSaved) {
          await axiosInstance.delete(
            API_PATHS.JOBS.UNSAVE_JOB(
              job._id
            )
          );

          toast.success(
            "Removed from saved jobs"
          );

          setJob((prev) => ({
            ...prev,
            isSaved: false,
          }));
        } else {
          await axiosInstance.post(
            API_PATHS.JOBS.SAVE_JOB(
              job._id
            )
          );

          toast.success(
            "Job saved successfully"
          );

          setJob((prev) => ({
            ...prev,
            isSaved: true,
          }));
        }
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to save job"
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Job not found.
      </div>
    );
  }

  const alreadyApplied =
    Boolean(
      job.applicationStatus
    );

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

        <aside className="hidden lg:flex min-h-screen flex-col border-r border-white/10 bg-black/20 backdrop-blur-2xl">

          <div className="flex h-20 items-center border-b border-white/10 px-6">
            <Brand />
          </div>

          <nav className="space-y-2 p-4">

            {sidebarLinks.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={item.to}
                    onClick={() =>
                      navigate(item.to)
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      item.to ===
                      "/find-jobs"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              }
            )}

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

                {sidebarLinks.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <button
                        key={item.to}
                        onClick={() => {
                          navigate(
                            item.to
                          );

                          setIsSidebarOpen(
                            false
                          );
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  }
                )}

              </nav>
            </aside>
          </div>
        )}

        {/* Main */}

        <main className="min-w-0">

          {/* Header */}

          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/30 px-5 backdrop-blur-2xl md:px-8">

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

                <h1 className="text-2xl font-black text-white">
                  Job Details
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Explore complete job information
                </p>

              </div>
            </div>

            {/* Profile */}

            <div
              className="relative"
              ref={desktopProfileMenuRef}
            >
              <button
                onClick={() =>
                  setIsDesktopProfileMenuOpen(
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

                      navigate("/login");

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

            <Link
              to="/find-jobs"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse Jobs
            </Link>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

              {/* Left */}

              <div className="space-y-6">

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <div className="flex flex-col md:flex-row gap-5">

                    <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center shrink-0">
                      {job.company
                        ?.companyLogo ? (
                        <img
                          src={resolveMediaUrl(
                            job.company
                              .companyLogo
                          )}
                          alt="Company"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-400" />
                      )}
                    </div>

                    <div>

                      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        {job.title}
                      </h1>

                      <div className="mt-3 flex items-center gap-2 text-xl text-slate-300 font-medium">

                        <span>
                          {job.company
                            ?.companyName}
                        </span>

                        <BadgeCheck className="w-5 h-5 text-indigo-400" />

                      </div>

                      <div className="mt-5 flex flex-wrap gap-6 text-slate-400 text-sm">

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.type}
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            job.createdAt
                          ).toLocaleDateString()}
                        </div>

                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <div className="flex items-center gap-3">

                    <ClipboardList className="w-6 h-6 text-indigo-400" />

                    <h2 className="text-3xl font-bold text-white">
                      Job Description
                    </h2>

                  </div>

                  <p className="mt-6 text-slate-300 leading-9 whitespace-pre-wrap">
                    {job.description}
                  </p>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <h2 className="text-3xl font-bold text-white">
                    Requirements
                  </h2>

                  <div className="mt-6 text-slate-300 leading-9 whitespace-pre-wrap">
                    {job.requirements}
                  </div>

                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <h2 className="text-3xl font-bold text-white">
                    Category
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3">

                    {formatCategories(
                      job.category
                    )
                      .split(",")
                      .map((item) => (
                        <span
                          key={item}
                          className="rounded-2xl bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300"
                        >
                          {item.trim()}
                        </span>
                      ))}

                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <div className="flex items-center gap-3">

                    <Building className="w-6 h-6 text-indigo-400" />

                    <h2 className="text-3xl font-bold text-white">
                      About Company
                    </h2>

                  </div>

                  <p className="mt-6 text-slate-300 leading-9 whitespace-pre-wrap">
                    {job.company
                      ?.companyDescription ||
                      "No company description available."}
                  </p>

                </section>

              </div>

              {/* Right */}

              <aside className="space-y-6 lg:sticky lg:top-24 h-fit">

                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

                  <h3 className="text-3xl font-bold text-white">
                    Compensation
                  </h3>

                  <div className="mt-6">

                    <p className="text-4xl font-black text-indigo-400 leading-tight">
                      {formatSalaryRange(
                        job
                      )}
                    </p>

                    <p className="mt-3 text-slate-400">
                      ({job.currency ||
                        "INR"}){" "}
                      {getSalarySuffix(
                        job.salaryType
                      )}
                    </p>

                  </div>

                  <div className="mt-8 space-y-4">

                    {alreadyApplied ? (
                      <button
                        disabled
                        className="w-full h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 font-semibold"
                      >
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={
                          handleApply
                        }
                        disabled={
                          applying ||
                          job.isClosed
                        }
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold"
                      >
                        {applying
                          ? "Applying..."
                          : "Apply Now"}
                      </button>
                    )}

                    <button
                      onClick={
                        handleSaveJob
                      }
                      disabled={saving}
                      className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-3 transition"
                    >
                      <Bookmark className="w-5 h-5" />

                      {job?.isSaved
                        ? "Saved"
                        : "Save Job"}
                    </button>

                  </div>
                </div>

              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default JobDetails;