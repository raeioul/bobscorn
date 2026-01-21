
import React from 'react';

interface CooldownWatchProps {
    remainingTime: number;
    totalTime?: number;
}

export const CooldownWatch: React.FC<CooldownWatchProps> = ({ remainingTime, totalTime = 60 }) => {
    const radius = 40;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (remainingTime / totalTime) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative flex items-center justify-center">
                {/* SVG Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background Ring */}
                    <circle
                        stroke="#e5e7eb" // gray-200
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Ring */}
                    <circle
                        stroke="#f59e0b" // yellow-500
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                {/* Time Text in Center */}
                <div className="absolute text-xl font-bold text-gray-700">
                    {remainingTime}s
                </div>
            </div>
            <span className="text-sm text-gray-400 mt-2 font-medium">Wait Time</span>
        </div>
    );
};
