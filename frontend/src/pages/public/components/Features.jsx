import React from "react";
import { motion } from "framer-motion";
import {
  jobSeekerFeatures,
  employerFeatures,
} from "../../../utils/data";

const Features = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Powerful Features for Job Seekers & Employers
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            CareerLink simplifies hiring and job searching with intelligent tools,
            real-time communication, and a seamless recruitment experience for
            both candidates and employers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14">
          
          {/* Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl p-8 shadow-xl">
              
              {/* Section Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 8a4 4 0 018 0v1H8v-1z"
                    />
                  </svg>
                </div>

                <h3 className="text-3xl font-bold text-gray-900">
                  For Job Seekers
                </h3>

                <p className="mt-3 text-gray-600">
                  Discover opportunities faster and grow your career confidently.
                </p>
              </div>

              {/* Feature Items */}
              <div className="space-y-5">
                {jobSeekerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      x: 6,
                     scale: 1.02,
                      }}
                    className="group/item flex gap-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 transition-all duration-300"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h4>

                      <p className="mt-1 text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Employers */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 shadow-xl">
              
              {/* Section Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M9 11h6"
                    />
                  </svg>
                </div>

                <h3 className="text-3xl font-bold text-gray-900">
                  For Employers
                </h3>

                <p className="mt-3 text-gray-600">
                  Hire smarter with powerful recruitment and management tools.
                </p>
              </div>

              {/* Feature Items */}
              <div className="space-y-5">
                {employerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                     x: 6,
                     scale: 1.02,
                    }}
                    className="group/item flex gap-4 p-5 rounded-2xl border border-purple-100 bg-purple-50/60 hover:bg-purple-100/70 transition-all duration-300"
                  >
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-purple-600" />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h4>

                      <p className="mt-1 text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;