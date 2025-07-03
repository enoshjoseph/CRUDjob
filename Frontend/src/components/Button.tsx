import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={twMerge(
        clsx(
          'w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
