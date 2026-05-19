import { Briefcase, ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBrandClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <footer className="relative overflow-hidden pt-24 pb-10">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-purple-500/10 blur-3xl" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* FOOTER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-[32px] border border-white/10 bg-white/70 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden"
        >

          {/* TOP SECTION */}
          <div className="px-8 md:px-14 py-14 md:py-16">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT SIDE */}
              <div>

                <button
                  type="button"
                  onClick={handleBrandClick}
                  className="group inline-flex items-center gap-4"
                >

                  <div className="relative">

                    {/* GLOW */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

                    {/* ICON */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                      <Briefcase className="w-7 h-7" />
                    </div>

                  </div>

                  {/* TEXT */}
                  <div className="text-left">

                    <h3 className="text-3xl font-black tracking-tight text-gray-900">
                      CareerLink
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Smart Hiring Platform
                    </p>

                  </div>

                </button>

                <p className="mt-8 text-lg leading-relaxed text-gray-600 max-w-xl">
                  CareerLink is a modern recruitment platform
                  helping professionals discover better career
                  opportunities and enabling companies to hire
                  top talent through seamless and intelligent
                  hiring solutions.
                </p>

              </div>

              {/* RIGHT SIDE */}
              <div className="grid grid-cols-2 gap-10">

                {/* PLATFORM */}
                <div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-5">
                    Platform
                  </h4>

                  <div className="space-y-3">

                    <button
                      onClick={() => navigate("/find-jobs")}
                      className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                      <span>Find Jobs</span>

                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                    <button
                      onClick={() => navigate("/signup")}
                      className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                      <span>Create Account</span>

                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                    <button
                      onClick={() => navigate("/contact")}
                      className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                      <span>Contact Us</span>

                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                  </div>

                </div>

                {/* COMPANY */}
                <div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-5">
                    Company
                  </h4>

                  <div className="space-y-3">

                    <button
                      onClick={() => navigate("/about")}
                      className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                    >
                      <span>About Us</span>

                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                    <button
                      onClick={() => navigate("/login")}
                      className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                    >
                      <span>Login</span>

                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* BOTTOM */}
          <div className="border-t border-gray-200/70 px-8 md:px-14 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()}{" "}

              <span className="font-semibold text-gray-800">
                CareerLink
              </span>

              . All rights reserved.
            </p>

            <div className="flex items-center gap-3">

              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              <p className="text-sm text-gray-500">
                Connecting talent with opportunities
              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </footer>
  );
};

export default Footer;