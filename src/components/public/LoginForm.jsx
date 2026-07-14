import api from "../../services/api";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      // Refresh auth context so ProtectedRoute immediately knows the user
      await getCurrentUser();

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setErrors({
        general:
          err.response?.data?.message ||
          "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Email */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-[#1A1A2E]">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.email
              ? "border-red-500 focus:ring-red-300"
              : "border focus:ring-[#02A3B1]"
            }`}
        />

        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-[#1A1A2E]">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 ${errors.password
                ? "border-red-500 focus:ring-red-300"
                : "border focus:ring-[#02A3B1]"
              }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember */}
      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember Me
        </label>

        <Link
          to="/forgot-password"
          className="text-[#02A3B1] hover:underline text-sm font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-red-600 text-sm text-center">
            {errors.general}
          </p>
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#02A3B1] hover:bg-[#017A85] disabled:bg-gray-400 text-white py-2.5 rounded-lg font-semibold transition"
      >
        {loading ? "Logging In..." : "Log In"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <hr className="flex-1" />
        <span className="text-gray-500 text-xs">or</span>
        <hr className="flex-1" />
      </div>

      {/* Google */}
      <GoogleButton />

      {/* Signup */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-[#02A3B1] font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}