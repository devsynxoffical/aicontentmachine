import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo/text_logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-0 py-3">

        {/* Logo */}
        <Link to="/">
          <motion.img
            src={logo}
            alt="DEVSYNX Logo"
            className="h-14 w-15"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A1A2E]">

          <motion.div whileHover={{ scale: 1.08 }}>
            <Link
              to="/"
              className="hover:text-[#02A3B1] transition-colors"
            >
              Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.08 }}>
            <Link
              to="/features"
              className="hover:text-[#02A3B1] transition-colors"
            >
              Features
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.08 }}>
            <Link
              to="/pricing"
              className="hover:text-[#02A3B1] transition-colors"
            >
              Pricing
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.08 }}>
            <Link
              to="/blog"
              className="hover:text-[#02A3B1] transition-colors"
            >
              Blog
            </Link>
          </motion.div>

        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/login"
              className="font-medium text-[#02A3B1] hover:text-[#017A85]"
            >
              Log In
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/signup"
              className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-[#1A1A2E]"
          aria-label="Toggle menu"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t bg-white px-6 py-5 space-y-4 overflow-hidden"
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block hover:text-[#02A3B1]"
            >
              Home
            </Link>

            <Link
              to="/features"
              onClick={() => setOpen(false)}
              className="block hover:text-[#02A3B1]"
            >
              Features
            </Link>

            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="block hover:text-[#02A3B1]"
            >
              Pricing
            </Link>

            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="block hover:text-[#02A3B1]"
            >
              Blog
            </Link>

            <hr />

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block text-[#02A3B1] font-medium"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-[#02A3B1] hover:bg-[#017A85] text-white py-3 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}