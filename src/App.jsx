import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/public/Home";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import PublicBlog from "./pages/public/Blog";


// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import CreateContent from "./pages/dashboard/CreateContent";
import Calendar from "./pages/dashboard/Calendar";
import SocialPosts from "./pages/dashboard/SocialPosts";
import Blog from "./pages/dashboard/Blog";
import Email from "./pages/dashboard/Email";
import Ads from "./pages/dashboard/Ads";
import Images from "./pages/dashboard/Images";
import Repurpose from "./pages/dashboard/Repurpose";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ==========================
          Public Routes
      ========================== */}

      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/blog" element={<PublicBlog />} />

      {/* ==========================
          Protected Dashboard
      ========================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/create-content"
        element={
          <ProtectedRoute>
            <CreateContent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/social-posts"
        element={
          <ProtectedRoute>
            <SocialPosts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/blog"
        element={
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/email"
        element={
          <ProtectedRoute>
            <Email />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/ads"
        element={
          <ProtectedRoute>
            <Ads />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/images"
        element={
          <ProtectedRoute>
            <Images />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/repurpose"
        element={
          <ProtectedRoute>
            <Repurpose />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ==========================
          404
      ========================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}