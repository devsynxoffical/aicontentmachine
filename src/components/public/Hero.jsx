import { Link } from "react-router-dom";

import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import MotionButton from "../animations/MotionButton";

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

        {/* Right Mockup */}
        <FadeRight className="flex-1">

          <div className="bg-white shadow-md rounded-xl h-80 flex items-center justify-center text-[#6B7280]">
            Dashboard Preview Image
          </div>

        </FadeRight>

      </div>
    </section>
  );
}