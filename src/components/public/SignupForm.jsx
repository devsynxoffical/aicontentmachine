import api from "../../services/api";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";

export default function SignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // -----------------------------
  // Handle Input Change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // -----------------------------
  // Validation
  // -----------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim())
      newErrors.fullName =
        "Full name is required.";

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email)
      newErrors.email =
        "Email is required.";
    else if (!emailRegex.test(form.email))
      newErrors.email =
        "Please enter a valid email.";

    if (!form.password)
      newErrors.password =
        "Password is required.";
    else if (form.password.length < 8)
      newErrors.password =
        "Password must be at least 8 characters.";

    if (!form.confirmPassword)
      newErrors.confirmPassword =
        "Please confirm your password.";
    else if (
      form.password !==
      form.confirmPassword
    )
      newErrors.confirmPassword =
        "Passwords do not match.";

    if (!form.agree)
      newErrors.agree =
        "You must agree to the Terms & Privacy Policy.";

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post(
        "/auth/signup",
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      setErrors((prev) => ({
        ...prev,
        general:
          err.response?.data?.message ||
          "Signup failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };
  // -----------------------------
  // Password Strength
  // -----------------------------
  const getStrength = () => {
    const password = form.password;

    if (password.length === 0) return null;

    if (password.length < 8)
      return {
        text: "Weak",
        color: "text-red-500",
        bg: "bg-red-500",
        width: "w-1/3",
      };

    const strong =
      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(
        password
      );

    if (strong)
      return {
        text: "Strong",
        color: "text-green-600",
        bg: "bg-green-500",
        width: "w-full",
      };

    return {
      text: "Medium",
      color: "text-yellow-500",
      bg: "bg-yellow-500",
      width: "w-2/3",
    };
  };

  const strength = getStrength();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Full Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#1A1A2E]">
          Full Name
        </label>

        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 ${errors.fullName
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-[#02A3B1]"
            }`}
        />

        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#1A1A2E]">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your work email"
          className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 ${errors.email
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-[#02A3B1]"
            }`}
        />

        {errors.email && (
          <p className="text-xs text-red-500 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#1A1A2E]">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={`w-full border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${errors.password
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#02A3B1]"
              }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {strength && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.bg} ${strength.width}`}
              />
            </div>

            <p
              className={`text-xs mt-1 ${strength.color}`}
            >
              Password Strength:{" "}
              {strength.text}
            </p>
          </div>
        )}

        {errors.password && (
          <p className="text-xs text-red-500 mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#1A1A2E]">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            value={
              form.confirmPassword
            }
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${errors.confirmPassword
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-[#02A3B1]"
              }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">
            {
              errors.confirmPassword
            }
          </p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-2 text-xs text-gray-600 leading-5">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="mt-1"
          />

          <span>
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-[#02A3B1] hover:underline"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              to="/privacy"
              className="text-[#02A3B1] hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {errors.agree && (
          <p className="text-xs text-red-500 mt-1">
            {errors.agree}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3">
          <p className="text-sm text-red-600 text-center">
            {errors.general}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#02A3B1] hover:bg-[#017A85] disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Creating...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-3">
          <CheckCircle2
            size={18}
            className="text-green-600"
          />

          <p className="text-sm text-green-700">
            Account created successfully!
            Redirecting to Login...
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <hr className="flex-1" />

        <span className="text-xs text-gray-500">
          or
        </span>

        <hr className="flex-1" />
      </div>

      {/* Google */}
      <GoogleButton />

      {/* Login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#02A3B1] font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </form>
  );
}