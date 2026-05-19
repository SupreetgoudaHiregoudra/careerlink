import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  FileDown,
  MapPin,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { resolveMediaUrl } from "../../utils/mediaUrl";

import { useAuth } from "../../context/AuthContext";

import Brand from "../../components/Brand";

const formatAppliedDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCategories = (categoryValue) => {
  if (Array.isArray(categoryValue)) {
    const values = categoryValue.filter(Boolean);

    return values.length > 0
      ? values.join(", ")
      : "General";
  }

  if (
    typeof categoryValue === "string" &&
    categoryValue.trim()
  ) {
    return categoryValue;
  }

  return "General";
};

const initialsFromName = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0]?.toUpperCase()
    )
    .join("") || "NA";

const sidebarLinks = [
  {
    to: "/employer-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
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
    active: true,
  },
  {
    to: "/company-profile",
    label: "Company Profile",
    icon: Building2,
  },
];

const ApplicationViewer = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [
    isMobileProfileMenuOpen,
    setIsMobileProfileMenuOpen,
  ] = useState(false);

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const mobileProfileMenuRef =
    useRef(null);

  const desktopProfileMenuRef =
    useRef(null);

  const [searchParams] =
    useSearchParams();

  const jobIdFromQuery =
    searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState(
    []
  );

  const [
    selectedJobId,
    setSelectedJobId,
  ] = useState("");

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState(null);

  const [
    updatingStatusId,
    setUpdatingStatusId,
  ] = useState("");

  useEffect(() => {
   const fetchJobs = async () => {
  try {
    const res =
      await axiosInstance.get(
        API_PATHS.JOBS
          .GET_JOBS_EMPLOYER
      );

    console.log(res.data);
   const jobList = Array.isArray(
  res.data.jobs
)
  ? res.data.jobs
  : [];

    setJobs(jobList);

    if (jobList.length === 0) {
      setSelectedJobId("");

      return;
    }

    const hasQueryJob =
      jobIdFromQuery &&
      jobList.some(
        (job) =>
          job._id ===
          jobIdFromQuery
      );

    setSelectedJobId(
      hasQueryJob
        ? jobIdFromQuery
        : jobList[0]._id
    );
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data
        ?.message ||
        "Failed to load jobs"
    );
  }
};

    fetchJobs();
  }, [jobIdFromQuery]);

  useEffect(() => {
    const fetchApplications =
  async () => {
    if (!selectedJobId) return;

    setLoading(true);

    try {
      const res =
        await axiosInstance.get(
          API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(
            selectedJobId
          )
        );

      console.log(res.data);

      setApplications(
  Array.isArray(
    res.data.applications
  )
    ? res.data.applications
    : []
);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

    fetchApplications();
  }, [selectedJobId]);

  const selectedJob = useMemo(
  () =>
    Array.isArray(jobs)
      ? jobs.find(
          (job) =>
            job._id ===
            selectedJobId
        ) || null
      : null,
  [jobs, selectedJobId]
);

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingStatusId(
        applicationId
      );

      await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(
          applicationId
        ),
        { status }
      );

      setApplications((prev) =>
        prev.map((item) =>
          item._id === applicationId
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedApplication(
        (prev) =>
          prev &&
          prev._id === applicationId
            ? {
                ...prev,
                status,
              }
            : prev
      );

      toast.success(
        "Application status updated"
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Status update failed"
      );
    } finally {
      setUpdatingStatusId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]"></div>

      <div className="fixed inset-0 opacity-[0.04]">
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

        {/* Main */}
        <main className="min-w-0">
          
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-5 backdrop-blur-xl md:px-8">
            
            <div>
              <h1 className="text-2xl font-black text-white">
                Applications Overview
              </h1>
            </div>

            {/* Profile */}
            <div
              className="relative"
              ref={
                desktopProfileMenuRef
              }
            >
              <button
                type="button"
                onClick={() =>
                  setIsDesktopProfileMenuOpen(
                    (
                      prev
                    ) => !prev
                  )
                }
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl transition hover:bg-white/10"
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
          <section className="p-5 md:p-8">
            
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() =>
                  navigate(
                    "/manage-jobs"
                  )
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <h2 className="text-3xl font-black text-white">
                Job Applications
              </h2>
            </div>

            {!selectedJob ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur-xl">
                No jobs found.
              </div>
            ) : (
              <>
                {/* Job Banner */}
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700">
                  
                  <div className="p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      
                      <div>
                        <h2 className="text-3xl font-black text-white">
                          {
                            selectedJob.title
                          }
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-indigo-100">
                          
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                            <MapPin className="h-4 w-4" />
                            {
                              selectedJob.location
                            }
                          </span>

                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                            <Briefcase className="h-4 w-4" />
                            {
                              selectedJob.type
                            }
                          </span>

                          <span className="rounded-full bg-white/10 px-4 py-2">
                            {formatCategories(
                              selectedJob.category
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur-xl">
                        <p className="text-3xl font-black text-white">
                          {
                            applications.length
                          }
                        </p>

                        <p className="text-sm text-indigo-100">
                          Applications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="mt-8 space-y-5">
                  
                  {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur-xl">
                      Loading applications...
                    </div>
                  ) : applications.length ===
                    0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur-xl">
                      No applications yet.
                    </div>
                  ) : (
                    applications.map(
                      (
                        application
                      ) => {
                        const applicantName =
                          application
                            ?.applicant
                            ?.name ||
                          "Applicant";

                        const resumeUrl =
                          resolveMediaUrl(
                            application
                              ?.applicant
                              ?.resume ||
                              application?.resume ||
                              ""
                          );

                        return (
                          <div
                            key={
                              application._id
                            }
                            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-2xl"
                          >
                            <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/5 to-violet-500/5"></div>

                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
                              
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
                                    className="h-16 w-16 rounded-full object-cover border border-white/10"
                                  />
                                ) : (
                                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-300">
                                    {initialsFromName(
                                      applicantName
                                    )}
                                  </div>
                                )}

                                <div>
                                  <h3 className="text-xl font-bold text-white">
                                    {
                                      applicantName
                                    }
                                  </h3>

                                  <p className="mt-1 text-sm text-slate-400">
                                    {
                                      application
                                        ?.applicant
                                        ?.email
                                    }
                                  </p>

                                  <div className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
                                    <CalendarDays className="h-4 w-4" />

                                    Applied{" "}
                                    {formatAppliedDate(
                                      application.createdAt
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                
                                <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-300">
                                  {
                                    application.status
                                  }
                                </span>

                                {resumeUrl && (
                                  <a
                                    href={
                                      resumeUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                                  >
                                    <FileDown className="h-4 w-4" />
                                    Resume
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedApplication(
                                      application
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          
          <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              
              <h3 className="text-2xl font-black text-white">
                Applicant Profile
              </h3>

              <button
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              
              <div className="text-center">
                {selectedApplication
                  ?.applicant
                  ?.avatar ? (
                  <img
                    src={resolveMediaUrl(
                      selectedApplication
                        .applicant
                        .avatar
                    )}
                    alt="Applicant"
                    className="mx-auto h-24 w-24 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-bold text-indigo-300">
                    {initialsFromName(
                      selectedApplication
                        ?.applicant
                        ?.name
                    )}
                  </div>
                )}

                <h4 className="mt-5 text-3xl font-black text-white">
                  {
                    selectedApplication
                      ?.applicant
                      ?.name
                  }
                </h4>

                <p className="mt-2 text-slate-400">
                  {
                    selectedApplication
                      ?.applicant
                      ?.email
                  }
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                
                <p className="text-sm text-slate-400">
                  Applied Position
                </p>

                <h5 className="mt-2 text-2xl font-bold text-white">
                  {
                    selectedApplication
                      ?.job?.title
                  }
                </h5>

                <p className="mt-2 text-sm text-slate-400">
                  {
                    selectedApplication
                      ?.job
                      ?.location
                  }{" "}
                  •{" "}
                  {
                    selectedApplication
                      ?.job?.type
                  }
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Update Status
                </label>

                <select
                  value={
                    selectedApplication?.status
                  }
                  onChange={(e) =>
                    updateStatus(
                      selectedApplication._id,
                      e.target.value
                    )
                  }
                  disabled={
                    updatingStatusId ===
                    selectedApplication._id
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  <option className="bg-slate-900">
                    Applied
                  </option>

                  <option className="bg-slate-900">
                    In Review
                  </option>

                  <option className="bg-slate-900">
                    Accepted
                  </option>

                  <option className="bg-slate-900">
                    Rejected
                  </option>
                </select>
              </div>

              {resolveMediaUrl(
                selectedApplication
                  ?.applicant
                  ?.resume ||
                  selectedApplication?.resume ||
                  ""
              ) && (
                <a
                  href={resolveMediaUrl(
                    selectedApplication
                      ?.applicant
                      ?.resume ||
                      selectedApplication?.resume ||
                      ""
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:scale-[1.01]"
                >
                  <FileDown className="h-5 w-5" />
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ApplicationViewer;