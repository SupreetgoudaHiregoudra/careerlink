import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Users,
  Trash2,
  LayoutDashboard,
  Briefcase,
  LogOut,
  Search,
  ShieldCheck,
  UserCheck,
  Building2,
  Sparkles,
  UserCircle2,
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
    active: true,
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

const ManageUsers = () => {
  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const fetchUsers =
    async () => {
      try {
        setLoading(true);

        const res =
          await axiosInstance.get(
            API_PATHS.ADMIN
              .GET_USERS
          );

        setUsers(
  res.data.users.filter(
    (user) =>
      user.role !== "admin"
  )
);
      } catch (err) {
        console.log(err);

        toast.error(
          "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

  const deleteUser =
    async (id) => {
      try {
        await axiosInstance.delete(
          API_PATHS.ADMIN.DELETE_USER(
            id
          )
        );

        setUsers((prev) =>
          prev.filter(
            (u) =>
              u._id !== id
          )
        );

        toast.success(
          "User deleted"
        );
      } catch (err) {
        toast.error(
          "Failed to delete user"
        );
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [users, search]);

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
                Manage Users
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Control employers
                and jobseekers on
                the platform
              </p>
            </div>

            

          </header>

          {/* Content */}
          <section className="space-y-8 p-6 md:p-8">

            {/* Top Cards */}
            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">
                      Total Users
                    </p>

                    <h2 className="mt-4 text-5xl font-black">
                      {
                        users.length
                      }
                    </h2>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
                    <Users className="h-8 w-8" />
                  </div>
                </div>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">
                      Employers
                    </p>

                    <h2 className="mt-4 text-5xl font-black">
                      {
                        users.filter(
                          (
                            u
                          ) =>
                            u.role ===
                            "employer"
                        )
                          .length
                      }
                    </h2>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
                    <Building2 className="h-8 w-8" />
                  </div>
                </div>

              </div>

              <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">
                      Jobseekers
                    </p>

                    <h2 className="mt-4 text-5xl font-black">
                      {
                        users.filter(
                          (
                            u
                          ) =>
                            u.role ===
                            "jobseeker"
                        )
                          .length
                      }
                    </h2>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
                    <UserCheck className="h-8 w-8" />
                  </div>
                </div>

              </div>

            </div>

            {/* Search */}
            <div className="flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">

              <Search className="h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />

            </div>

            {/* Users List */}
            <div className="space-y-5">

              {loading ? (
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-300">
                  Loading users...
                </div>
              ) : filteredUsers
                  .length === 0 ? (
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-300">
                  No users found
                </div>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <div
                      key={
                        user._id
                      }
                      className="group rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07]"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-5">

                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-black">
                            {user.name?.charAt(
                              0
                            )}
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-3">

                              <h2 className="text-2xl font-bold">
                                {
                                  user.name
                                }
                              </h2>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  user.role ===
                                  "admin"
                                    ? "bg-amber-500/10 text-amber-300"
                                    : user.role ===
                                      "employer"
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-indigo-500/10 text-indigo-300"
                                }`}
                              >
                                {
                                  user.role
                                }
                              </span>

                            </div>

                            <p className="mt-2 text-sm text-slate-400">
                              {
                                user.email
                              }
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                              <ShieldCheck className="h-4 w-4" />
                              Platform verified
                              user
                            </div>

                          </div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">

                          <button
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                            className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-5 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </section>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;