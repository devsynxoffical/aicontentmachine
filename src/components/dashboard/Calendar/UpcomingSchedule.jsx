import { Clock } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const upcomingPosts = [
  {
    title: "Summer Sale Campaign",
    platform: "Facebook",
    time: "Today • 11:00 AM",
  },
  {
    title: "Coffee Launch",
    platform: "Instagram",
    time: "Tomorrow • 9:30 AM",
  },
  {
    title: "AI in Marketing",
    platform: "LinkedIn",
    time: "Jul 5 • 2:00 PM",
  },
  {
    title: "Flash Offer",
    platform: "X",
    time: "Jul 6 • 7:00 PM",
  },
];

const platformIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  X: FaXTwitter,
};

const platformColors = {
  Facebook: "text-[#1877F2]",
  Instagram: "text-pink-500",
  LinkedIn: "text-[#0A66C2]",
  X: "text-black",
};

export default function UpcomingSchedule() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">

      {/* Header */}

      <div className="px-6 py-5 border-b">

        <h2 className="text-xl font-semibold text-[#1A1A2E]">
          Upcoming Schedule
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Next 7 days
        </p>

      </div>

      {/* List */}

      <div className="divide-y">

        {upcomingPosts.map((post, index) => {

          const Icon = platformIcons[post.platform];

          return (
            <div
              key={index}
              className="flex items-center gap-4 p-5 hover:bg-[#F8FAFC] transition"
            >

              <div className="w-11 h-11 rounded-xl bg-[#E0F7FA] flex items-center justify-center">

                <Icon
                  size={20}
                  className={platformColors[post.platform]}
                />

              </div>

              <div className="flex-1">

                <h3 className="font-medium text-[#1A1A2E]">
                  {post.title}
                </h3>

                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">

                  <Clock size={14} />

                  {post.time}

                </div>

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}