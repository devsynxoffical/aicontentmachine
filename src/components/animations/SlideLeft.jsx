import { motion } from "framer-motion";

export default function SlideLeft({
  children,
  delay = 0,
  duration = 0.6,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 60,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}