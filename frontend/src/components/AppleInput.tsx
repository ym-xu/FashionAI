import React from 'react';
import { cn } from "../lib/utils";

interface AppleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const AppleInput: React.FC<AppleInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "px-4 py-2 rounded-lg border border-apple-gray focus:border-apple-blue focus:ring-1 focus:ring-apple-blue outline-none transition-all duration-300",
        className
      )}
      {...props}
    />
  );
};

export default AppleInput;