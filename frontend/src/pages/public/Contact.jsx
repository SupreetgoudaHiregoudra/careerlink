import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  ArrowLeft,
} from "lucide-react";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/contact/send",
        formData
      );

      alert(res.data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to send message"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 py-24 px-6 text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-purple-500/10 blur-3xl" />

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

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Contact Us
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-400 leading-relaxed">
            Have questions, feedback, or need assistance?
            Fill out the form below and our team will get
            back to you as soon as possible.
          </p>

          {/* BACK BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-white font-medium backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>
        </motion.div>

        {/* CONTENT */}
        <div className="mt-20 grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl font-bold">
              Get In Touch
            </h2>

            <p className="mt-4 text-slate-400 leading-8">
              We’d love to hear from you. Whether you’re
              a job seeker, recruiter, or employer, feel
              free to reach out anytime.
            </p>

            <div className="mt-10 space-y-8">

              {/* EMAIL */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-cyan-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Email
                  </h3>

                  <p className="mt-1 text-slate-400">
                    careerlinkadmin@gmail.com
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Location
                  </h3>

                  <p className="mt-1 text-slate-400">
                    Hubli, Karnataka, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl font-bold">
              Send a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>

                <textarea
                  rows="6"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-all resize-none"
                />
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-6 py-4 text-white font-semibold shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.35)] transition-all duration-300 disabled:opacity-70"
              >
                <Send className="w-5 h-5" />

                <span>
                  {loading ? "Sending..." : "Send Message"}
                </span>
              </motion.button>

            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;