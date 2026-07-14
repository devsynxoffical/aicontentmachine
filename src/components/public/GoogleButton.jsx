import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Phase 1 (Placeholder)
    navigate("/");

    // Phase 2 (Replace with backend OAuth)
    // window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
    >
      <FaGoogle className="text-[#DB4437] text-base" />

      <span>Continue with Google</span>
    </button>
  );
}