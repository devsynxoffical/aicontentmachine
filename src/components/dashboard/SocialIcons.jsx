import React from "react";

/* ---------------------------------------------------------
   lucide-react v1 dropped Facebook / Instagram / LinkedIn / X,
   so these are hand-built to match lucide's 24x24, stroke-2 style.
   Reused across: contenttabs/GeneratorForm (Create Content),
   calendar.jsx (platform-colored tags), SocialPosts.jsx (filter bar),
   ads.jsx (Meta tab), Settings.jsx (Connected Accounts).
--------------------------------------------------------- */

export const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M16 8.5h-2c-.8 0-1.5.7-1.5 1.5v2h3.3l-.4 3H12.5v7h-3v-7H7.5v-3H9.5V9.8C9.5 7.4 11.2 5.5 13.6 5.5H16v3Z"
      fill="currentColor"
    />
  </svg>
);

export const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M6.9 9.5H4.3V19h2.6V9.5ZM5.6 8.3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM19.7 19h-2.6v-5.1c0-1.2-.4-2-1.5-2-.8 0-1.3.6-1.5 1.1-.1.2-.1.5-.1.8V19H11.4s.03-8.7 0-9.5H14v1.3c.3-.5 1-1.3 2.5-1.3 1.8 0 3.2 1.2 3.2 3.8V19Z"
      fill="currentColor"
    />
  </svg>
);

export const XIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M13.9 10.7 20 4h-1.6l-5.3 5.8L8.9 4H4l6.4 9L4 20h1.6l5.6-6.1L15.8 20h4.8l-6.7-9.3Zm-2 2.2-.6-.9L6 5.2h2l4.2 5.9.6.9 5.4 7.6h-2l-4.4-6.2Z"
      fill="currentColor"
    />
  </svg>
);

export const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: FacebookIcon, color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: InstagramIcon, color: "#E1306C" },
  { id: "linkedin", label: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2" },
  { id: "x", label: "X", icon: XIcon, color: "#000000" },
];