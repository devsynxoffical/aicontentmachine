import { motion } from "framer-motion";

export default function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
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