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
  Mail,
  Pencil,
  ChevronDown,
  X,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { resolveMediaUrl } from "../../utils/mediaUrl";

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

const EmployerProfilePage = () => {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

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
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-xl px-6">
          
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
  <h1 className="text-2xl font-black text-white">
    Company Profile
  </h1>

  <p className="mt-1 text-sm text-slate-400">
    Manage employer and organization details
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
            
            <div className="w-full max-w-5xl">
              
              {/* Profile Card */}
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
                
                {/* Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-8 py-8">
                  
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

                  <div className="relative z-10 flex flex-col items-center justify-between gap-5 md:flex-row">
                    
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Employer
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-white">
                        Employer Profile
                      </h2>

                      <p className="mt-2 text-sm text-indigo-100">
                        Showcase your
                        company and
                        attract top
                        talent
                      </p>
                    </div>

                    <Link
                      to="/company-profile/edit"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8">
                  
                  <div className="grid gap-8 lg:grid-cols-2">
                    
                    {/* Personal */}
                    <section className="rounded-3xl border border-white/10 bg-black/20 p-6">
                      
                      <h3 className="text-2xl font-bold text-white">
                        Personal
                        Information
                      </h3>

                      <div className="mt-6 flex items-center gap-5">
                        
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900">
                          {user?.avatar ? (
                            <img
                              src={resolveMediaUrl(
                                user.avatar
                              )}
                              alt={
                                user.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserCircle2 className="h-12 w-12 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-2xl font-bold text-white">
                            {user?.name ||
                              "Employer"}
                          </h4>

                          <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
                            <Mail className="h-4 w-4" />
                            {user?.email ||
                              "No email"}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Company */}
                    <section className="rounded-3xl border border-white/10 bg-black/20 p-6">
                      
                      <h3 className="text-2xl font-bold text-white">
                        Company
                        Information
                      </h3>

                      <div className="mt-6 flex items-center gap-5">
                        
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                          {user?.companyLogo ? (
                            <img
                              src={resolveMediaUrl(
                                user.companyLogo
                              )}
                              alt={
                                user.companyName
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-10 w-10 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-2xl font-bold text-white">
                            {user?.companyName ||
                              "Company Name"}
                          </h4>

                          <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
                            <Building2 className="h-4 w-4" />
                            Organization
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* About */}
                  <section className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
                    
                    <h3 className="text-2xl font-bold text-white">
                      About Company
                    </h3>

                    <p className="mt-5 leading-relaxed text-slate-300">
                      {user?.companyDescription ||
                        "No company description added yet."}
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
export default EmployerProfilePage;