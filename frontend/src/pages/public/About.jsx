import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    "AI Powered Hiring",
    "Real-Time Job Updates",
    "Smart Recruitment Workflow",
    "Secure User Profiles",
    "Advanced Analytics",
    "Fast Applications",
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white py-24 px-6">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-purple-500/20 blur-3xl" />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >

          <h1 className="text-5xl md:text-7xl font-black leading-tight">

            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Build Your Career Future
            </span>

          </h1>

          <p className="mt-8 max-w-4xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            CareerLink is a modern hiring platform connecting talented
            professionals with top companies. We simplify recruitment
            through intelligent hiring solutions, seamless workflows,
            and real-time career opportunities.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />

              Back to Home
            </button>

            <button
              onClick={() => navigate("/find-jobs")}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              Explore Jobs

              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

          </div>

        </motion.div>

        {/* MISSION CARDS */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">

          {[
            {
              icon: Target,
              title: "Our Mission",
              desc:
                "Empower jobseekers and recruiters with a seamless and intelligent hiring experience.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              desc:
                "Build the smartest recruitment ecosystem for the next generation workforce.",
            },
            {
              icon: Briefcase,
              title: "Our Platform",
              desc:
                "CareerLink supports employers, jobseekers, applications, and hiring management.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />

              <div className="relative z-10">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-cyan-400" />
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {item.title}
                </h2>

                <p className="mt-5 text-slate-400 leading-8">
                  {item.desc}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

        {/* WHY CHOOSE US */}
        <div className="mt-24 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-14">

          <div className="text-center">

            <h2 className="text-4xl font-black text-white">
              Why Choose CareerLink?
            </h2>

            <p className="mt-5 text-slate-400 max-w-3xl mx-auto leading-8">
              CareerLink combines modern technology with seamless
              recruitment workflows to create a smarter hiring
              experience for everyone.
            </p>

          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.03,
                }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div className="w-3 h-3 rounded-full bg-cyan-400" />

                <p className="text-slate-200 font-medium">
                  {feature}
                </p>

              </motion.div>
            ))}

          </div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >

          <h2 className="text-4xl md:text-5xl font-black text-white">
            Ready to Build Your Career?
          </h2>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
            Join thousands of professionals and companies already
            using CareerLink to grow careers and hire smarter.
          </p>

          <button
            onClick={() => navigate("/find-jobs")}
            className="mt-10 group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-[1.03] transition-all duration-300"
          >
            Get Started Today

            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

        </motion.div>

      </div>
    </section>
  );
};

export default About;