"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

interface HorizontalLoginFormProps {
    onLogin: (email: string, password: string) => Promise<void>;
}

export default function HorizontalLoginForm({ onLogin }: HorizontalLoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onLogin(email, password);
            // Clear form fields after successful login
            setEmail('');
            setPassword('');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="px-2 py-1 border rounded text-sm flex-grow"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="px-2 py-1 border rounded text-sm flex-grow"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            >
                Login
            </button>
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </form>
    );
}