import { Link } from "react-router-dom";

import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import MotionButton from "../animations/MotionButton";

// Import Dashboard Screenshot
import dashboardSS from "../../assets/images/dashboard_ss.png";

export default function Hero() {
  return (
    <section className="bg-[#F4F6F8] py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

        {/* Left Content */}
        <FadeLeft className="flex-1">

          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] leading-tight">
            Create Unlimited Marketing Content with AI
          </h1>

          <p className="mt-4 text-[#6B7280] text-lg">
            Automate social posts, blogs, emails, ads and more with
            AI-powered content generation.
          </p>

          <div className="mt-6 flex gap-4">

            <Link to="/signup">
              <MotionButton className="bg-[#02A3B1] text-white px-6 py-3 rounded-md hover:bg-[#017A85] transition">
                Get Started Free
              </MotionButton>
            </Link>

            <a href="#how-it-works">
              <MotionButton className="border border-[#02A3B1] text-[#02A3B1] px-6 py-3 rounded-md hover:bg-[#02A3B1] hover:text-white transition">
                See How It Works
              </MotionButton>
            </a>

          </div>

        </FadeLeft>

        {/* Right Dashboard Preview */}
        <FadeRight className="flex-1">

          <div className="rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-200 bg-white">
            <img
              src={dashboardSS}
              alt="AI Content Machine Dashboard"
              className="w-full h-auto object-cover"
            />
          </div>

        </FadeRight>

      </div>
    </section>
  );
}