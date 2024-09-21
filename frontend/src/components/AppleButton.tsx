import React from 'react';
import { cn } from "../lib/utils";

interface AppleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const AppleButton: React.FC<AppleButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  return (
    <button
      className={cn(
        "rounded-full font-semibold transition-all duration-300",
        variant === 'primary' 
          ? "bg-apple-blue text-white hover:bg-opacity-90" 
          : "bg-apple-light-gray text-apple-blue hover:bg-opacity-90",
        size === 'sm' ? "px-3 py-1 text-sm" :
        size === 'lg' ? "px-6 py-3 text-lg" :
        "px-4 py-2 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AppleButton;