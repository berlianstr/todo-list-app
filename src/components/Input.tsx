import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  value?: string | number;
  defaultValue?: string | number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type,
  value,
  register,
  defaultValue,
  error,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        defaultValue={defaultValue}
        {...register}
        className={`w-full px-4 py-2 mt-1 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};

export default FormInput;
