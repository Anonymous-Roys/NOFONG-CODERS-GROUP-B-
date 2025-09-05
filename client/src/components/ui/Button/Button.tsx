import React from 'react';
import type { BaseComponentProps } from '../../../types';

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary-200 text-white hover:bg-primary-300 focus:ring-primary-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const seniorSizeClasses = {
    sm: 'px-4 py-2 text-base min-h-[44px]', // Minimum touch target size
    md: 'px-5 py-3 text-lg min-h-[50px]',
    lg: 'px-7 py-4 text-xl min-h-[56px]',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    seniorSizeClasses[size], // Using senior-friendly sizes
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};