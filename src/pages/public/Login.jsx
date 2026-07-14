import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import AuthLayout from "../../components/public/AuthLayout";
import LoginForm from "../../components/public/LoginForm";

export default function Login() {
  return (
    <>
      <Navbar />

      <AuthLayout
        title="Welcome Back"
        subtitle="Log in to continue creating AI-powered marketing content."
        leftTitle={"Create Marketing\nContent with AI"}
        leftDescription="Generate blogs, social posts, advertisements and emails from one intelligent workspace."
      >
        <LoginForm />
      </AuthLayout>

      <Footer />
    </>
  );
}