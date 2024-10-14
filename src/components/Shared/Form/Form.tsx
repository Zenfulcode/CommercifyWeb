import React, { ReactNode } from 'react';

interface FormProps {
    onSubmit: (formData: Record<string, string>) => void;
    children: ReactNode;
    submitButtonText: string;
}

export function Form({ onSubmit, children, submitButtonText }: FormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {children}
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {submitButtonText}
            </button>
        </form>
    );
}

interface FormFieldProps {
    name: string;
    label: string;
    type: string;
    required?: boolean;
}

export function FormField({ name, label, type, required = false }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="block mb-1">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                required={required}
                className="w-full px-3 py-2 border rounded"
            />
        </div>
    );
}