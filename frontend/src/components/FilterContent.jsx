import { Search, MapPin, Sparkles } from "lucide-react";

const FilterContent = ({
  filters,
  onChange,
  onApply,
  loading,
}) => {
  return (
    <form
      onSubmit={onApply}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-xl"
    >
      {/* Decorative Background */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <div className="relative z-10 p-6 md:p-8">
        
        {/* Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              <Sparkles size={14} />
              Career Opportunities
            </div>

            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Find Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-sm md:text-base text-slate-600">
              Explore thousands of verified jobs and connect with companies
              hiring top talent through CareerLink.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.45fr_auto]">
          
          {/* Keyword */}
          <div className="group relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-600">
              <Search size={18} />
            </div>

            <input
              value={filters.keyword}
              onChange={(event) =>
                onChange("keyword", event.target.value)
              }
              placeholder="Search jobs, skills, companies..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Location */}
          <div className="group relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-violet-600">
              <MapPin size={18} />
            </div>

            <input
              value={filters.location}
              onChange={(event) =>
                onChange("location", event.target.value)
              }
              placeholder="Enter location"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? "Searching..." : "Search Jobs"}
            </span>

            <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0"></div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterContent;