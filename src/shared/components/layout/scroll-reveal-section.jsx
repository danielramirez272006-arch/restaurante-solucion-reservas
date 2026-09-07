import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ScrollRevealSection:
 * Uses Framer Motion's useInView to reveal sections when scrolled into view.
 * Animation parameters:
 * { opacity: 0, y: 40, rotate: 1 } → { opacity: 1, y: 0, rotate: 0 }
 * Duration: 0.7s, Ease: "easeOut", staggerChildren: 0.12
 */
export default function ScrollRevealSection({
  children,
  className = '',
  id,
  as = 'section',
  delay = 0,
}) {
  const ref = useRef(null);
  // Trigger when 15% of section enters viewport or -40px offset
  const isInView = useInView(ref, {
    once: true,
    margin: '-40px 0px -40px 0px',
  });

  const MotionComponent = motion[as] || motion.section;

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotate: 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        delay,
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <MotionComponent
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={sectionVariants}
    >
      {children}
    </MotionComponent>
  );
}

// Staggered child item variant to accompany sections
// eslint-disable-next-line react-refresh/only-export-components
export const scrollItemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};
