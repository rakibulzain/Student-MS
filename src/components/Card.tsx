'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { JSX, ReactNode } from 'react';

/* Props type */
type CardProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  className?: string;
};

const Card = ({
  children,
  className = '',
  ...props
}: CardProps): JSX.Element => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
