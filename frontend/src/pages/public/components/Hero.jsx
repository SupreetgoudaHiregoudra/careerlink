import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowRight,
  Users,
  Building2,
  TrendingUp,
  Sparkles,
  Briefcase,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const Hero = () => {
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({
    activeUsers: 0,
    companies: 0,
    jobsPosted: 0,
    successfulHires: 0,
  });

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.DASHBOARD.PUBLIC_STATS
        );

        setStatsData({
          activeUsers: Number(res?.data?.activeUsers || 0),
          companies: Number(res?.data?.companies || 0),
          jobsPosted: Number(res?.data?.jobsPosted || 0),
          successfulHires: Number(
            res?.data?.successfulHires || 0
          ),
        });
      } catch {
        // keep fallback zeros
      }
    };

    fetchPublicStats();
  }, []);

  const formatCompact = useMemo(
    () => (value) =>
      new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value),
    []
  );

  const stats = [
    {
      icon: Users,
      label: "Active Professionals",
      value: formatCompact(statsData.activeUsers),
    },
    {
      icon: Building2,
      label: "Hiring Companies",
      value: formatCompact(statsData.companies),
    },
    {
      icon: TrendingUp,
      label: "Open Opportunities",
      value: formatCompact(statsData.jobsPosted),
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      
      {/* BLUR GLOWS */}
      <div className="absolute top-20 left-[-120px] w-[320px] h-[320px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-[-100px] w-[320px] h-[320px] rounded-full bg-purple-500/20 blur-3xl" />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            
          >
          </motion.div>

          {/* MAIN HEADING */}
<motion.h1
  initial={{ opacity: 0, y: 35 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[82px] font-black tracking-tight leading-[1.1]"
>
  <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
    Build Your Career With Confidence
  </span>
</motion.h1>
          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            CareerLink helps job seekers discover better career
opportunities and enables employers to hire the right
talent through smart, fast, and seamless recruitment
solutions.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Browse Jobs */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/find-jobs")}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-semibold shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.35)] transition-all duration-300"
            >
              <Search className="w-5 h-5" />

              <span>Browse Jobs</span>

              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* Post Job */}
            {(!isAuthenticated ||
              user?.role === "employer") && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(
                    isAuthenticated &&
                      user?.role === "employer"
                      ? "/employer-dashboard"
                      : "/login"
                  )
                }
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl text-gray-800 font-semibold hover:bg-gray-50 shadow-sm transition-all duration-300"
              >
                <Briefcase className="w-5 h-5 text-purple-600" />

                <span>Post a Job</span>
              </motion.button>
            )}
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.1,
                  duration: 0.6,
                }}
                whileHover={{
                  y: -5,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-2xl p-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
              >
                {/* Card glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                    <stat.icon className="w-7 h-7 text-blue-600" />
                  </div>

                  <div className="text-3xl font-black text-gray-900">
                    {stat.value}
                  </div>

                  <div className="mt-2 text-sm font-medium text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;