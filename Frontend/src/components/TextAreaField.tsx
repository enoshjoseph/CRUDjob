import React from 'react';
import type { FieldError } from 'react-hook-form';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, error, className, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <textarea
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

export default TextAreaField;
