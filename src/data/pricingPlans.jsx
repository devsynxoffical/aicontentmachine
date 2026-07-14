export const pricingPlans = [
  {
    id: 1,
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for individuals getting started with AI content.",
    color: "gray",
    popular: false,
    features: [
      "20 AI Credits / Month",
      "Social Media Posts",
      "Basic Blog Writer",
      "Email Support",
    ],
  },

  {
    id: 2,
    name: "Pro",
    priceMonthly: 29,
    priceYearly: 24,
    description: "Best for freelancers, creators and growing businesses.",
    color: "teal",
    popular: true,
    features: [
      "Unlimited AI Credits",
      "Blog Writer",
      "Email Campaigns",
      "AI Images",
      "Analytics Dashboard",
      "Content Calendar",
      "Priority Support",
    ],
  },

  {
    id: 3,
    name: "Business",
    priceMonthly: 79,
    priceYearly: 65,
    description: "Built for agencies and enterprise marketing teams.",
    color: "navy",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited Team Members",
      "Advanced Analytics",
      "API Access",
      "White Label",
      "Dedicated Manager",
    ],
  },
];