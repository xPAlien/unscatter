import React from 'react';
import { Theme } from '../App';

export const UnscatterLogo: React.FC = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        {/* Converging lines */}
        <g strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-gray-900 dark:stroke-gray-100">
            <path d="M4 10 L20 20 L24 24" />
            <path d="M4 17 L20 22 L24 24" />
            <path d="M4 24 H 24" />
            <path d="M4 31 L20 26 L24 24" />
            <path d="M4 38 L20 28 L24 24" />
        </g>
        
        {/* Arrow */}
        <path d="M24 24 H44 M38 18 L44 24 L38 30" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ThemeToggleButton: React.FC<{ theme: Theme, onToggle: () => void }> = ({ theme, onToggle }) => {
  const icons: Record<Theme, React.ReactNode> = {
    light: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    gray: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12a5 5 0 015-5m0 0a5 5 0 015 5m-5-5v10m0 0a5 5 0 005-5m-5 5a5 5 0 01-5-5" />
      </svg>
    ),
    dark: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  };
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Toggle theme"
    >
      {icons[theme]}
    </button>
  );
};


interface HeaderProps {
    onReset: () => void;
    onGoToLanding: () => void;
    theme: Theme;
    onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onGoToLanding, theme, onThemeToggle }) => {
    return (
        <header className="flex justify-between items-center">
            <button 
                onClick={onGoToLanding}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500 rounded-lg p-1"
                aria-label="Go to homepage"
            >
                <UnscatterLogo />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Unscatter
                </h1>
            </button>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to clear all input and results?')) {
                            onReset();
                        }
                    }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    Clear All
                </button>
                <ThemeToggleButton theme={theme} onToggle={onThemeToggle} />
            </div>
        </header>
    );
};