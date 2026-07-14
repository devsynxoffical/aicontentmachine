export default function FeatureSection({
  title,
  description,
  points,
  reverse = false,
}) {
  return (
    <section className="py-24">
      <div
        className={`max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center ${
          reverse ? "lg:grid-flow-dense" : ""
        }`}
      >
        {/* Text */}
        <div className={reverse ? "lg:col-start-2" : ""}>
          <h2 className="text-4xl font-bold text-[#1A1A2E] mb-6">
            {title}
          </h2>

          <p className="text-gray-600 leading-8 mb-8">
            {description}
          </p>

          <ul className="space-y-4">
            {points.map((item, index) => (
              <li key={index} className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-[#02A3B1] mt-2"></div>

                <span className="text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preview Card */}
        <div className={reverse ? "lg:col-start-1" : ""}>
          <div className="bg-white rounded-3xl shadow-xl border p-8">

            <div className="flex justify-between mb-6">
              <h3 className="font-semibold text-[#1A1A2E]">
                {title}
              </h3>

              <span className="bg-[#E0F7FA] text-[#017A85] px-3 py-1 rounded-lg text-sm">
                AI
              </span>
            </div>

            <div className="space-y-4">

              <div className="h-4 bg-gray-200 rounded"></div>

              <div className="h-4 bg-gray-200 rounded w-4/5"></div>

              <div className="h-4 bg-gray-200 rounded w-3/5"></div>

              <div className="mt-8 bg-[#F4F6F8] rounded-xl h-40 flex items-center justify-center text-gray-400">
                Feature Preview
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}