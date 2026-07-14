export default function SocialProof() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy">
            Trusted by Growing Teams
          </h2>
          <p className="text-grayText mt-3">
            Businesses around the world use DevSynx AI to scale content creation
          </p>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap justify-center gap-10 items-center opacity-70 mb-16">
          <div className="text-xl font-semibold text-grayText">Google</div>
          <div className="text-xl font-semibold text-grayText">Microsoft</div>
          <div className="text-xl font-semibold text-grayText">Amazon</div>
          <div className="text-xl font-semibold text-grayText">Spotify</div>
          <div className="text-xl font-semibold text-grayText">Airbnb</div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-[#F4F6F8] p-6 rounded-xl shadow-md">
            <p className="text-grayText italic">
              "DevSynx AI completely changed how we create marketing content.
              It saves us hours every week."
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-navy">Sarah Johnson</h4>
              <span className="text-sm text-grayText">Marketing Manager</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F4F6F8] p-6 rounded-xl shadow-md">
            <p className="text-grayText italic">
              "The AI-generated content is high quality and ready to publish
              with minimal editing."
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-navy">David Lee</h4>
              <span className="text-sm text-grayText">Startup Founder</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F4F6F8] p-6 rounded-xl shadow-md">
            <p className="text-grayText italic">
              "We scaled our social media output 5x using DevSynx AI tools."
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-navy">Ayesha Khan</h4>
              <span className="text-sm text-grayText">Social Media Lead</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}