import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  ChevronDown,
  X,
  Sparkles,
  Briefcase,
  Layers3,
  Wallet,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import JobPostingPreview from "./JobPostingPreview";

import { useAuth } from "../../context/AuthContext";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import Brand from "../../components/Brand";

const defaultFormData = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  category: [],
  type: "Full-Time",
  salaryType: "Yearly",
  currency: "INR",
  salaryMin: "",
  salaryMax: "",
};

const CATEGORY_OPTIONS = [
  "IT & Software",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer-service",
  "HR",
  "Finance",
  "Operations",
];

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
    active: true,
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

const JobPostingForm = () => {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState(defaultFormData);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    CATEGORY_OPTIONS[0]
  );

  const [loading, setLoading] =
    useState(false);

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

  const updateField = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCategory = () => {
    if (!selectedCategory)
      return;

    setFormData((prev) => {
      const current =
        Array.isArray(
          prev.category
        )
          ? prev.category
          : [];

      if (
        current.includes(
          selectedCategory
        )
      )
        return prev;

      return {
        ...prev,
        category: [
          ...current,
          selectedCategory,
        ],
      };
    });
  };

  const removeCategory = (
    categoryToRemove
  ) => {
    setFormData((prev) => ({
      ...prev,
      category:
        prev.category.filter(
          (item) =>
            item !==
            categoryToRemove
        ),
    }));
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !formData.title ||
        !formData.description ||
        !formData.requirements
      ) {
        toast.error(
          "Please fill all required fields"
        );

        return;
      }

      setLoading(true);

      try {
        await axiosInstance.post(
          API_PATHS.JOBS
            .POST_JOB,
          {
            ...formData,
            salaryMin: Number(
              formData.salaryMin ||
                0
            ),
            salaryMax: Number(
              formData.salaryMax ||
                0
            ),
          }
        );

        toast.success(
          "Job posted successfully"
        );

        setFormData(
          defaultFormData
        );

        navigate(
          "/employer-dashboard"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to post job"
        );
      } finally {
        setLoading(false);
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
                  Post New Job
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Publish jobs and
                  attract top
                  candidates
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
          <section className="p-5 md:p-8">
            
            <div className="grid gap-6 xl:grid-cols-2">
              
              {/* Form */}
              <form
                onSubmit={
                  handleSubmit
                }
                className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                    <Briefcase className="h-7 w-7" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Job Details
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Fill in the
                      job
                      information
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Job Title *
                    </label>

                    <input
                      value={
                        formData.title
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "title",
                          e.target
                            .value
                        )
                      }
                      placeholder="Senior Frontend Developer"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Description *
                    </label>

                    <textarea
                      value={
                        formData.description
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "description",
                          e.target
                            .value
                        )
                      }
                      placeholder="Describe responsibilities and role expectations"
                      className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Requirements *
                    </label>

                    <textarea
                      value={
                        formData.requirements
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "requirements",
                          e.target
                            .value
                        )
                      }
                      placeholder="Mention required skills and experience"
                      className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Location + Category */}
                  <div className="grid gap-4 md:grid-cols-2">
                    
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Location
                      </label>

                      <input
                        value={
                          formData.location
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "location",
                            e
                              .target
                              .value
                          )
                        }
                        placeholder="Bangalore, India"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Category
                      </label>

                      <div className="mt-2 flex gap-2">
                        
                        <select
                          value={
                            selectedCategory
                          }
                          onChange={(
                            e
                          ) =>
                            setSelectedCategory(
                              e
                                .target
                                .value
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-indigo-500"
                        >
                          {CATEGORY_OPTIONS.map(
                            (
                              option
                            ) => (
                              <option
                                key={
                                  option
                                }
                                value={
                                  option
                                }
                              >
                                {
                                  option
                                }
                              </option>
                            )
                          )}
                        </select>

                        <button
                          type="button"
                          onClick={
                            addCategory
                          }
                          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          Add
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData
                          .category
                          .length ===
                        0 ? (
                          <span className="text-xs text-slate-500">
                            No
                            category
                            selected
                          </span>
                        ) : (
                          formData.category.map(
                            (
                              category
                            ) => (
                              <span
                                key={
                                  category
                                }
                                className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                              >
                                {
                                  category
                                }

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeCategory(
                                      category
                                    )
                                  }
                                >
                                  ✕
                                </button>
                              </span>
                            )
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="grid gap-4 md:grid-cols-3">
                    
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Job Type
                      </label>

                      <select
                        value={
                          formData.type
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "type",
                            e.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-indigo-500"
                      >
                        <option>
                          Remote
                        </option>
                        <option>
                          Full-Time
                        </option>
                        <option>
                          Part-Time
                        </option>
                        <option>
                          Internship
                        </option>
                        <option>
                          Contract
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Salary Type
                      </label>

                      <select
                        value={
                          formData.salaryType
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "salaryType",
                            e.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-indigo-500"
                      >
                        <option>
                          Hourly
                        </option>
                        <option>
                          Monthly
                        </option>
                        <option>
                          Yearly
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Currency
                      </label>

                      <select
                        value={
                          formData.currency
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "currency",
                            e.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-indigo-500"
                      >
                        <option value="INR">
                          INR
                        </option>

                        <option value="USD">
                          USD
                        </option>

                        <option value="EUR">
                          EUR
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="grid gap-4 md:grid-cols-2">
                    
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Salary Min
                      </label>

                      <div className="relative mt-2">
                        <Wallet className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          type="number"
                          value={
                            formData.salaryMin
                          }
                          onChange={(
                            e
                          ) =>
                            updateField(
                              "salaryMin",
                              e
                                .target
                                .value
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Salary Max
                      </label>

                      <div className="relative mt-2">
                        <Wallet className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                          type="number"
                          value={
                            formData.salaryMax
                          }
                          onChange={(
                            e
                          ) =>
                            updateField(
                              "salaryMax",
                              e
                                .target
                                .value
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-12 pr-4 text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    <Layers3 className="h-5 w-5" />

                    {loading
                      ? "Posting..."
                      : "Publish Job"}
                  </button>
                </div>
              </form>

              {/* Preview */}
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                    <Sparkles className="h-7 w-7" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Live Preview
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      See how your
                      job listing
                      will appear
                    </p>
                  </div>
                </div>

                <JobPostingPreview
  values={{
    ...formData,

    companyName:
      user?.companyName ||
      "Company Name", }}
/>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default JobPostingForm;