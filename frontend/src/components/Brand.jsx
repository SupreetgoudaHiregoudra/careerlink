import { BriefcaseBusiness } from "lucide-react";

const Brand = ({
  text = "CareerLink",
  textClassName = "text-2xl font-black tracking-tight text-slate-900",
  iconWrapperClassName = "relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-violet-500/30",
  iconClassName = "h-5 w-5 text-white",
}) => {
  return (
    <div className="group flex items-center gap-3 cursor-pointer">
      
      {/* Logo */}
      <div
        className={`${iconWrapperClassName} transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-2xl bg-white/10 blur-sm"></div>

        <BriefcaseBusiness className={`${iconClassName} relative z-10`} />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`${textClassName} bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent`}
        >
          {text}
        </span>

        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
          Find • Connect • Grow
        </span>
      </div>
    </div>
  );
};

export default Brand;