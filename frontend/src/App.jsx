import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/public/LandingPage";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
/* ADMIN */
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminManageJobs from "./pages/admin/ManageJobs";
import AdminProfile from "./pages/admin/AdminProfile";
/* JOB SEEKER */
import FindJobs from "./pages/jobseeker/FindJobs";
import JobDetails from "./pages/jobseeker/JobDetails";
import SavedJobs from "./pages/jobseeker/SavedJobs";
import UserProfile from "./pages/jobseeker/UserProfile";
import MyApplications from "./pages/jobseeker/MyApplications";
/* EMPLOYER */
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobPostingForm from "./pages/employer/JobPostingForm";
import ManageJobs from "./pages/employer/ManageJobs";
import ApplicationViewer from "./pages/employer/ApplicationViewer";
import EmployerProfilePage from "./pages/employer/EmployerProfilePage";
import EditProfileDetails from "./pages/employer/EditProfileDetails";

/* ROUTES */
import ProtectedRoute from "./routes/ProtectedRoute";

/* AUTH */
import { useAuth } from "./context/AuthContext";

/* =========================================================
   HOME ROUTE
========================================================= */

const HomeRoute = () => {
  const { user, loading } =
    useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-400">
            Loading CareerLink...
          </p>
        </div>
      </div>
    );
  }
  /* Admin*/
 if (
  user?.role ===
  "admin"
) {
  return (
    <Navigate
      to="/admin-dashboard"
      replace
    />
  );
}
  /* EMPLOYER */

  if (
    user?.role ===
    "employer"
  ) {
    return (
      <Navigate
        to="/employer-dashboard"
        replace
      />
    );
  }

  /* JOB SEEKER */

  if (
    user?.role ===
    "jobseeker"
  ) {
    return (
      <Navigate
        to="/find-jobs"
        replace
      />
    );
  }

  /* PUBLIC */

  return <LandingPage />;
};

/* =========================================================
   APP
========================================================= */

const App = () => {
  return (
    <Router>

      <div className="relative min-h-screen bg-[#020817] overflow-x-hidden">

        {/* GLOBAL BG */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_30%)]" />

        {/* GRID */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",

            backgroundSize:
              "44px 44px",
          }}
        />

        <div className="relative z-10">

          <Routes>

            {/* =========================================================
                PUBLIC ROUTES
            ========================================================= */}

            <Route
              path="/"
              element={<HomeRoute />}
            />

            <Route
              path="/signup"
              element={<SignUp />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/forgot-password"
              element={
                <ForgotPassword />
              }
            />

            <Route
              path="/reset-password"
              element={
                <ForgotPassword />
              }
            />
            <Route
  path="/about"
  element={<About />}
/>

<Route
  path="/contact"
  element={<Contact />}
/>

            {/* =========================================================
                PUBLIC JOB DETAILS
            ========================================================= */}

            <Route
              path="/job/:id"
              element={<JobDetails />}
            />
            {/* =========================================================
                ADMIN PROTECTED ROUTES
            ========================================================= */}
            <Route
  element={
    <ProtectedRoute requiredRole="admin" />
  }
>

  <Route
    path="/admin-dashboard"
    element={<AdminDashboardPage />}
  />

  <Route
    path="/admin/users"
    element={<AdminManageUsers />}
  />

  <Route
    path="/admin/jobs"
    element={<AdminManageJobs />}
  />

  <Route
    path="/admin/profile"
    element={<AdminProfile />}
  />

</Route>
            {/* =========================================================
                JOB SEEKER PROTECTED ROUTES
            ========================================================= */}

            <Route
              element={
                <ProtectedRoute requiredRole="jobseeker" />
              }
            >

              <Route
                path="/find-jobs"
                element={<FindJobs />}
              />

              <Route
                path="/saved-jobs"
                element={<SavedJobs />}
              />
              <Route
              path="/my-applications"
             element={<MyApplications />}
              />
              <Route
                path="/profile"
                element={<UserProfile />}
              />

            </Route>

            {/* =========================================================
                EMPLOYER PROTECTED ROUTES
            ========================================================= */}

            <Route
              element={
                <ProtectedRoute requiredRole="employer" />
              }
            >

              <Route
                path="/employer-dashboard"
                element={
                  <EmployerDashboard />
                }
              />

              <Route
                path="/post-job"
                element={
                  <JobPostingForm />
                }
              />

              <Route
                path="/manage-jobs"
                element={<ManageJobs />}
              />

              <Route
                path="/applicants"
                element={
                  <ApplicationViewer />
                }
              />

              <Route
                path="/company-profile"
                element={
                  <EmployerProfilePage />
                }
              />

              <Route
                path="/company-profile/edit"
                element={
                  <EditProfileDetails />
                }
              />

            </Route>

            {/* =========================================================
                FALLBACK
            ========================================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>
        </div>
      </div>

      {/* =========================================================
          TOASTER
      ========================================================= */}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,

          style: {
            fontSize: "13px",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "12px 14px",
            border:
              "1px solid rgba(255,255,255,0.08)",
            background: "#081225",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.25)",
          },

          success: {
            style: {
              border:
                "1px solid rgba(16,185,129,0.35)",
            },
          },

          error: {
            style: {
              border:
                "1px solid rgba(239,68,68,0.35)",
            },
          },
        }}
      />

    </Router>
  );
};

export default App;
