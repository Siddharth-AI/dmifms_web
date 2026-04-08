"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, fadeLeft, fadeRight, fadeIn, scaleIn } from "@/lib/animations";
import { AnimationProps } from "@/types";

interface ScrollRevealProps extends AnimationProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const variantMap = {
  up: fadeUp,
  down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } } },
  left: fadeLeft,
  right: fadeRight,
  fade: fadeIn,
  scale: scaleIn,
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px 0px" });

  const baseVariant = variantMap[direction as keyof typeof variantMap] ?? fadeUp;
  const variant = {
    hidden: baseVariant.hidden,
    visible: {
      ...baseVariant.visible,
      transition: {
        ...(baseVariant.visible as { transition?: object }).transition,
        delay,
        duration,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
