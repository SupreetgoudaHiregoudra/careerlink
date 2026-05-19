import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  UserCircle2,
  Bookmark,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

const Header = ({ hidePrimaryLinks = false }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);

 const profilePath =
  user?.role === "employer"
    ? "/company-profile"
    : user?.role === "admin"
    ? "/admin/profile"
    : "/profile";

  const showViewProfile = location.pathname !== profilePath;

  const showSavedJobs =
    location.pathname !== "/saved-jobs" &&
    location.pathname !== "/profile";

  const showBrowseJobs = location.pathname !== "/find-jobs";

  const handleViewProfile = () => {
    if (!isAuthenticated || !user) return;

    navigate(profilePath);
    setIsProfileMenuOpen(false);
  };

  const handleSavedJobs = () => {
    navigate("/saved-jobs");
    setIsProfileMenuOpen(false);
  };

  const handleBrowseJobs = () => {
    navigate("/find-jobs");
    setIsProfileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

if (user?.role === "jobseeker") {
  navigate("/jobseeker-dashboard");
} else if (user?.role === "employer") {
  navigate("/employer-dashboard");
} else if (user?.role === "admin") {
  navigate("/admin-dashboard");
} else {
  navigate("/");
}

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]" />

      {/* GLOW */}
      <div className="absolute top-[-80px] left-[15%] w-[200px] h-[200px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-[-80px] right-[15%] w-[200px] h-[200px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-3"
          >
            <div className="relative">
              
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>

            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900">
                CareerLink
              </h1>

              <p className="hidden sm:flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Sparkles className="w-3 h-3" />
                Smart Hiring & Career Platform
              </p>
            </div>
          </button>

          {/* NAVIGATION */}
          {!hidePrimaryLinks && (
            <nav className="hidden md:flex items-center gap-8">
              
              <button
                onClick={() => navigate("/find-jobs")}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all"
              >
                Browse Jobs
              </button>

              <button
                onClick={() => navigate("/about")}
                 className="relative text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-cyan-500 after:transition-all"
                >
                 About
              </button>

              <button
                  onClick={() => navigate("/contact")}
                  className="relative text-gray-700 hover:text-pink-600 font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-pink-500 after:transition-all"
                 >
                 Contact
              </button>
              {(!isAuthenticated || user?.role === "employer") && (
                <button
                  onClick={() => {
                    navigate(
                      isAuthenticated && user?.role === "employer"
                        ? "/employer-dashboard"
                        : "/login"
                    );
                  }}
                  className="relative text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-purple-500 after:transition-all"
                >
                  For Employers
                </button>
              )}
            </nav>
          )}

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* SAVED JOBS */}
                {user.role === "jobseeker" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => navigate("/saved-jobs")}
                    className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 shadow-sm"
                    aria-label="Saved jobs"
                    title="Saved jobs"
                  >
                    <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </motion.button>
                )}

                {/* PROFILE */}
                <div
                  className="relative"
                  ref={profileMenuRef}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      setIsProfileMenuOpen((prev) => !prev)
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-sm hover:bg-white transition-all duration-300"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    {user.avatar ? (
                      <img
                        src={resolveMediaUrl(user.avatar)}
                        alt={user.name || "User"}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100"
                      />
                    ) : (
                      <UserCircle2 className="w-9 h-9 text-blue-600" />
                    )}

                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-slate-800 leading-none">
                        {user.name || "User"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        {user.role} Profile
                      </p>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  {/* DROPDOWN */}
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 z-50"
                    >
                      {user.role === "jobseeker" &&
                        showBrowseJobs && (
                          <button
                            type="button"
                            onClick={handleBrowseJobs}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Browse Jobs
                          </button>
                        )}

                      {user.role === "jobseeker" &&
                        showSavedJobs && (
                          <button
                            type="button"
                            onClick={handleSavedJobs}
                            className="sm:hidden w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Saved Jobs
                          </button>
                        )}

                      {showViewProfile && (
                        <button
                          type="button"
                          onClick={handleViewProfile}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          View Profile
                        </button>
                      )}
                      {user.role === "admin" && (
  <button
    type="button"
    onClick={() => {
      navigate("/admin-dashboard");
      setIsProfileMenuOpen(false);
    }}
    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
  >
    Admin Dashboard
  </button>
)}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-blue-200 transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;