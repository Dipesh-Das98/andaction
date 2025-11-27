'use client';

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
// this has been changed by ankush we need to fix it later
export interface DateInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  disabledDates?: Date[];
  value?: string | Date | null;
  onChange?: (e: any) => void;  // ACCEPT BOTH event + date
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;

  /** optional: force picker or native */
  mode?: 'native' | 'picker';
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      className = '',
      id,
      onChange,
      value,
      mode,
      disabledDates = [],
      placeholder = 'Select a date',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `date-input-${Math.random().toString(36).substr(2, 9)}`;

    /** Automatically choose native input for string DOB pattern */
    const autoMode =
      mode ??
      (typeof value === 'string' ? 'native' : 'picker');

    const parsedDate =
      typeof value === 'string'
        ? value
        : value instanceof Date
        ? value.toISOString().slice(0, 10)
        : '';

    /** unified onChange handler */
    const handleChange = (val: any) => {
      if (autoMode === 'native') {
        // send event-like structure to keep OLD code working
        onChange?.({ target: { value: val.target.value } });
      } else {
        // react-datepicker gives Date
        onChange?.(val);
      }
    };

    const baseClasses = `
      w-full md:px-4 px-3 py-3 placeholder-text-gray
      border rounded-lg transition-all duration-200
      focus:outline-none focus:ring-0 focus:border-primary-pink
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantClasses = {
      default: `bg-[#1B1B1B] border-border-color hover:border-[#404040]`,
      filled: `bg-card border-border-color hover:border-[#404040]`,
    };

    const errorClasses = error
      ? 'border-red-500 focus:border-red-500'
      : '';

    const allClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block section-text mb-1">
            {label}
          </label>
        )}

        {/* NATIVE INPUT - old behaviour (DOB typing) */}
        {autoMode === 'native' && (
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={parsedDate}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className={allClasses}
            {...props}
          />
        )}

        {/* REACT DATE PICKER - only used where needed */}
        {autoMode === 'picker' && (
          <div className="relative">
            <DatePicker
              selected={value instanceof Date ? value : null}
              onChange={(date) => onChange?.(date)}
              excludeDates={disabledDates}
              placeholderText={placeholder}
              disabled={disabled}
              id={inputId}
              className={allClasses}
              wrapperClassName="w-full"
              calendarClassName="custom-datepicker"
              dateFormat="MMM dd, yyyy"
              showPopperArrow={false}
              required={required}
            />

            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-text-gray">{helperText}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
export default DateInput;
