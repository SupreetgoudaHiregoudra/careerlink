import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  Search,
  Users,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import ConfirmDialog from "../../components/ConfirmDialog";
import Brand from "../../components/Brand";

const ManageJobs = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [editingJob, setEditingJob] =
    useState(null);

  const [
    deleteTargetJob,
    setDeleteTargetJob,
  ] = useState(null);

  const [deletingJob, setDeletingJob] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const desktopProfileMenuRef =
    useRef(null);

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const res =
        await axiosInstance.get(
          API_PATHS.JOBS
            .GET_JOBS_EMPLOYER
        );

      let jobsData = [];

      if (Array.isArray(res.data)) {
        jobsData = res.data;
      } else if (
        Array.isArray(res.data.jobs)
      ) {
        jobsData = res.data.jobs;
      } else if (
        Array.isArray(res.data.data)
      ) {
        jobsData = res.data.data;
      }

      setJobs(jobsData);
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const filteredJobs = useMemo(() => {
    const q =
      searchQuery.trim().toLowerCase();

    return (
      Array.isArray(jobs)
        ? jobs
        : []
    ).filter((job) => {
      const matchesQuery =
        !q ||
        (job.title || "")
          .toLowerCase()
          .includes(q) ||
        (job.location || "")
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter ===
          "active" &&
          !job.isClosed) ||
        (statusFilter ===
          "closed" &&
          job.isClosed);

      return (
        matchesQuery &&
        matchesStatus
      );
    });
  }, [
    jobs,
    searchQuery,
    statusFilter,
  ]);

  const handleDelete = (job) => {
    setDeleteTargetJob(job);
  };

  const confirmDeleteJob =
    async () => {
      if (!deleteTargetJob?._id)
        return;

      setDeletingJob(true);

      try {
        await axiosInstance.delete(
          API_PATHS.JOBS.DELETE_JOB(
            deleteTargetJob._id
          )
        );

        toast.success(
          "Job deleted"
        );

        setDeleteTargetJob(null);

        fetchJobs();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to delete job"
        );
      } finally {
        setDeletingJob(false);
      }
    };

  const handleToggleClose =
    async (job) => {
      try {
        await axiosInstance.put(
          API_PATHS.JOBS.TOGGLE_CLOSE(
            job._id
          )
        );

        toast.success(
          job.isClosed
            ? "Job reopened"
            : "Job closed"
        );

        fetchJobs();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update job"
        );
      }
    };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob) return;

    try {
      await axiosInstance.put(
        API_PATHS.JOBS.UPDATE_JOB(
          editingJob._id
        ),
        {
          title:
            editingJob.title,
          description:
            editingJob.description,
          requirements:
            editingJob.requirements,
          location:
            editingJob.location,
          category:
            editingJob.category,
          type: editingJob.type,
          salaryType:
            editingJob.salaryType ||
            "Yearly",
          currency:
            editingJob.currency ||
            "INR",
          salaryMin: Number(
            editingJob.salaryMin || 0
          ),
          salaryMax: Number(
            editingJob.salaryMax || 0
          ),
        }
      );

      toast.success(
        "Job updated"
      );

      setEditingJob(null);

      fetchJobs();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update job"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
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

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[270px_1fr]">
        
        <aside className="hidden lg:flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
          
          <div className="h-20 px-6 border-b border-white/10 flex items-center">
            <Brand />
          </div>

          <nav className="p-4 space-y-2">
            
            <Link
              to="/employer-dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              to="/post-job"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 transition-all"
            >
              <Plus className="w-5 h-5" />
              Post Job
            </Link>

            <Link
              to="/manage-jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-violet-500/20"
            >
              <ClipboardList className="w-5 h-5" />
              Manage Jobs
            </Link>

            <Link
              to="/company-profile"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/10 transition-all"
            >
              <Building2 className="w-5 h-5" />
              Company Profile
            </Link>
          </nav>

        <div className="mt-auto p-4 border-t border-white/10">
  <button
    onClick={() => {
      logout();
      navigate("/");
    }}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-300 hover:bg-rose-500/10 transition-all"
  >
    <LogOut className="w-5 h-5" />
    Logout
  </button>
</div>
        </aside>

        <main>
          
          <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 flex items-center justify-between">
            
            <div>
              <h1 className="text-3xl font-black">
                Manage Jobs
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Track, edit and
                manage all your
                job postings
              </p>
            </div>
<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">

  {user?.avatar ? (
    <img
      src={resolveMediaUrl(user.avatar)}
      alt="user"
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <UserCircle2 className="w-10 h-10 text-indigo-300" />
  )}

  <div className="text-left">
    <p className="text-sm font-semibold">
      {user?.name || "Employer"}
    </p>

    <p className="text-xs text-slate-400">
      Employer
    </p>
  </div>
</div>
          </header>

          <section className="p-6">
            
            <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6">
              
              <div className="flex flex-wrap gap-4 justify-between items-center">
                
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search jobs..."
                    className="w-full rounded-2xl border border-white/10 bg-black/20 pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option value="all">
                    All
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>

                <button
                  onClick={() =>
                    navigate("/post-job")
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold shadow-xl shadow-violet-500/20"
                >
                  <Plus className="w-5 h-5" />
                  Add Job
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-slate-400">
                <BriefcaseBusiness className="w-5 h-5 text-indigo-300" />

                Showing{" "}
                <span className="text-white font-bold">
                  {filteredJobs.length}
                </span>{" "}
                jobs
              </div>

              <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-black/20">
                
                <table className="w-full min-w-[800px]">
                  
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <tr>
                      <th className="text-left px-6 py-4">
                        Job
                      </th>

                      <th className="text-left px-6 py-4">
                        Status
                      </th>

                      <th className="text-left px-6 py-4">
                        Applicants
                      </th>

                      <th className="text-left px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-slate-400"
                        >
                          Loading jobs...
                        </td>
                      </tr>
                    ) : filteredJobs.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-slate-400"
                        >
                          No jobs found
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map(
                        (job) => (
                          <tr
                            key={job._id}
                            className="hover:bg-white/5 transition-all"
                          >
                            <td className="px-6 py-5">
                              <h3 className="font-bold text-white">
                                {
                                  job.title
                                }
                              </h3>

                              <p className="text-sm text-slate-400 mt-1">
                                {job.location ||
                                  "Remote"}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  job.isClosed
                                    ? "bg-amber-500/10 text-amber-300"
                                    : "bg-emerald-500/10 text-emerald-300"
                                }`}
                              >
                                {job.isClosed
                                  ? "Closed"
                                  : "Active"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/applicants?jobId=${job._id}`
                                  )
                                }
                                className="inline-flex items-center gap-2 text-indigo-300 hover:text-white"
                              >
                                <Users className="w-4 h-4" />

                                {job.applicationCount ||
                                  0}
                              </button>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                
                                <button
                                  onClick={() =>
                                    setEditingJob(
                                      job
                                    )
                                  }
                                  className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 flex items-center justify-center"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleClose(
                                      job
                                    )
                                  }
                                  className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center justify-center"
                                >
                                  <X className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      job
                                    )
                                  }
                                  className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>

      {editingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-900 p-6 space-y-4"
          >
            <h2 className="text-2xl font-black">
              Edit Job
            </h2>

            <input
              value={editingJob.title}
              onChange={(e) =>
                setEditingJob(
                  (prev) => ({
                    ...prev,
                    title:
                      e.target.value,
                  })
                )
              }
              placeholder="Job Title"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />

            <textarea
              value={
                editingJob.description
              }
              onChange={(e) =>
                setEditingJob(
                  (prev) => ({
                    ...prev,
                    description:
                      e.target.value,
                  })
                )
              }
              placeholder="Description"
              className="w-full min-h-[140px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />

            <textarea
              value={
                editingJob.requirements ||
                ""
              }
              onChange={(e) =>
                setEditingJob(
                  (prev) => ({
                    ...prev,
                    requirements:
                      e.target.value,
                  })
                )
              }
              placeholder="Requirements"
              className="w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />

            <div className="grid md:grid-cols-2 gap-4">
              
              <input
                value={
                  editingJob.location ||
                  ""
                }
                onChange={(e) =>
                  setEditingJob(
                    (prev) => ({
                      ...prev,
                      location:
                        e.target.value,
                    })
                  )
                }
                placeholder="Location"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
              />

              <input
                value={
                  editingJob.category ||
                  ""
                }
                onChange={(e) =>
                  setEditingJob(
                    (prev) => ({
                      ...prev,
                      category:
                        e.target.value,
                    })
                  )
                }
                placeholder="Category"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              
              <select
                value={
                  editingJob.type ||
                  ""
                }
                onChange={(e) =>
                  setEditingJob(
                    (prev) => ({
                      ...prev,
                      type: e.target.value,
                    })
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
              >
                <option value="">
                  Select Job Type
                </option>

                <option value="Full-Time">
                  Full-Time
                </option>

                <option value="Part-Time">
                  Part-Time
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
                </option>
              </select>

              <input
                type="number"
                value={
                  editingJob.salaryMin ||
                  ""
                }
                onChange={(e) =>
                  setEditingJob(
                    (prev) => ({
                      ...prev,
                      salaryMin:
                        e.target.value,
                    })
                  )
                }
                placeholder="Minimum Salary"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
              />

              <input
                type="number"
                value={
                  editingJob.salaryMax ||
                  ""
                }
                onChange={(e) =>
                  setEditingJob(
                    (prev) => ({
                      ...prev,
                      salaryMax:
                        e.target.value,
                    })
                  )
                }
                placeholder="Maximum Salary"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              
              <button
                type="button"
                onClick={() =>
                  setEditingJob(null)
                }
                className="rounded-2xl border border-white/10 px-5 py-3 text-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(
          deleteTargetJob
        )}
        title="Delete Job?"
        message={`This will permanently remove "${
          deleteTargetJob?.title ||
          "this job"
        }".`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deletingJob}
        confirmTone="danger"
        onConfirm={
          confirmDeleteJob
        }
        onClose={() =>
          setDeleteTargetJob(null)
        }
      />
    </div>
  );
};

export default ManageJobs;