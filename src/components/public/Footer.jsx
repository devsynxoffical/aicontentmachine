import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-gray-300">DEV</span>
              <span className="text-teal-700">SYNX</span>
            </h2>

            <h3 className="text-gray-400">Private Limited</h3>

            <p className="mt-4 text-sm leading-6 text-gray-300">
              Empowering businesses with AI-driven solutions to create,
              optimize, and scale high-quality digital content faster,
              smarter, and more efficiently.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/features"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  to="/pricing"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  to="/updates"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/careers"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#02A3B1] transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>

            <div className="flex gap-4 text-xl">
              <FaFacebook className="cursor-pointer transition hover:text-[#02A3B1]" />
              <FaInstagram className="cursor-pointer transition hover:text-[#02A3B1]" />
              <FaLinkedin className="cursor-pointer transition hover:text-[#02A3B1]" />
              <FaXTwitter className="cursor-pointer transition hover:text-[#02A3B1]" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} DEVSYNX Private Limited. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}