import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  UserCheck,
  Bookmark,
  Activity,
  TrendingUp,
  Sparkles,
  UserCircle2,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";

import { API_PATHS } from "../../utils/apiPaths";

import { useAuth } from "../../context/AuthContext";

import Brand from "../../components/Brand";

const StatCard = ({
  label,
  value,
  icon,
  gradient,
  subtitle,
}) => (
  <div
    className={`relative overflow-hidden rounded-[30px] p-6 text-white shadow-2xl ${gradient}`}
  >
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

    <div className="relative z-10 flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-white/80">
          {label}
        </p>

        <h2 className="mt-4 text-5xl font-black">
          {value}
        </h2>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          <TrendingUp className="h-4 w-4" />
          {subtitle}
        </div>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl">
        {icon}
      </div>

    </div>
  </div>
);

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
    active: true,
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
},
];

const AdminDashboard = () => {
  const navigate =
    useNavigate();

  const { logout, user } =
    useAuth();

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const fetchStats =
    async () => {
      try {
        setLoading(true);

        const res =
          await axiosInstance.get(
            API_PATHS.ADMIN
              .GET_STATS
          );

        setStats(
          res.data.stats
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards =
    useMemo(() => {
      if (!stats) return [];

      return [
        {
          label:
            "Total Users",
          value:
            stats.totalUsers,
          subtitle:
            "Platform users",
          icon: (
            <Users className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500",
        },
        {
          label:
            "Employers",
          value:
            stats.totalEmployers,
          subtitle:
            "Recruiters onboarded",
          icon: (
            <Briefcase className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-violet-600 to-fuchsia-600",
        },
        {
          label:
            "Jobseekers",
          value:
            stats.totalJobseekers,
          subtitle:
            "Candidates active",
          icon: (
            <UserCheck className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-emerald-500 to-teal-600",
        },
        {
          label:
            "Jobs Posted",
          value:
            stats.totalJobs,
          subtitle:
            "Opportunities live",
          icon: (
            <Briefcase className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-orange-500 to-red-500",
        },
        {
          label:
            "Applications",
          value:
            stats.totalApplications,
          subtitle:
            "Applications received",
          icon: (
            <Activity className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-pink-500 to-rose-500",
        },
        {
          label:
            "Saved Jobs",
          value:
            stats.totalSavedJobs,
          subtitle:
            "Bookmarked jobs",
          icon: (
            <Bookmark className="h-8 w-8" />
          ),
          gradient:
            "bg-gradient-to-r from-cyan-500 to-sky-600",
        },
      ];
    }, [stats]);

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
              <h1 className="text-3xl font-black">
                Welcome Back,
                {` `}
                {user?.name ||
                  "Admin"}
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Monitor and manage
                the CareerLink
                platform
              </p>
            </div>

          </header>

          {/* Content */}
          <section className="space-y-8 p-6 md:p-8">

            {/* Hero */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 shadow-2xl">

              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
              <div className="relative z-10">
                <h2 className="mt-6 max-w-3xl text-5xl font-black leading-tight">
                  Control & Monitor
                  Your Entire Hiring
                  Ecosystem
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-indigo-100">
                  Manage employers,
                  jobseekers, jobs,
                  applications and
                  platform growth from
                  one centralized admin
                  dashboard.
                </p>

              </div>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
                Loading dashboard...
              </div>
            ) : (
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {statCards.map(
                  (card) => (
                    <StatCard
                      key={
                        card.label
                      }
                      label={
                        card.label
                      }
                      value={
                        card.value
                      }
                      icon={
                        card.icon
                      }
                      gradient={
                        card.gradient
                      }
                      subtitle={
                        card.subtitle
                      }
                    />
                  )
                )}

              </section>
            )}

            {/* Quick Actions */}
            <section className="rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Manage your platform
                  efficiently
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <button
                  onClick={() =>
                    navigate(
                      "/admin/users"
                    )
                  }
                  className="group rounded-3xl border border-white/10 bg-black/20 p-6 text-left transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-300">
                    <Users className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    Manage Users
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    View and control
                    employers and
                    jobseekers across
                    the platform.
                  </p>
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/jobs"
                    )
                  }
                  className="group rounded-3xl border border-white/10 bg-black/20 p-6 text-left transition hover:border-violet-500/40 hover:bg-violet-500/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300">
                    <Briefcase className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    Manage Jobs
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Review, monitor,
                    and remove jobs
                    from the platform.
                  </p>
                </button>

              </div>
            </section>

          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;