import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  CircleDollarSign,
  Bookmark,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

import { resolveMediaUrl } from "../utils/mediaUrl";

const getApplicationStatusMeta = (status) => {
  if (!status) return null;

  const normalized = String(status).trim();

  if (normalized === "Accepted") {
    return {
      label: "Selected",
      className:
        "bg-emerald-100 text-emerald-700 border border-emerald-200",
    };
  }

  if (normalized === "Rejected") {
    return {
      label: "Not Selected",
      className:
        "bg-rose-100 text-rose-700 border border-rose-200",
    };
  }

  if (normalized === "In Review") {
    return {
      label: "In Review",
      className:
        "bg-amber-100 text-amber-700 border border-amber-200",
    };
  }

  return {
    label: "Applied",
    className:
      "bg-sky-100 text-sky-700 border border-sky-200",
  };
};

const formatSalary = (amount, currency = "INR") => {
  const value = Number(amount || 0);

  if (!Number.isFinite(value) || value <= 0) return "0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCategories = (categoryValue) => {
  if (Array.isArray(categoryValue)) {
    const values = categoryValue.filter(Boolean);

    return values.length > 0
      ? values.join(", ")
      : "General";
  }

  if (
    typeof categoryValue === "string" &&
    categoryValue.trim()
  ) {
    return categoryValue;
  }

  return "General";
};

const formatPostedDate = (value) => {
  if (!value) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const getSalarySuffix = (salaryType) => {
  if (salaryType === "Hourly") return "/hr";
  if (salaryType === "Monthly") return "/month";

  return "/year";
};

const formatSalaryRange = (job) =>
  `${formatSalary(
    job.salaryMin,
    job.currency
  )} - ${formatSalary(
    job.salaryMax,
    job.currency
  )} ${getSalarySuffix(job.salaryType)}`;

const JobCard = ({
  job,
  showSaveControl = false,
  onToggleSave,
  disableSave = false,
  isSaved = false,
  customActionLabel = "",
  onCustomAction,
  variant = "default",
}) => {
  const navigate = useNavigate();

  const applicationStatus = getApplicationStatusMeta(
    job.applicationStatus
  );

  const companyName =
    job.company?.companyName ||
    job.company?.name ||
    "Company";

  const postedDate = formatPostedDate(
    job.createdAt || job.postedAt
  );

  if (variant === "compact") {
    return (
      <article
        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        onClick={() => navigate(`/job/${job._id}`)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            navigate(`/job/${job._id}`);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-violet-50/0 to-indigo-100/40 opacity-0 transition duration-300 group-hover:opacity-100"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shrink-0">
                {job.company?.companyLogo ? (
                  <img
                    src={resolveMediaUrl(
                      job.company.companyLogo
                    )}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-slate-400" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-900">
                  {job.title}
                </h2>

                <p className="mt-1 truncate text-sm text-slate-600">
                  {companyName}
                </p>
              </div>
            </div>

            {showSaveControl && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleSave?.(job);
                }}
                disabled={disableSave}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  isSaved
                    ? "border-indigo-200 bg-indigo-100 text-indigo-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    isSaved ? "fill-current" : ""
                  }`}
                />
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <MapPin className="h-3.5 w-3.5" />
              {job.location || "N/A"}
            </span>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
              {job.type || "Full-Time"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <Briefcase className="h-3.5 w-3.5" />
              {formatCategories(job.category)}
            </span>
          </div>

          {postedDate && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Posted {postedDate}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
            <div>
              <p className="text-lg font-black text-indigo-600">
                {formatSalaryRange(job)}
              </p>
            </div>

            {applicationStatus ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStatus.className}`}
              >
                {applicationStatus.label}
              </span>
            ) : (
              <Link
                to={`/job/${job._id}`}
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                View
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      onClick={() => navigate(`/job/${job._id}`)}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          navigate(`/job/${job._id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-violet-100/40 opacity-0 transition duration-300 group-hover:opacity-100"></div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {job.company?.companyLogo ? (
                <img
                  src={resolveMediaUrl(
                    job.company.companyLogo
                  )}
                  alt={companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {job.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {job.description}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow">
            {job.type}
          </span>
        </div>

        {applicationStatus && (
          <div className="mt-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStatus.className}`}
            >
              Application Status:{" "}
              {applicationStatus.label}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-500" />
            {companyName}
          </span>

          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            {job.location || "N/A"}
          </span>

          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-violet-500" />
            {formatCategories(job.category)}
          </span>

          <span className="inline-flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />

            <span className="font-semibold text-slate-800">
              {formatSalaryRange(job)}
            </span>
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/job/${job._id}`}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {showSaveControl && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSave?.(job);
              }}
              disabled={disableSave}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                isSaved
                  ? "border-indigo-200 bg-indigo-100 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  isSaved ? "fill-current" : ""
                }`}
              />
            </button>
          )}

          {customActionLabel && onCustomAction && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCustomAction(job);
              }}
              className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              {customActionLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default JobCard;