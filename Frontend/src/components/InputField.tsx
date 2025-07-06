import React from 'react';
import type { FieldError } from 'react-hook-form';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

const InputField = React.forwardRef<HTMLInputElement,InputFieldProps>(({ label, error, className, ...props },ref) => {
    return (
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <input
          ref={ref}
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
  }
);

InputField.displayName='InputField';

export default InputField;
