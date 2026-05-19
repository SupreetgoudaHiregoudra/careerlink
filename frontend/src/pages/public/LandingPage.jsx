import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      
      {/* MAIN BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* TOP GLOW */}
      <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-3xl" />

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-[-140px] left-[-140px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10">
        
        {/* HEADER */}
        <Header />

        {/* HERO */}
        <section className="relative">
          <Hero />
        </section>

        {/* FEATURES */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none" />
          <Features />
        </section>

        {/* ANALYTICS */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] to-cyan-500/[0.03] pointer-events-none" />
          <Analytics />
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;