import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  BriefcaseBusiness,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  requiredRole,
  children,
}) => {
  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center overflow-hidden relative">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_30%)]" />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",

            backgroundSize:
              "44px 44px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">

          {/* LOGO */}
          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <BriefcaseBusiness className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-black">
                CareerLink
              </h1>

              <p className="text-slate-400 text-sm">
                Career Platform
              </p>
            </div>
          </div>

          {/* SPINNER */}
          <div className="relative">

            <div className="w-16 h-16 rounded-full border-4 border-white/10" />

            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />

          </div>

          {/* TEXT */}
          <p className="mt-6 text-slate-400 text-lg">
            Loading your dashboard...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* =========================================================
     ROLE CHECK
  ========================================================= */

  if (
    requiredRole &&
    user.role !== requiredRole
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return children
    ? children
    : <Outlet />;
};

export default ProtectedRoute;