import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ClipboardList,
  Building2,
  LogOut,
  LayoutDashboard,
  Plus,
  UserCircle2,
  X,
  Save,
  ChevronDown,
  Sparkles,
  Camera,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import uploadImage from "../../utils/uploadImage";

import { resolveMediaUrl } from "../../utils/mediaUrl";

import ConfirmDialog from "../../components/ConfirmDialog";

import Brand from "../../components/Brand";

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
  },
  {
    to: "/company-profile",
    label: "Company Profile",
    icon: Building2,
    active: true,
  },
];

const EditProfileDetails = () => {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [
    showSaveDialog,
    setShowSaveDialog,
  ] = useState(false);

  const [
    isDesktopProfileMenuOpen,
    setIsDesktopProfileMenuOpen,
  ] = useState(false);

  const desktopProfileMenuRef =
    useRef(null);

  const [formData, setFormData] =
    useState({
      name: user?.name || "",
      companyName:
        user?.companyName || "",
      companyDescription:
        user?.companyDescription ||
        "",
      avatar: user?.avatar || "",
      companyLogo:
        user?.companyLogo || "",
    });

  const setField = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload =
    async (field, file) => {
      if (!file) return;

      try {
        const data =
          await uploadImage(file);

        setField(
          field,
          data.imageUrl || ""
        );

        toast.success(
          "Image uploaded successfully"
        );
      } catch {
        toast.error(
          "Failed to upload image"
        );
      }
    };

  const confirmSaveChanges =
    async () => {
      setShowSaveDialog(false);

      setLoading(true);

      try {
        const res =
  await axiosInstance.put(
    API_PATHS.AUTH.UPDATE_PROFILE,
    {
      name: formData.name,
      avatar: formData.avatar,
      companyName: formData.companyName,
      companyDescription:
        formData.companyDescription,
      companyLogo:
        formData.companyLogo,
    }
  );

updateUser(res.data.user);

        toast.success(
          "Profile updated successfully"
        );

        navigate(
          "/company-profile"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update profile"
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

    setShowSaveDialog(true);
  };

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

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
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

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isDesktopProfileMenuOpen,
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]"></div>

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

        {/* Main */}
        <main className="min-w-0">
          
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-5 backdrop-blur-xl md:px-8">
            
            <div>
              <h1 className="mt-3 text-2xl font-black text-white">
                Company Profile
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage your employer
                and company details
              </p>
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

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isDesktopProfileMenuOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
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
          <section className="flex justify-center p-5 md:p-8">
            
            <form
              onSubmit={
                handleSubmit
              }
              className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              
              {/* Banner */}
              <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-8 py-7">
                
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-white">
                      Edit Company
                      Profile
                    </h2>

                    <p className="mt-1 text-sm text-indigo-100">
                      Keep your
                      company profile
                      updated and
                      professional
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 md:p-8">
                
                <div className="grid gap-8 lg:grid-cols-2">
                  
                  {/* Personal */}
                  <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    
                    <h3 className="text-2xl font-bold text-white">
                      Personal
                      Information
                    </h3>

                    <div className="mt-6 flex items-center gap-5">
                      
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900">
                        {formData.avatar ? (
                          <img
                            src={resolveMediaUrl(
                              formData.avatar
                            )}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserCircle2 className="h-12 w-12 text-slate-500" />
                        )}
                      </div>

                      <div>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            e
                          ) =>
                            handleImageUpload(
                              "avatar",
                              e
                                .target
                                ?.files?.[0]
                            )
                          }
                        />

                        <label
                          htmlFor="avatar"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          <Camera className="h-4 w-4" />
                          Upload
                          Photo
                        </label>

                        <p className="mt-2 text-xs text-slate-400">
                          PNG, JPG,
                          WEBP
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5">
                      
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
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
                          className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                          Email
                          Address
                        </label>

                        <input
                          value={
                            user?.email ||
                            ""
                          }
                          disabled
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 text-sm text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Company */}
                  <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    
                    <h3 className="text-2xl font-bold text-white">
                      Company
                      Information
                    </h3>

                    <div className="mt-6 flex items-center gap-5">
                      
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                        {formData.companyLogo ? (
                          <img
                            src={resolveMediaUrl(
                              formData.companyLogo
                            )}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-10 w-10 text-slate-500" />
                        )}
                      </div>

                      <div>
                        <input
                          type="file"
                          id="companyLogo"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            e
                          ) =>
                            handleImageUpload(
                              "companyLogo",
                              e
                                .target
                                ?.files?.[0]
                            )
                          }
                        />

                        <label
                          htmlFor="companyLogo"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          <Camera className="h-4 w-4" />
                          Upload
                          Logo
                        </label>

                        <p className="mt-2 text-xs text-slate-400">
                          Recommended
                          square logo
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5">
                      
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                          Company
                          Name
                        </label>

                        <input
                          value={
                            formData.companyName
                          }
                          onChange={(
                            e
                          ) =>
                            setField(
                              "companyName",
                              e.target
                                .value
                            )
                          }
                          className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                          Company
                          Description
                        </label>

                        <textarea
                          value={
                            formData.companyDescription
                          }
                          onChange={(
                            e
                          ) =>
                            setField(
                              "companyDescription",
                              e.target
                                .value
                            )
                          }
                          className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap justify-end gap-4 border-t border-white/10 pt-6">
                  
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/company-profile"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />

                    {loading
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showSaveDialog}
        title="Save Company Profile?"
        message="Your employer and company details will be updated for your CareerLink account."
        confirmText="Yes, Save Changes"
        cancelText="Cancel"
        loading={loading}
        onConfirm={
          confirmSaveChanges
        }
        onClose={() =>
          setShowSaveDialog(false)
        }
      />
    </div>
  );
};

export default EditProfileDetails;