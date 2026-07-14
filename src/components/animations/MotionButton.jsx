import { motion } from "framer-motion";

export default function MotionButton({
  children,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        duration: 0.2,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}