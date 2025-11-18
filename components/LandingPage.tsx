
import React from 'react';
import { Theme } from '../App';
import { UnscatterLogo, ThemeToggleButton } from './Header';

interface LandingPageProps {
  onEnterApp: () => void;
  theme: Theme;
  onThemeToggle: () => void;
}

const LandingHeader: React.FC<{ theme: Theme; onThemeToggle: () => void; }> = ({ theme, onThemeToggle }) => (
    <header className="flex justify-between items-center py-4 w-full">
      <div className="flex items-center cursor-default">
        <UnscatterLogo />
        <h1 className="hidden sm:block text-2xl font-bold text-gray-900 dark:text-white ml-2">
          Unscatter
        </h1>
      </div>
      <ThemeToggleButton theme={theme} onToggle={onThemeToggle} />
    </header>
);

const CTAButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
  >
    {children}
  </button>
);

const Divider: React.FC = () => <hr className="my-16 sm:my-24 border-gray-200 dark:border-gray-700" />;

const HowItWorksSteps = [
    { title: "Dump Everything In", description: "Tasks, ideas, images, links, half-thoughts. No formatting. No sorting. Just input." },
    { title: "Automatic Clustering", description: "The system groups related items using semantic logic. Your randomness becomes structured categories instantly." },
    { title: "Visual Dependency Mapping", description: "See what blocks progress. Understand sequences without thinking." },
    { title: "Energy + Impact Scoring", description: "Each item gets evaluated for energy cost, outcome impact, and clarity vs ambiguity. It exposes what actually matters." },
    { title: "The Next Step Spotlight", description: "One item is always highlighted as the optimal next action. Low effort. High clarity. No decision tax." }
];

const FeatureItems = [
    { title: "Nonlinear visual workspace", description: "Drag ideas freely. No rigid lists or grids." },
    { title: "Automatic organization", description: "Clustering without manual sorting." },
    { title: "Real dependency mapping", description: "Detects bottlenecks and hidden prerequisites." },
    { title: "Cognitive-load scoring", description: "Ranks items by mental cost, not fake productivity." },
    { title: "A single definitive next step", description: "The system cuts through noise and points to one action." },
    { title: "Designed for ADHD/ND users", description: "No overload. Minimal UI. Fast pattern recognition." }
];

const ProofItems = [
    { title: "ND-friendly by design", description: "Every element reduces cognitive load. No decoration. No emotional noise." },
    { title: "Zero decision paralysis", description: "One clear next step replaces endless prioritization." },
    { title: "Faster activation", description: "Users take action because the system removes thinking overhead." },
    { title: "Built from first-principles", description: "Not a clone of existing planners. Engineered strictly for clarity → action." }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, theme, onThemeToggle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
      <LandingHeader theme={theme} onThemeToggle={onThemeToggle} />
      
      <main className="mt-12 sm:mt-16">

        <section className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">Unscatter</h1>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-400">From scattered to clear. Your next step, visualized.</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            A visual planning system for ADHD/ND minds that compresses chaos into a single, actionable map.
            No clutter. No overwhelm. Just clarity and direction.
          </p>
          <div className="mt-10">
            <CTAButton onClick={onEnterApp}>Open The App</CTAButton>
          </div>
        </section>

        <Divider />

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How Unscatter Works</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Unscatter turns mental noise into visual structure. Five steps. Zero friction.</p>
          <div className="mt-12 space-y-10">
            {HowItWorksSteps.map((step, index) => (
                <div key={index} className="grid md:grid-cols-5 gap-4 text-left items-center">
                    <div className="md:col-span-1 text-center md:text-right">
                        <span className="text-blue-600 dark:text-blue-400 text-5xl font-bold">{index + 1}.</span>
                    </div>
                    <div className="md:col-span-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                </div>
            ))}
          </div>
        </section>

        <Divider />
        
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Features That Actually Matter</h2>
          <p className="mt-3 text-lg text-center text-gray-600 dark:text-gray-400">You don’t need customization. You need clarity.</p>
          <ul className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {FeatureItems.map((item, index) => (
              <li key={index} className="flex">
                <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold mr-4">•</span>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        
        <Divider />
        
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Proof It Works</h2>
          <p className="mt-3 text-lg text-center text-gray-600 dark:text-gray-400">Not testimonials. Logic.</p>
          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            {ProofItems.map((item, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
            ))}
          </div>
        </section>
        
        <Divider />

        <section className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Unscatter Exists</h2>
             <div className="mt-4 text-lg space-y-4 text-gray-600 dark:text-gray-300">
                <p>Most tools generate more overwhelm. Unscatter removes it.</p>
                <p>You don’t need another place to store tasks. You need a system that makes them obvious.</p>
             </div>
        </section>

        <Divider />

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Get Access</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Unscatter is in early access. If you want clarity instead of more tools, join now.</p>
          <div className="mt-8">
            <CTAButton onClick={onEnterApp}>Open The App</CTAButton>
          </div>
        </section>

      </main>
      
      <footer className="text-center py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Reduce chaos. Reveal the next step.</p>
      </footer>
    </div>
  );
};
