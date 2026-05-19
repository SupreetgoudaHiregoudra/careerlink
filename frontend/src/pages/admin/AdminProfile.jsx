import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCircle2,
  Mail,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import { useAuth } from "../../context/AuthContext";

import Brand from "../../components/Brand";

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Manage Jobs",
    path: "/admin/jobs",
    icon: Briefcase,
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: UserCircle2,
    active: true,
  },
];

const AdminProfile = () => {
  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchProfile =
    async () => {
      try {
        const res =
          await axiosInstance.get(
            API_PATHS.AUTH
              .GET_PROFILE
          );

        setUser(
          res.data.user
        );
      } catch (err) {
        console.log(err);

        toast.error(
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />

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
            <Brand />
          </div>

          <nav className="space-y-2 p-4">

            {sidebarLinks.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={
                      item.path
                    }
                    onClick={() =>
                      navigate(
                        item.path
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

                navigate(
                  "/login"
                );
              }}
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
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-6 backdrop-blur-xl md:px-8">

            <div>
              <h1 className="bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-3xl font-black text-transparent">
                Admin Profile
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Administrator account details
              </p>
            </div>

    

          </header>

          {/* Content */}
          <section className="p-6 md:p-8">

            {loading ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-300">
                Loading profile...
              </div>
            ) : !user ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-rose-300">
                Failed to load profile
              </div>
            ) : (
              <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

                <div className="flex flex-col items-center text-center">

                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-5xl font-black shadow-2xl shadow-violet-500/30">
                    {user.name?.charAt(0)}
                  </div>

                  <h2 className="mt-6 text-4xl font-black">
                    {user.name}
                  </h2>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Verified
                  </div>

                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-sm text-slate-400">
                      Full Name
                    </p>

                    <h3 className="mt-3 text-2xl font-bold">
                      {user.name}
                    </h3>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-sm text-slate-400">
                      Email Address
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-xl font-semibold">
                      <Mail className="h-5 w-5 text-indigo-400" />
                      {user.email}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-sm text-slate-400">
                      Account Role
                    </p>

                    <div className="mt-3 inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
                      {user.role}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <p className="text-sm text-slate-400">
                      Platform Access
                    </p>

                    <h3 className="mt-3 text-xl font-semibold text-emerald-300">
                      Full Administrative Access
                    </h3>
                  </div>

                </div>

              </div>
            )}

          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;