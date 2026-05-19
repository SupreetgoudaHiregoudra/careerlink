import {
  Building2,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock3,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const formatCurrency = (
  value,
  currency = "INR"
) => {
  const amount = Number(
    value || 0
  );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return "Not specified";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(amount);
};

const getSalaryTypeLabel = (
  salaryType
) => {
  if (salaryType === "Hourly")
    return "per hour";

  if (salaryType === "Monthly")
    return "per month";

  return "per year";
};

const JobPostingPreview = ({
  values,
}) => {
  const currency =
    values?.currency || "INR";

  const salaryType =
    values?.salaryType ||
    "Yearly";

  const salaryMin =
    formatCurrency(
      values?.salaryMin,
      currency
    );

  const salaryMax =
    formatCurrency(
      values?.salaryMax,
      currency
    );

  const companyName =
    values?.companyName?.trim() ||
    "Your Company";

  const categories =
    Array.isArray(
      values?.category
    )
      ? values.category.filter(
          Boolean
        )
      : String(
          values?.category || ""
        )
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

  return (
    <section className="sticky top-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
      
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-6">
        
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize:
                "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Live Preview
          </div>

          <h2 className="mt-4 text-3xl font-black text-white">
            {values?.title?.trim()
              ? values.title
              : "Untitled Job Role"}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-indigo-100">
            
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {companyName}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {values?.location?.trim() ||
                "Location not specified"}
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {values?.type ||
                "Full-Time"}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-6">
        
        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-2">
            {categories.length >
            0 ? (
              categories.map(
                (category) => (
                  <span
                    key={
                      category
                    }
                    className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                  >
                    {category}
                  </span>
                )
              )
            ) : (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                General
              </span>
            )}

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {currency}
            </span>

            <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
              {salaryType}
            </span>
          </div>
        </div>

        {/* Salary Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <IndianRupee className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Minimum Salary
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  {salaryMin}
                </h3>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              {getSalaryTypeLabel(
                salaryType
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <IndianRupee className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Maximum Salary
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  {salaryMax}
                </h3>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              {getSalaryTypeLabel(
                salaryType
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Job Description
              </h3>

              <p className="text-sm text-slate-400">
                Responsibilities and
                overview
              </p>
            </div>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {values?.description?.trim()
              ? values.description
              : "No description added yet."}
          </p>
        </div>

        {/* Requirements */}
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Requirements
              </h3>

              <p className="text-sm text-slate-400">
                Skills and experience
              </p>
            </div>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {values?.requirements?.trim()
              ? values.requirements
              : "No requirements added yet."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default JobPostingPreview;