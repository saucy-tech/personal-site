'use client';

import { BaseProps } from '@/types';
import { cn } from '@/utils/helpers';

interface ButtonProps extends BaseProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export default function Button({
  children,
  className,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

