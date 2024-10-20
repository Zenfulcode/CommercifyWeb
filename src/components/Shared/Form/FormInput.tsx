import React from 'react'

type FormInputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean;
    type?: string;
    options?: { value: string; label: string }[];
    className?: string;
};

const FormInput = ({
    label,
    name,
    value,
    onChange,
    required = false,
    type = "text",
    options,
    className = "",
    ...props
}: FormInputProps) => {
    const inputClasses = "w-full mt-1 px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={name} className="block text-gray-700">{label}</label>
            {type === "select" ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClasses}
                    {...props}
                >
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClasses}
                    {...props}
                />
            )}
        </div>
    );
}

export default FormInput