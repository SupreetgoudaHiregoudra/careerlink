// utils/data.js

import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
  Sparkles,
  UserCheck,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| JOB SEEKER FEATURES
|--------------------------------------------------------------------------
*/

export const jobSeekerFeatures = [
  {
    icon: Search,

    title: "Smart Job Discovery",

    description:
      "Explore jobs across multiple domains with easy filtering and search features.",
  },

  {
    icon: FileText,

    title: "Resume Upload",

    description:
      "Upload your resume once and apply to multiple opportunities seamlessly.",
  },

  {
    icon: MessageSquare,

    title: "Direct Communication",

    description:
      "Connect with recruiters and hiring companies through the platform.",
  },

  {
    icon: Award,

    title: "Build Your Professional Profile",

    description:
      "Showcase your skills, education, experience and career achievements.",
  },

  {
    icon: Sparkles,

    title: "Personalized Experience",

    description:
      "Manage saved jobs, applications and career opportunities in one place.",
  },
];

/*
|--------------------------------------------------------------------------
| EMPLOYER FEATURES
|--------------------------------------------------------------------------
*/

export const employerFeatures = [
  {
    icon: Users,

    title: "Access Top Talent",

    description:
      "Discover skilled candidates from different industries and technologies",
  },

  {
    icon: BarChart3,

    title: "Advanced Analytics",

    description:
      "Track applications, engagement and hiring performance efficiently.",
  },

  {
    icon: Shield,

    title: "Organized Hiring Process",

    description:
      "Manage applicants using structured dashboards and application tracking.",
  },

  {
    icon: Clock,

    title: "Faster Recruitment Workflow",

    description:
      "Post jobs and review candidates with a streamlined hiring process.",
  },

  {
    icon: UserCheck,

    title: "Easy Applicant Management",

    description:
      "Shortlist, review and manage applicants from a centralized dashboard.",
  },
];

/*
|--------------------------------------------------------------------------
| EMPLOYER SIDEBAR NAVIGATION
|--------------------------------------------------------------------------
*/

export const NAVIGATION_MENU = [
  {
    id: "employer-dashboard",

    name: "Dashboard",

    icon: LayoutDashboard,
  },

  {
    id: "post-job",

    name: "Post a Job",

    icon: Plus,
  },

  {
    id: "manage-jobs",

    name: "Manage Jobs",

    icon: Briefcase,
  },

  {
    id: "company-profile",

    name: "Company Profile",

    icon: Building2,
  },
];

/*
|--------------------------------------------------------------------------
| JOB CATEGORIES
|--------------------------------------------------------------------------
*/

export const CATEGORIES = [
  {
    value: "Engineering",

    label: "Engineering",
  },

  {
    value: "Design",

    label: "Design",
  },

  {
    value: "Marketing",

    label: "Marketing",
  },

  {
    value: "Sales",

    label: "Sales",
  },

  {
    value: "IT & Software",

    label: "IT & Software",
  },

  {
    value: "Customer-service",

    label: "Customer Service",
  },

  {
    value: "Product",

    label: "Product",
  },

  {
    value: "Operations",

    label: "Operations",
  },

  {
    value: "Finance",

    label: "Finance",
  },

  {
    value: "HR",

    label: "Human Resources",
  },

  {
    value: "Other",

    label: "Other",
  },
];

/*
|--------------------------------------------------------------------------
| JOB TYPES
|--------------------------------------------------------------------------
*/

export const JOB_TYPES = [
  {
    value: "Full-Time",

    label: "Full-Time",
  },

  {
    value: "Part-Time",

    label: "Part-Time",
  },

  {
    value: "Contract",

    label: "Contract",
  },

  {
    value: "Internship",

    label: "Internship",
  },

  {
    value: "Remote",

    label: "Remote",
  },
];

/*
|--------------------------------------------------------------------------
| SALARY RANGES
|--------------------------------------------------------------------------
*/

export const SALARY_RANGES = [
  {
    value: "0-50000",

    label: "₹0 - ₹50K",
  },

  {
    value: "50000-100000",

    label: "₹50K - ₹1L",
  },

  {
    value: "100000-300000",

    label: "₹1L - ₹3L",
  },

  {
    value: "300000-700000",

    label: "₹3L - ₹7L",
  },

  {
    value: "700000-1500000",

    label: "₹7L - ₹15L",
  },

  {
    value: "1500000+",

    label: "₹15L+",
  },
];