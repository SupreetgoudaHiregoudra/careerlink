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
  Save,
  Trash2,
  X,
  UserCircle2,
  ChevronDown,
  LayoutDashboard,
  Heart,
  LogOut,
  Upload,
  FileText,
  Briefcase,
  Menu,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import uploadImage from "../../utils/uploadImage";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import ConfirmDialog from "../../components/ConfirmDialog";

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
    active: true,
  },
];

const UserProfile = () => {
  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    updateUser,
    logout,
  } = useAuth();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    uploadingResume,
    setUploadingResume,
  ] = useState(false);

  const [
    showSaveDialog,
    setShowSaveDialog,
  ] = useState(false);

  const [
    resumeFileName,
    setResumeFileName,
  ] = useState(
    "No file chosen"
  );

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

  const [formData, setFormData] =
    useState({
      name: "",
      avatar: "",
      resume: "",
    });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      user?.role !==
      "jobseeker"
    ) {
      navigate("/");
      return;
    }

    setFormData({
      name: user?.name || "",
      avatar:
        user?.avatar || "",
      resume:
        user?.resume || "",
    });

    if (user?.resume) {
      const resumeName =
        decodeURIComponent(
          user.resume
            .split("/")
            .pop() ||
            "Resume uploaded"
        );

      setResumeFileName(
        resumeName
      );
    } else {
      setResumeFileName(
        "No file chosen"
      );
    }
  }, [
    isAuthenticated,
    user?._id,
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

  const setField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload =
    async (file) => {
      if (!file) return;

      try {
        const res =
          await uploadImage(
            file
          );

        setField(
          "avatar",
          res.imageUrl || ""
        );

        toast.success(
          "Avatar uploaded"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Avatar upload failed"
        );
      }
    };

  const handleResumeUpload =
    async (file) => {
      if (!file) return;

      setUploadingResume(
        true
      );

      try {
        const res =
          await uploadImage(
            file
          );

        setField(
          "resume",
          res.imageUrl || ""
        );

        toast.success(
          "Resume uploaded"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Resume upload failed"
        );
      } finally {
        setUploadingResume(
          false
        );
      }
    };

  const handleDeleteResume =
    async () => {
      if (!formData.resume)
        return;

      try {
        await axiosInstance.delete(
          API_PATHS.AUTH
            .DELETE_RESUME,
          {
            data: {
              resumeUrl:
                formData.resume,
            },
          }
        );

        setField(
          "resume",
          ""
        );

        setResumeFileName(
          "No file chosen"
        );

        updateUser({
          resume: "",
        });

        toast.success(
          "Resume removed"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to remove resume"
        );
      }
    };

  const confirmSaveChanges =
    async () => {
      setShowSaveDialog(
        false
      );

      setLoading(true);

      try {
        const res =
          await axiosInstance.put(
            API_PATHS.AUTH
              .UPDATE_PROFILE,
            {
              name:
                formData.name,
              avatar:
                formData.avatar,
              resume:
                formData.resume,
            }
          );

        updateUser(
          res.data.user
        );

        toast.success(
          "Profile updated"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Profile update failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (loading) return;

    setShowSaveDialog(
      true
    );
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

            {sidebarLinks.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={item.to}
                    onClick={() =>
                      navigate(
                        item.to
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      item.active
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-violet-500/20"
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
                      <button
                        key={item.to}
                        onClick={() => {
                          navigate(
                            item.to
                          );

                          setIsMobileSidebarOpen(
                            false
                          );
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                          item.active
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {
                          item.label
                        }
                      </button>
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

                <h1 className="text-2xl font-black">
                  My Profile
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Manage your profile and resume
                </p>

              </div>
            </div>

            {/* Profile Menu */}

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
                {formData.avatar ? (
                  <img
                    src={resolveMediaUrl(
                      formData.avatar
                    )}
                    alt="Avatar"
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

          <section className="flex justify-center p-5 md:p-8">

            <div className="w-full max-w-4xl">

              <form
                onSubmit={
                  handleSubmit
                }
                className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl"
              >

                {/* Banner */}

                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-8 py-8">

                  <h2 className="text-3xl font-black text-white">
                    Job Seeker Profile
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    Keep your profile updated for better opportunities
                  </p>

                </div>

                <div className="space-y-8 p-6 md:p-8">

                  {/* Avatar */}

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">

                    <h3 className="text-xl font-bold text-white">
                      Profile Picture
                    </h3>

                    <div className="mt-5 flex flex-wrap items-center gap-5">

                      {formData.avatar ? (
                        <img
                          src={resolveMediaUrl(
                            formData.avatar
                          )}
                          alt="Avatar"
                          className="h-24 w-24 rounded-full border-4 border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-slate-900">
                          <UserCircle2 className="h-12 w-12 text-slate-500" />
                        </div>
                      )}

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">

                        <Upload className="h-4 w-4" />

                        Upload Avatar

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            e
                          ) =>
                            handleAvatarUpload(
                              e
                                .target
                                .files?.[0]
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {/* Basic Info */}

                  <div className="space-y-5 rounded-3xl border border-white/10 bg-black/20 p-6">

                    <div>

                      <label className="text-sm font-medium text-slate-300">
                        Full Name
                      </label>

                      <input
                        value={
                          formData.name
                        }
                        onChange={(
                          e
                        ) =>
                          setField(
                            "name",
                            e.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>

                      <label className="text-sm font-medium text-slate-300">
                        Email Address
                      </label>

                      <input
                        value={
                          user?.email ||
                          ""
                        }
                        disabled
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Resume */}

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">

                    <h3 className="text-xl font-bold text-white">
                      Resume
                    </h3>

                    <div className="mt-5 flex flex-wrap items-center gap-4">

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">

                        <Upload className="h-4 w-4" />

                        Upload Resume

                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(
                            e
                          ) => {
                            const file =
                              e
                                .target
                                .files?.[0];

                            if (
                              !file
                            )
                              return;

                            setResumeFileName(
                              file.name
                            );

                            handleResumeUpload(
                              file
                            );
                          }}
                        />
                      </label>

                      <span className="text-sm text-slate-400">
                        {
                          resumeFileName
                        }
                      </span>
                    </div>

                    {uploadingResume && (
                      <p className="mt-3 text-sm text-slate-400">
                        Uploading resume...
                      </p>
                    )}

                    {formData.resume && (
                      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4">

                        <FileText className="h-5 w-5 text-indigo-400" />

                        <a
                          href={resolveMediaUrl(
                            formData.resume
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-sm text-indigo-400 underline"
                        >
                          View Resume
                        </a>

                        <button
                          type="button"
                          onClick={
                            handleDeleteResume
                          }
                          className="ml-auto text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}

                  <div className="flex justify-end gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/find-jobs"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        loading
                      }
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />

                      {loading
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>

      <ConfirmDialog
        open={showSaveDialog}
        title="Save profile changes?"
        message="Your updated profile details will be saved and visible in your account."
        confirmText="Yes, Save Changes"
        cancelText="Not Now"
        loading={loading}
        onConfirm={
          confirmSaveChanges
        }
        onClose={() =>
          setShowSaveDialog(
            false
          )
        }
      />
    </div>
  );
};

export default UserProfile;