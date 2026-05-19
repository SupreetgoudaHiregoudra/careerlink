import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Briefcase,
  Target,
  Building2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const Analytics = () => {
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
          successfulHires: Number(res?.data?.successfulHires || 0),
        });
      } catch {
        // fallback values
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
      title: "Active Users",
      value: formatCompact(statsData.activeUsers),
      growth: "+18%",
      color:
        "from-cyan-500/20 to-blue-500/20 border-cyan-400/20 text-cyan-400",
      glow: "bg-cyan-500/20",
    },
    {
      icon: Briefcase,
      title: "Jobs Posted",
      value: formatCompact(statsData.jobsPosted),
      growth: "+24%",
      color:
        "from-violet-500/20 to-purple-500/20 border-violet-400/20 text-violet-400",
      glow: "bg-violet-500/20",
    },
    {
      icon: Target,
      title: "Successful Hires",
      value: formatCompact(statsData.successfulHires),
      growth: "+31%",
      color:
        "from-emerald-500/20 to-green-500/20 border-emerald-400/20 text-emerald-400",
      glow: "bg-emerald-500/20",
    },
    {
      icon: Building2,
      title: "Companies",
      value: formatCompact(statsData.companies),
      growth: "+12%",
      color:
        "from-orange-500/20 to-amber-500/20 border-orange-400/20 text-orange-400",
      glow: "bg-orange-500/20",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        
        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-sm font-medium backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4" />
            Live Careerlink Platform Insights
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
            Platform{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Analytics
            </span>
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            Track hiring growth, platform engagement, active opportunities,
            and recruitment performance through intelligent real-time analytics.
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
            >
              
              {/* HOVER GLOW */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl ${stat.glow}`}
              />

              {/* CARD CONTENT */}
              <div className="relative z-10">
                
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="w-7 h-7" />
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {stat.growth}
                  </div>
                </div>

                {/* VALUE */}
                <div className="mt-8">
                  <h3 className="text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </h3>

                  <p className="mt-2 text-slate-400 font-medium">
                    {stat.title}
                  </p>
                </div>

                {/* BOTTOM BAR */}
                <div className="mt-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2 + index * 0.1,
                    }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EXTRA INFO */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Accelerating Careers & Hiring Worldwide
          </h3>

          <p className="mt-4 text-slate-400 max-w-3xl mx-auto leading-relaxed">
            CareerLink empowers recruiters and job seekers with intelligent hiring
            solutions, advanced analytics, and seamless recruitment workflows —
            helping thousands connect faster every single day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;