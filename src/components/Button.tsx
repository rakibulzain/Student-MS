'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { JSX, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps): JSX.Element => {
  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-black dark:text-white hover:bg-blue-600 focus:ring-primary',
    secondary:
      'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
