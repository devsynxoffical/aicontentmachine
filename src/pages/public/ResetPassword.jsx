import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import AuthLayout from "../../components/public/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!token) {
      newErrors.general = "Secure token is missing. Please request a new password reset link.";
    }

    if (!password) {
      newErrors.password = "New password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrors({
        general:
          err.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <AuthLayout
        title="Reset Password"
        subtitle="Set a new, strong password to secure your account."
        leftTitle={"Secure Your\nAccount Integrity"}
        leftDescription="Choose a strong password containing letters, numbers, and special symbols to safeguard your visual and text content creators."
      >
        {success ? (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#1A1A2E]">
                Password Reset Successfully!
              </h3>
              <p className="text-sm text-gray-500">
                Your password has been successfully updated. Redirecting you to the login page...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-red-600 text-sm text-center">
                  {errors.general}
                </p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#1A1A2E]">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "", general: "" }));
                  }}
                  placeholder="Enter at least 6 characters"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-300"
                      : "border focus:ring-[#02A3B1]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#1A1A2E]">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "", general: "" }));
                  }}
                  placeholder="Verify new password"
                  className={`w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-300"
                      : "border focus:ring-[#02A3B1]"
                  }`}
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-[#02A3B1] hover:bg-[#017A85] disabled:bg-gray-400 text-white py-2.5 rounded-lg font-semibold transition"
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
          </form>
        )}
      </AuthLayout>

      <Footer />
    </>
  );
}
