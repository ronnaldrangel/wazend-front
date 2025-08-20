import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const FormInput = forwardRef((
  {
    label,
    id,
    name,
    type = 'text',
    placeholder,
    required = false,
    className,
    labelClassName,
    containerClassName,
    error,
    helperText,
    rightElement,
    ...props
  },
  ref
) => {
  return (
    <div className={cn('', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium leading-6 text-foreground',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className={cn('relative', label && 'mt-2')}>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={cn(
            'block w-full rounded-md border-0 py-3 px-4 bg-background text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary text-base leading-6',
            rightElement && 'pr-12',
            error && 'ring-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {rightElement}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;