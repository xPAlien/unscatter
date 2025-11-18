
import React from 'react';

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to Unscatter</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                This is a cognitive ergonomics tool, not a to-do list.
                Input your scattered thoughts, tasks, and notes above.
                The system will analyze the chaos and present a single, actionable next step.
            </p>
            <div className="mt-6 text-sm text-gray-500">
                <p><span className="font-semibold">Principle:</span> Reduce cognitive load.</p>
                <p><span className="font-semibold">Objective:</span> Reveal clarity from complexity.</p>
            </div>
        </div>
    );
};
