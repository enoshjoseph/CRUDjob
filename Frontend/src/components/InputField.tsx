import React from 'react';
import type { FieldError } from 'react-hook-form';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, className, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        className={twMerge(
          clsx(
            'mt-1 w-full border rounded px-3 py-2',
            error && 'border-red-500',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default InputField;
