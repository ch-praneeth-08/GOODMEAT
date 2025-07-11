import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// A map of predefined animation variants
const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0 },
  },
  // --- NEW VARIANT ---
  fadeDown: {
    hidden: { opacity: 0, y: -75 }, // Starts 75px ABOVE
    visible: { opacity: 1, y: 0 },   // Ends at normal position
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

function AnimateOnScroll({ children, animationType = 'fadeUp', delay = 0, className }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={animationVariants[animationType]}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.17, 0.55, 0.55, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimateOnScroll;