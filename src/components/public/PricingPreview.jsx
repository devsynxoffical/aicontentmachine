import { Link } from "react-router-dom";
import PricingCard from "./PricingCard";
import { pricingPlans } from "../../data/pricingPlans";

export default function PricingPreview() {
  return (
    <section className="py-24 bg-[#F4F6F8]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl font-bold text-[#1A1A2E]">
            Simple, Transparent Pricing
          </h2>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto">
            Start for free and upgrade whenever your business grows.
            No hidden charges. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={false}
              preview={true}
            />
          ))}
        </div>

        {/* Bottom Button */}
        <div className="text-center mt-14">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 font-semibold text-[#02A3B1] hover:text-[#017A85] transition"
          >
            View Complete Pricing →
          </Link>
        </div>

      </div>
    </section>
  );
}