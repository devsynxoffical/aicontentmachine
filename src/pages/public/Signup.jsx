import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import AuthLayout from "../../components/public/AuthLayout";
import SignupForm from "../../components/public/SignupForm";

export default function Signup() {
  return (
    <>
      <Navbar />

      <AuthLayout
        title="Create Your Account"
        subtitle="Start creating unlimited AI-powered content today."
        leftTitle={"Grow Your Business\nwith DevSynx"}
        leftDescription="Join thousands of marketers, creators and businesses using AI to produce high-quality content in minutes."
      >
        <SignupForm />
      </AuthLayout>

      <Footer />
    </>
  );
}