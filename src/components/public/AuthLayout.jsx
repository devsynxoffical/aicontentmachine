export default function AuthLayout({
  title,
  subtitle,
  children,

  // Left side props
  leftTitle = "Create Marketing\nContent with AI",
  leftDescription =
    "Generate blogs, emails, advertisements, social media posts and more from one intelligent platform.",
}) {
  return (
    <section className="min-h-screen bg-[#F4F6F8] flex items-center justify-center px-6 py-4">

      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#017A85] to-[#02A3B1] text-white p-6">

          <h1 className="text-4xl font-bold leading-tight whitespace-pre-line">
            {leftTitle}
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/90">
            {leftDescription}
          </p>

          <div className="mt-6 bg-white/10 rounded-xl p-5 border border-white/20">

            <div className="h-2.5 bg-white/30 rounded w-3/4 mb-2"></div>

            <div className="h-2.5 bg-white/30 rounded w-full mb-2"></div>

            <div className="h-2.5 bg-white/30 rounded w-5/6 mb-5"></div>

            <div className="grid grid-cols-2 gap-3">

              <div className="bg-white/20 rounded-lg h-16"></div>

              <div className="bg-white/20 rounded-lg h-16"></div>

            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="p-6 md:p-7 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-[#1A1A2E]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {subtitle}
          </p>

          <div className="mt-3">
            {children}
          </div>

        </div>

      </div>

    </section>
  );
}