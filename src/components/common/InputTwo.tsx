"use client";

import { FieldErrors, FieldValues, UseFormRegister, RegisterOptions } from "react-hook-form";
import { TbCurrencyNaira } from "react-icons/tb";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputTwoProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  validate?: (value: any) => true | string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  registerOptions?: RegisterOptions<FieldValues>;
}

const Input: React.FC<InputTwoProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  registerOptions = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="w-full relative">
      {formatPrice && (
        <TbCurrencyNaira
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { 
          required,
          ...registerOptions
        })}
        placeholder=" "
        type={isPasswordField && showPassword ? "text" : type}
        className={`
          peer
          w-full
          p-[10px]
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${isPasswordField ? "pr-10" : ""}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      {isPasswordField && (
        <button
          type="button"
          className="absolute px-4 right-1 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
      <label
        className={`
          absolute 
          text-[12px]
          duration-150 
          transform 
          -translate-y-3 
          top-[15px] 
          z-10 
          origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
      {errors[id] && (
        <p className="mt-1 text-rose-500 text-sm">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  );
};

export default Input;