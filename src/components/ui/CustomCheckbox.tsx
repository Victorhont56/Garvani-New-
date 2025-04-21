import { useState, useEffect } from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const CustomCheckbox = ({
  checked,
  onChange,
  className = "",
  disabled = false,
}: CustomCheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onChange(newChecked);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleChange}
      className={`
        relative 
        h-6 w-6 
        rounded 
        border-2 
        flex items-center justify-center 
        transition-colors 
        focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${isChecked
          ? "bg-red-500 border-red-700" // Darker red border when checked
          : "border-red-500 bg-white" // Bright red border when unchecked
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        shadow-lg // Stronger shadow
        ring-2 ring-offset-2 ring-white // White ring around checkbox
      `}
    >
      {isChecked && (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};