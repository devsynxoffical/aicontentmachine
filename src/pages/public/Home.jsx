import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import HowItWorks from "../../components/public/HowItWorks";
import FeaturesGrid from "../../components/public/FeaturesGrid";
import SocialProof from "../../components/public/SocialProof";
import PricingPreview from "../../components/public/PricingPreview";
import Footer from "../../components/public/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <SocialProof />
      <PricingPreview />
      <Footer />
    </>
  );
}