import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your subscription at any time. Your plan remains active until the end of your current billing period.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes. Our Free plan lets you experience the platform before upgrading to Pro or Business.",
  },
  {
    question: "What are AI credits?",
    answer:
      "AI credits are consumed whenever you generate AI content or images. Each subscription includes a different number of credits.",
  },
  {
    question: "Can I upgrade or downgrade later?",
    answer:
      "Absolutely. You can change your subscription whenever you want from your account settings.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards and other secure online payment methods.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption and security practices to keep your information safe.",
  },
  {
    question: "Do Business plans include priority support?",
    answer:
      "Yes. Business customers receive priority customer support along with advanced collaboration features.",
  },
];

export default function PricingFAQ() {
  const [active, setActive] = useState(null);

  const toggleFAQ = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#1A1A2E]">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-600">
            Answers to the most common questions about our pricing plans.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#F4F6F8] rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#1A1A2E]">
                  {faq.question}
                </span>

                {active === index ? (
                  <ChevronUp
                    size={20}
                    className="text-[#02A3B1]"
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    className="text-[#02A3B1]"
                  />
                )}
              </button>

              {active === index && (
                <div className="px-6 pb-6 text-gray-600 leading-7">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}