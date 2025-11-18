
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from './types';
import { analyzeContent } from './services/geminiService';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { LandingPage } from './components/LandingPage';
import { sanitizeUserInput } from './utils/sanitize';
import { THEME, ERROR_MESSAGES } from './utils/constants';
import { logger } from './utils/logger';

export type Theme = 'light' | 'gray' | 'dark';
export interface ImageFile {
  file: File;
  base64: string;
}

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME.STORAGE_KEY);
    return (savedTheme || THEME.DEFAULT) as Theme;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME.STORAGE_KEY, theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'gray';
      if (prevTheme === 'gray') return 'dark';
      return 'light';
    });
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmitting) {
      logger.warn('Attempted double submission');
      return;
    }

    if (!userInput.trim() && imageFiles.length === 0) {
      setError(ERROR_MESSAGES.EMPTY_INPUT);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Sanitize user input
      const sanitizedInput = sanitizeUserInput(userInput);

      logger.info('Starting analysis', {
        textLength: sanitizedInput.length,
        imageCount: imageFiles.length
      });

      const imagePayloads = imageFiles.map(img => ({
        mimeType: img.file.type,
        data: img.base64
      }));

      const result = await analyzeContent(sanitizedInput, imagePayloads);
      setAnalysisResult(result);

      logger.info('Analysis successful', {
        taskCount: result.tasks.length
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);

      logger.error('Analysis failed', err as Error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setImageFiles([]);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    logger.info('Reset application state');
  }

  const handleGoToLanding = () => {
    setView('landing');
  };

  const bgClass = theme === 'gray' ? 'bg-gray-200' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass} dark:bg-gray-900 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-300`}>
      {view === 'landing' ? (
        <LandingPage onEnterApp={() => setView('app')} theme={theme} onThemeToggle={handleThemeToggle} />
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <Header onReset={handleReset} onGoToLanding={handleGoToLanding} theme={theme} onThemeToggle={handleThemeToggle} />
          <main className="mt-8">
            <InputSection
              userInput={userInput}
              setUserInput={setUserInput}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              setError={setError}
            />
            <div className="mt-12">
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
              {analysisResult && <OutputSection result={analysisResult} />}
              {!isLoading && !error && !analysisResult && <WelcomeMessage />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
