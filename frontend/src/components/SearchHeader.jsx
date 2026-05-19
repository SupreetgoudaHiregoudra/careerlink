import { Link } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  UserCircle2,
  Sparkles,
} from "lucide-react";

const SearchHeader = ({ title, subtitle }) => {
  const hasHeading = Boolean(title || subtitle);

  const navItems = [
    {
      to: "/find-jobs",
      label: "Browse Jobs",
      icon: Briefcase,
    },
    {
      to: "/saved-jobs",
      label: "Saved Jobs",
      icon: Bookmark,
    },
    {
      to: "/profile",
      label: "Update Profile",
      icon: UserCircle2,
    },
  ];

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-7 md:px-6">
        
        {/* Heading */}
        {(title || subtitle) && (
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              <Sparkles size={14} />
              CareerLink Workspace
            </div>

            {title ? (
              <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-white">
                {title}
              </h1>
            ) : null}

            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300 leading-7">
                {subtitle}
              </p>
            ) : null}
          </div>
        )}

        {/* Navigation */}
        <div
          className={`flex flex-wrap gap-3 ${
            hasHeading ? "mt-7" : ""
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
              >
                <Icon className="h-4 w-4 transition group-hover:scale-110" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;