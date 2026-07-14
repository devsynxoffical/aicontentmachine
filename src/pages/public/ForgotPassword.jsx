import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import AuthLayout from "../../components/public/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <AuthLayout
        title="Forgot Password?"
        subtitle="No worries, we'll send you instructions to reset it."
        leftTitle={"Recover Your\nIntelligent Workspace"}
        leftDescription="Follow the quick steps to regain secure access to your AI writing and automation workspace."
      >
        {success ? (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F7FA] text-[#02A3B1]">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#1A1A2E]">
                Check your email
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                If an account matches <strong>{email}</strong>, we have sent a secure link to reset your password.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#02A3B1] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#1A1A2E]">
                Email Address
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your registered email"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-300"
                      : "border focus:ring-[#02A3B1]"
                  }`}
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#02A3B1] hover:bg-[#017A85] disabled:bg-gray-400 text-white py-2.5 rounded-lg font-semibold transition"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#02A3B1] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Log In
              </Link>
            </div>
          </form>
        )}
      </AuthLayout>

      <Footer />
    </>
  );
}
