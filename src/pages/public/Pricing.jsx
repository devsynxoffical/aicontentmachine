import { useState } from "react";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";

import PricingHero from "../../components/public/PricingHero";
import BillingToggle from "../../components/public/BillingToggle";
import PricingCard from "../../components/public/PricingCard";
import PricingTable from "../../components/public/PricingTable";
import PricingFAQ from "../../components/public/PricingFAQ";

import { pricingPlans } from "../../data/pricingPlans";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <Navbar />

      <main className="bg-[#F4F6F8] min-h-screen">

        <PricingHero />

        <BillingToggle
          yearly={yearly}
          setYearly={setYearly}
        />

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6">

            <div className="grid md:grid-cols-3 gap-8">

              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  yearly={yearly}
                />
              ))}

            </div>

          </div>
        </section>
        
        <PricingTable />

        <PricingFAQ />
        
      </main>
      
      <Footer />
    </>
  );
}