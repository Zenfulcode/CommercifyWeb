"use client";

import React from 'react';
import { LockIcon, UserIcon, CreditCard } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { title: 'Sign In', icon: <LockIcon className="h-4 w-4" /> },
        { title: 'Information', icon: <UserIcon className="h-4 w-4" /> },
        { title: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
    ];

    return (
        <div className="w-full py-4">
            <div className="flex justify-between relative">
                {/* Progress bar */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                {steps.map((step, index) => (
                    <div
                        key={step.title}
                        className={`relative flex flex-col items-center gap-2 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                            }`}
                    >
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'}
              transition-colors duration-300
            `}>
                            {step.icon}
                        </div>
                        <span className="text-sm font-medium">{step.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}